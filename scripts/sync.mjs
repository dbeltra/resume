// Pulls the Shelf (Letterboxd + Trakt + Hardcover + a games sheet) and Photos
// (Instagram) feeds into
// public/feeds/, images included, so the site never calls those services.
// Runs in the scheduled GitHub Action before each build, or locally with
// `npm run sync`. A source with no token is skipped; any fetch error exits 1
// so the Action stops before deploying and the live site keeps its last data.
import { mkdir, rm, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const OUT = new URL("../public/feeds/", import.meta.url);
const LETTERBOXD_USER = process.env.LETTERBOXD_USER || "dbeltra";
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID || "17841401855022727"; // @dbeltra
const SHELF_PER_KIND = 10; // latest 10 films, 10 shows and 10 books
const TRAKT_USER = process.env.TRAKT_USER || "dbeltra";
// a Google Sheet published as CSV: title, platform[, cover, url], in the
// order the shelf shows them
const GAMES_CSV_URL = process.env.GAMES_CSV_URL;
const PHOTOS_MAX = 30;

const tag = (xml, name) =>
  xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1].trim();
const unescape = (s) =>
  s
    ?.replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, "&");

// A synopsis for the shelf's detail panel: tags and whitespace out, cut at a
// sentence end within ~420 characters.
export const synopsis = (text, max = 420) => {
  const t = text
    ?.replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!t) return undefined;
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const end = Math.max(
    cut.lastIndexOf(". "),
    cut.lastIndexOf("! "),
    cut.lastIndexOf("? "),
  );
  return end > max / 3
    ? cut.slice(0, end + 1)
    : `${cut.replace(/\s+\S*$/, "")}…`;
};

// Letterboxd diary RSS -> films. List entries carry no filmTitle and are skipped.
export const parseLetterboxd = (xml) =>
  [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
    .map(([, it]) => ({
      kind: "film",
      title: unescape(tag(it, "letterboxd:filmTitle")),
      year: Number(tag(it, "letterboxd:filmYear")) || undefined,
      rating: Number(tag(it, "letterboxd:memberRating")) || undefined,
      at: tag(it, "letterboxd:watchedDate"),
      url: tag(it, "link"),
      image: tag(it, "description")?.match(/<img src="([^"]+)"/)?.[1],
    }))
    .filter((f) => f.title && f.image);

// Trakt watch history -> shows, one per show (its latest episode), newest
// first. Posters come as scheme-less paths ("media.trakt.tv/…/poster.webp").
export const parseTrakt = (history) => {
  const seen = new Map();
  for (const h of history || [])
    if (h.show && !seen.has(h.show.ids?.trakt)) seen.set(h.show.ids?.trakt, h);
  return [...seen.values()]
    .map(({ show, episode, watched_at }) => ({
      kind: "show",
      title: show.title,
      year: show.year || undefined,
      by: episode && `S${episode.season} · E${episode.number}`,
      at: watched_at?.slice(0, 10),
      about: synopsis(show.overview),
      genres: show.genres?.slice(0, 3),
      url: `https://trakt.tv/shows/${show.ids?.slug}`,
      image: show.images?.poster?.[0] && `https://${show.images.poster[0]}`,
    }))
    .filter((x) => x.title && x.image);
};

// Hardcover -> books, currently reading first then read. A personal token
// only sees its owner's user_books but lacks the read:me scope, so the
// owner's id comes from one of those rows; filtering by it keeps the query
// fast (unfiltered, it times out).
const HARDCOVER_OWNER = `{ user_books(limit: 1) { user_id } }`;
const hardcoverBooks = (userId) => `{
  user_books(
    where: { user_id: { _eq: ${Number(userId)} }, status_id: { _in: [2, 3] } }
    order_by: [{ status_id: asc }, { updated_at: desc }]
    limit: ${SHELF_PER_KIND}
  ) {
    status_id
    rating
    updated_at
    book {
      title slug release_year cached_image cached_contributors description pages
    }
  }
}`;
export const parseHardcover = (json) =>
  (json.data?.user_books || [])
    .map((ub) => ({
      kind: "book",
      title: ub.book.title,
      by: ub.book.cached_contributors?.[0]?.author?.name,
      year: ub.book.release_year || undefined,
      rating: ub.rating || undefined,
      reading: ub.status_id === 2,
      at: ub.updated_at?.slice(0, 10),
      about: synopsis(ub.book.description),
      pages: ub.book.pages || undefined,
      url: `https://hardcover.app/books/${ub.book.slug}`,
      image: ub.book.cached_image?.url,
    }))
    .filter((b) => b.title && b.image);

