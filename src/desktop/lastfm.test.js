import { art, recentList, topList, pickHero } from "./lastfm";

const img = (u) => [
  { size: "small", "#text": "s.jpg" },
  { size: "extralarge", "#text": u },
];
const star =
  "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png";

test("picks the largest image and ignores Last.fm's placeholder star", () => {
  expect(art(img("big.jpg"))).toBe("big.jpg");
  expect(art(img(star))).toBeNull();
  expect(art([])).toBeNull();
});

const recentJson = (nowPlaying) => ({
  recenttracks: {
    track: [
      {
        name: "DESTINO",
        artist: { "#text": "Lori Meyers" },
        image: img("a.jpg"),
        url: "u1",
        ...(nowPlaying
          ? { "@attr": { nowplaying: "true" } }
          : { date: { uts: "1794308261" } }),
      },
      {
        name: "Old",
        artist: { "#text": "X" },
        image: [],
        url: "u2",
        date: { uts: "1794300000" },
      },
    ],
  },
});
const topJson = {
  toptracks: {
    track: [
      {
        name: "En Valmy",
        artist: { name: "Alcalá Norte" },
        playcount: "3",
        image: img(star),
        url: "u",
      },
    ],
  },
};

test("recent tracks: live flag and play time", () => {
  const [a, b] = recentList(recentJson(true));
  expect(a).toMatchObject({
    name: "DESTINO",
    artist: "Lori Meyers",
    live: true,
    at: null,
    art: "a.jpg",
  });
  expect(b).toMatchObject({ live: false, at: 1794300000000 });
  // Last.fm sends a single object instead of a list when there's one track
  expect(
    recentList({
      recenttracks: { track: recentJson(false).recenttracks.track[1] },
    }),
  ).toHaveLength(1);
  expect(recentList({})).toEqual([]);
});

test("hero is the live track, else the week's top track", () => {
  const top = topList(topJson);
  expect(top[0]).toMatchObject({ name: "En Valmy", plays: 3, art: null });
  expect(pickHero(recentList(recentJson(true)), top).name).toBe("DESTINO");
  expect(pickHero(recentList(recentJson(false)), top)).toMatchObject({
    name: "En Valmy",
    live: false,
  });
  expect(pickHero([], [])).toBeNull();
});
