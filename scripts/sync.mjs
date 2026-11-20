// Pulls the Shelf (Letterboxd + Trakt + Hardcover) and Photos (Instagram) feeds into
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
    book { title slug release_year cached_image cached_contributors }
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

const get = async (url, opts = {}) => {
  // some CDNs (Trakt's) turn away requests without a user agent
  const headers = { "user-agent": "davidbeltra-site/1.0", ...opts.headers };
  const r = await fetch(url, { ...opts, headers });
  if (!r.ok) throw new Error(`${r.status} ${url.split("?")[0]}`);
  return r;
};

// download each item's image next to the JSON; the site links the local copy
const save = async (name, items) => {
  const dir = new URL(`${name}/`, OUT);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  const out = await Promise.all(
    items.map(async ({ image, ...it }, i) => {
      const ext = image.match(/\.(webp|png|jpe?g)(\?|$)/i)?.[1] || "jpg";
      const file = `${name}/${String(i).padStart(2, "0")}.${ext}`;
      const buf = Buffer.from(await (await get(image)).arrayBuffer());
      await writeFile(new URL(file, OUT), buf);
      return { ...it, src: `feeds/${file}` };
    }),
  );
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

  const [films, shows, books] = await Promise.all([
    letterboxd(),
    TRAKT_CLIENT_ID ? trakt(TRAKT_CLIENT_ID) : [],
    HARDCOVER_TOKEN ? hardcover(HARDCOVER_TOKEN) : [],
  ]);
  if (!TRAKT_CLIENT_ID) console.log("trakt: no TRAKT_CLIENT_ID, skipped");
  if (!HARDCOVER_TOKEN) console.log("hardcover: no HARDCOVER_TOKEN, skipped");
  // the latest SHELF_PER_KIND of each, then newest first across kinds
  const shelf = [films, shows, books]
    .flatMap((xs) => xs.slice(0, SHELF_PER_KIND))
    .sort((a, b) => (b.at || "").localeCompare(a.at || ""));
  await save("shelf", shelf);

  if (INSTAGRAM_TOKEN) await save("photos", await instagram(INSTAGRAM_TOKEN));
  else console.log("instagram: no INSTAGRAM_TOKEN, skipped");
};

if (import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