// Instagram media -> photos. Albums show their first image; videos are skipped.
export const parseInstagram = (json) =>
  (json.data || [])
    .filter((m) => m.media_type !== "VIDEO" && m.media_url)
    .map((m) => ({
      caption: m.caption?.split("\n")[0].slice(0, 140) || "",
      at: m.timestamp?.slice(0, 10),
      url: m.permalink,
      image: m.media_url,
    }));

const UA = "davidbeltra-site/1.0 (https://davidbeltra.com)";
const get = async (url, opts = {}, retries = 2) => {
  // some CDNs (Trakt's) turn away requests without a user agent
  const headers = { "user-agent": UA, ...opts.headers };
  const r = await fetch(url, { ...opts, headers });
  // rate-limited (Wikimedia does this): wait as asked, at most 10 s, retry
  if (r.status === 429 && retries) {
    const wait = Math.min(Number(r.headers.get("retry-after")) || 3, 10);
    await new Promise((ok) => setTimeout(ok, wait * 1000));
    return get(url, opts, retries - 1);
  }
  if (!r.ok) throw new Error(`${r.status} ${url.split("?")[0]}`);
  return r;
};

// download each item's image next to the JSON; the site links the local copy
const save = async (name, items) => {
  const dir = new URL(`${name}/`, OUT);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  // one at a time: image hosts (Wikimedia) rate-limit bursts
  const out = [];
  for (const [i, { image, ...it }] of items.entries()) {
    if (!image) {
      out.push({ ...it, src: null }); // the site shows a title card
      continue;
    }
    const ext = image.match(/\.(webp|png|jpe?g)(\?|$)/i)?.[1] || "jpg";
    const file = `${name}/${String(i).padStart(2, "0")}.${ext}`;
    const buf = Buffer.from(await (await get(image)).arrayBuffer());
    await writeFile(new URL(file, OUT), buf);
    out.push({ ...it, src: `feeds/${file}` });
  }
  await writeFile(
    new URL(`${name}.json`, OUT),
    JSON.stringify({ updated: new Date().toISOString(), items: out }, null, 1),
  );
  console.log(`${name}: ${out.length} items`);
};

const letterboxd = async () =>
  parseLetterboxd(
    await (await get(`https://letterboxd.com/${LETTERBOXD_USER}/rss/`)).text(),
  );

const hardcover = async (token) => {
  const query = async (q) => {
    const json = await (
      await get("https://api.hardcover.app/v1/graphql", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        },
        body: JSON.stringify({ query: q }),
      })
    ).json();
    const err = json.errors?.[0]?.message || json.error;
    if (err) throw new Error(`hardcover: ${err}`);
    return json;
  };
  const owner = (await query(HARDCOVER_OWNER)).data.user_books[0]?.user_id;
  return owner ? parseHardcover(await query(hardcoverBooks(owner))) : [];
};

// Meta "unified login" system-user token (EAA…, set to never expire) with only
// instagram_basic. It can't look up the account id itself, hence the constant.
// Minimal CSV (Google Sheets export): quoted fields, "" escapes, CRLF.
export const parseCsv = (text) => {
  const rows = [[]];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') (field += c), i++;
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") rows.at(-1).push(field), (field = "");
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      rows.at(-1).push(field), (field = ""), rows.push([]);
    } else field += c;
  }
  rows.at(-1).push(field);
  const [head, ...body] = rows.filter((r) => r.some((x) => x.trim()));
  const keys = (head || []).map((k) => k.trim().toLowerCase());
  return body.map((r) =>
    Object.fromEntries(keys.map((k, i) => [k, (r[i] || "").trim()])),
  );
};

