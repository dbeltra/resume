// Last.fm data for the Spotify app: what's playing (or the week's top
// track), recent plays and the week's top tracks. The key is read-only and
// ships in the bundle (a static site can't hide it); it's kept out of git in
// .env.local. To hide it, point API at a small proxy that adds the key.
const API = "https://ws.audioscrobbler.com/2.0/";
const KEY = process.env.REACT_APP_LASTFM_KEY;
export const USER = "dbeltra";
// Last.fm's grey star, returned when a track has no art
const PLACEHOLDER = "2a96cbd8b46e442fc41c2b86b821562f";

export const enabled = !!KEY;

export const art = (images = []) => {
  const url = images.length ? images[images.length - 1]["#text"] : "";
  return url && !url.includes(PLACEHOLDER) ? url : null;
};

// newest first; the one being scrobbled right now has live: true, at: null
export const recentList = (json) =>
  [].concat(json?.recenttracks?.track || []).map((t) => ({
    name: t.name,
    artist: t.artist["#text"],
    art: art(t.image),
    url: t.url,
    live: t["@attr"]?.nowplaying === "true",
    at: t.date ? Number(t.date.uts) * 1000 : null,
  }));

export const topList = (json) =>
  [].concat(json?.toptracks?.track || []).map((t) => ({
    name: t.name,
    artist: t.artist.name,
    plays: Number(t.playcount),
    art: art(t.image),
    url: t.url,
  }));

// option 3: the live track, else the week's #1
// top tracks never carry art (only the placeholder star), so the "on repeat"
// song borrows its cover from the same song in recent plays when it's there
const same = (a, b) =>
  a.name.toLowerCase() === b.name.toLowerCase() &&
  a.artist.toLowerCase() === b.artist.toLowerCase();
export const pickHero = (recent, top) =>
  recent.find((t) => t.live) ||
  (top[0] && {
    ...top[0],
    art:
      top[0].art || recent.find((r) => r.art && same(r, top[0]))?.art || null,
    live: false,
  }) ||
  null;

const call = async (params) => {
  const q = new URLSearchParams({ ...params, api_key: KEY, format: "json" });
  const res = await fetch(`${API}?${q}`);
  if (!res.ok) throw new Error(`last.fm ${res.status}`);
  return res.json();
};

export async function getLibrary() {
  const [r, t] = await Promise.all([
    call({ method: "user.getrecenttracks", user: USER, limit: 6 }),
    call({ method: "user.gettoptracks", user: USER, period: "7day", limit: 5 }),
  ]);
  const recent = recentList(r);
  const top = topList(t);
  const hero = pickHero(recent, top);
  if (hero && !hero.art) {
    // top tracks come without art since 2019; the album's art is on track.getInfo
    const info = await call({
      method: "track.getinfo",
      artist: hero.artist,
      track: hero.name,
    }).catch(() => null);
    hero.art = art(info?.track?.album?.image);
  }
  return { hero, recent: recent.filter((x) => !x.live).slice(0, 5), top };
}

// the desktop widget's songs: playing now (or last played) first, then the
// ones before it, for the widget's previous/next buttons
export async function getRecentSongs(limit = 6) {
  const songs = recentList(
    await call({ method: "user.getrecenttracks", user: USER, limit }),
  );
  const first = songs[0];
  if (first && !first.art) {
    const info = await call({
      method: "track.getinfo",
      artist: first.artist,
      track: first.name,
    }).catch(() => null);
    first.art = art(info?.track?.album?.image);
  }
  // Last.fm can list the playing song twice (live + just scrobbled)
  return songs.filter(
    (x, i) => i === 0 || x.name !== songs[i - 1].name || x.live,
  );
}

// 30-second preview from Apple's public search API (no key, CORS allowed);
// only called when someone presses play. null when there's no match.
const previews = new Map();
export const findPreview = (song) => {
  const k = `${song.artist} ${song.name}`;
  if (!previews.has(k))
    previews.set(
      k,
      fetch(
        `https://itunes.apple.com/search?entity=song&limit=1&term=${encodeURIComponent(k)}`,
      )
        .then((r) => r.json())
        .then((d) => d.results?.[0]?.previewUrl || null)
        .catch(() => null),
    );
  return previews.get(k);
};

export const spotify = (m) =>
  `https://open.spotify.com/search/${encodeURIComponent(`${m.artist} ${m.name}`)}`;
