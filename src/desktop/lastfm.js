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
    album: t.album?.["#text"] || null,
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
// song borrows a cover from recent plays: the same song if it's there, else
// another song by the same artist. Names compare case-insensitively (Last.fm
// keeps "Angine de Poitrine" and "Angine de poitrine" apart).
const lc = (x) => x.toLowerCase();
const sameSong = (recent, t) =>
  recent.find(
    (r) => r.art && lc(r.name) === lc(t.name) && lc(r.artist) === lc(t.artist),
  )?.art;
const sameArtist = (recent, t) =>
  recent.find((r) => r.art && lc(r.artist) === lc(t.artist))?.art;
const coverFrom = (recent, t) =>
  sameSong(recent, t) || sameArtist(recent, t) || null;
export const pickHero = (recent, top) =>
  recent.find((t) => t.live) ||
  (top[0] && {
    ...top[0],
    art: top[0].art || coverFrom(recent, top[0]),
    live: false,
  }) ||
  null;
const call = async (params) => {
  const q = new URLSearchParams({ ...params, api_key: KEY, format: "json" });
  const res = await fetch(`${API}?${q}`);
  if (!res.ok) throw new Error(`last.fm ${res.status}`);
  return res.json();
};

// A song still without a cover (Last.fm often sends only its placeholder
// star, e.g. for the song playing right now) tries, in order: the same song
// in recent plays, Last.fm's track info, its album info, and finally another
// recent song by the same artist. Mutates song.art.
async function fillArt(song, recent) {
  if (!song || song.art) return;
  song.art = sameSong(recent, song) || null;
  if (song.art) return;
  const info = await call({
    method: "track.getinfo",
    artist: song.artist,
    track: song.name,
  }).catch(() => null);
  song.art = art(info?.track?.album?.image);
  if (!song.art && (song.album || info?.track?.album?.title)) {
    const al = await call({
      method: "album.getinfo",
      artist: song.artist,
      album: song.album || info.track.album.title,
    }).catch(() => null);
    song.art = art(al?.album?.image);
  }
  song.art = song.art || sameArtist(recent, song) || null;
}

export async function getLibrary() {
  const [r, t] = await Promise.all([
    // 50 plays to find covers in; only the newest are listed
    call({ method: "user.getrecenttracks", user: USER, limit: 50 }),
    call({ method: "user.gettoptracks", user: USER, period: "7day", limit: 5 }),
  ]);
  const recent = recentList(r);
  const top = topList(t);
  const hero = pickHero(recent, top);
  const list = recent.filter((x) => !x.live).slice(0, 5);
  await Promise.all([hero, ...list].map((x) => fillArt(x, recent)));
  return { hero, recent: list, top };
}

// the desktop widget's songs: playing now (or last played) first, then the
// ones before it, for the widget's previous/next buttons
export async function getRecentSongs(limit = 6) {
  // 50 plays to find covers in; the widget steps through the newest few
  const recent = recentList(
    await call({ method: "user.getrecenttracks", user: USER, limit: 50 }),
  );
  // Last.fm can list the playing song twice (live + just scrobbled)
  const songs = recent
    .filter((x, i) => i === 0 || x.name !== recent[i - 1].name || x.live)
    .slice(0, limit);
  await Promise.all(songs.map((x) => fillArt(x, recent)));
  return songs;
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