// the sheet's short platform names, spelled out (anything else as typed)
const PLATFORMS = { switch: "Nintendo Switch", steam: "Steam" };
const platform = (p) => PLATFORMS[p?.toLowerCase()] || p || undefined;

// Sheet rows -> game stubs, in the sheet's order (latest SHELF_PER_KIND).
export const parseGames = (rows) =>
  rows
    .filter((r) => r.title)
    .slice(0, SHELF_PER_KIND)
    .map((r) => ({
      kind: "game",
      title: r.title,
      by: platform(r.platform),
      url: r.url || undefined,
      image: r.cover || undefined,
    }));

// A game without its own cover gets Steam's, if it's on Steam: the store search (no key) finds
// the app, then Steam's store API gives its vertical library art (or the
// wide header for games without one).
const steamCover = async (game) => {
  const found = await (
    await get(
      `https://store.steampowered.com/api/storesearch/?cc=us&l=en&term=${encodeURIComponent(game.title)}`,
    )
  ).json();
  // only a result named like the game: Steam's first hit for a game it
  // doesn't sell can be something else entirely
  const norm = (x) => x.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const app = (found.items || []).find(
    (x) => norm(x.name) === norm(game.title),
  );
  if (!app) return null;
  // the art's exact paths: newer games keep it under a hashed folder
  const query = {
    ids: [{ appid: app.id }],
    context: { country_code: "US" },
    data_request: {
      include_assets: true,
      include_basic_info: true,
      include_release: true,
    },
  };
  const res = await (
    await get(
      `https://api.steampowered.com/IStoreBrowseService/GetItems/v1/?input_json=${encodeURIComponent(JSON.stringify(query))}`,
    )
  ).json();
  const item = res.response?.store_items?.[0];
  const a = item?.assets;
  const file = a?.library_capsule || a?.header;
  if (!file) return null;
  return {
    image: `https://shared.steamstatic.com/store_item_assets/${a.asset_url_format.replace("${FILENAME}", file).split("?")[0]}`,
    url: `https://store.steampowered.com/app/${app.id}`,
    about: synopsis(item.basic_info?.short_description),
    year: item.release?.steam_release_date
      ? new Date(item.release.steam_release_date * 1000).getFullYear()
      : undefined,
  };
};

// No Steam match (most Switch games): the box art from the game's Wikipedia
// infobox. The search and the page's lead section come back in one call,
// then the file's direct URL in a second. Wikipedia rate-limits bursts, so
// games are looked up one after another.
const WIKI = "https://en.wikipedia.org/w/api.php?format=json&formatversion=2&";
const wiki = async (q) => (await get(WIKI + new URLSearchParams(q))).json();
export const infoboxImage = (wikitext) =>
  wikitext
    ?.match(
      /\|\s*image\s*=\s*(?:\[\[)?(?:File:|Image:)?([^|\]\n<]+?\.(?:jpe?g|png|webp|gif))/i,
    )?.[1]
    ?.trim();
// One Wikipedia search returns the best page's intro (the synopsis) and its
// lead section (for the infobox image); a second call turns that image's
// file name into a URL, only when asked for.
const wikiLookup = async (term, { cover = false } = {}) => {
  const found = await wiki({
    action: "query",
    generator: "search",
    gsrsearch: term,
    gsrlimit: "1",
    prop: cover ? "extracts|revisions" : "extracts",
    exintro: "1",
    explaintext: "1",
    ...(cover && { rvprop: "content", rvslots: "main", rvsection: "0" }),
  });
  const page = found.query?.pages?.[0];
  if (!page) return null;
  const out = { page: page.title, about: synopsis(page.extract) };
  const file = cover && infoboxImage(page.revisions?.[0]?.slots?.main?.content);
  if (file) {
    const info = await wiki({
      action: "query",
      titles: `File:${file}`,
      prop: "imageinfo",
      iiprop: "url",
    });
    out.image = info.query?.pages?.[0]?.imageinfo?.[0]?.url?.split("?")[0];
  }
  return out;
};

// Films get their synopsis from Wikipedia (Letterboxd's feed has none),
// looked up one by one with a pause: Wikipedia rate-limits bursts.
const withFilmSynopses = async (films) => {
  const out = [];
  for (const f of films) {
    const wp = await wikiLookup(`${f.title} ${f.year || ""} film`).catch(
      () => null,
    );
    out.push({ ...f, about: wp?.about });
    await pause(500);
  }
  return out;
};
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

const games = async (csvUrl) => {
  const list = parseGames(parseCsv(await (await get(csvUrl)).text()));
  const out = [];
  for (const g of list) {
    const steam = await steamCover(g).catch(() => null);
    if (steam) {
      out.push({
        ...g,
        image: g.image || steam.image,
        url: g.url || steam.url,
        about: steam.about,
        year: steam.year,
      });
      continue;
    }
    // not on Steam (most Switch games): Wikipedia for the synopsis and,
    // unless the sheet has one, the box art from the infobox
    const wp = await wikiLookup(`${g.title} video game`, {
      cover: !g.image,
    }).catch((e) => {
      console.warn(
        `games: Wikipedia lookup failed for "${g.title}" (${e.message})`,
      );
      return null;
    });
    await pause(1000); // be gentle with Wikipedia
    const image = g.image || wp?.image;
    if (wp?.image && !g.image)
      console.log(`games: "${g.title}" cover from Wikipedia ("${wp.page}")`);
    // without a cover it's still kept: the shelf shows its title instead
    if (!image)
      console.warn(
        `games: no cover found for "${g.title}", add one in the sheet`,
      );
    out.push({ ...g, image, about: wp?.about });
  }
  return out;
};

const trakt = async (clientId) =>
  parseTrakt(
    await (
      await get(
        `https://api.trakt.tv/users/${TRAKT_USER}/history/shows?limit=100&extended=full,images`,
        {
          headers: {
            "content-type": "application/json",
            "trakt-api-version": "2",
            "trakt-api-key": clientId,
          },
        },
      )
    ).json(),
  );

const instagram = async (token) => {
  const fields = "media_type,media_url,caption,timestamp,permalink";
  return parseInstagram(
    await (
      await get(
        `https://graph.facebook.com/v21.0/${INSTAGRAM_USER_ID}/media?fields=${fields}&limit=${PHOTOS_MAX}&access_token=${token}`,
      )
    ).json(),
  );
};

const main = async () => {
  await mkdir(OUT, { recursive: true });
  const { HARDCOVER_TOKEN, INSTAGRAM_TOKEN, TRAKT_CLIENT_ID } = process.env;

  const [films, shows, books, played] = await Promise.all([
    letterboxd().then(withFilmSynopses),
    TRAKT_CLIENT_ID ? trakt(TRAKT_CLIENT_ID) : [],
    HARDCOVER_TOKEN ? hardcover(HARDCOVER_TOKEN) : [],
    GAMES_CSV_URL ? games(GAMES_CSV_URL) : [],
  ]);
  if (!GAMES_CSV_URL) console.log("games: no GAMES_CSV_URL, skipped");
  if (!TRAKT_CLIENT_ID) console.log("trakt: no TRAKT_CLIENT_ID, skipped");
  if (!HARDCOVER_TOKEN) console.log("hardcover: no HARDCOVER_TOKEN, skipped");
  // the latest SHELF_PER_KIND of each: films, shows and books newest first
  // by date; games keep the sheet's row order
  const shelf = [
    ...[films, shows, books]
      .flatMap((xs) => xs.slice(0, SHELF_PER_KIND))
      .sort((a, b) => (b.at || "").localeCompare(a.at || "")),
    ...played,
  ];
  await save("shelf", shelf);

  if (INSTAGRAM_TOKEN) await save("photos", await instagram(INSTAGRAM_TOKEN));
  else console.log("instagram: no INSTAGRAM_TOKEN, skipped");
};

if (import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
