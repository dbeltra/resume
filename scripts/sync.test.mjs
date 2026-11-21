// node --test scripts/   (the parsers only; network calls aren't tested)
import assert from "node:assert/strict";
import test from "node:test";
import {
  parseHardcover,
  parseInstagram,
  parseLetterboxd,
  parseTrakt,
  parseCsv,
  parseGames,
  infoboxImage,
  synopsis,
} from "./sync.mjs";

test("letterboxd: diary entries become films, lists are skipped", () => {
  const xml = `<rss><channel>
  <item> <title>Perfect Blue, 1997 - ★★★★</title> <link>https://letterboxd.com/dbeltra/film/perfect-blue/</link> <letterboxd:watchedDate>2026-11-15</letterboxd:watchedDate> <letterboxd:filmTitle>Perfect Blue</letterboxd:filmTitle> <letterboxd:filmYear>1997</letterboxd:filmYear> <letterboxd:memberRating>4.0</letterboxd:memberRating> <description><![CDATA[ <p><img src="https://a.ltrbxd.com/p.jpg?v=1"/></p> ]]></description> </item>
  <item> <title>Tom &amp; Jerry</title> <link>https://letterboxd.com/dbeltra/film/x/</link> <letterboxd:filmTitle>Tom &amp; Jerry</letterboxd:filmTitle> <description><![CDATA[ <p><img src="https://a.ltrbxd.com/q.jpg"/></p> ]]></description> </item>
  <item> <title>My list</title> <link>https://letterboxd.com/dbeltra/list/x/</link> <description>a list</description> </item>
  </channel></rss>`;
  const films = parseLetterboxd(xml);
  assert.equal(films.length, 2);
  assert.deepEqual(films[0], {
    kind: "film",
    title: "Perfect Blue",
    year: 1997,
    rating: 4,
    at: "2026-11-15",
    url: "https://letterboxd.com/dbeltra/film/perfect-blue/",
    image: "https://a.ltrbxd.com/p.jpg?v=1",
  });
  assert.equal(films[1].title, "Tom & Jerry");
  assert.equal(films[1].rating, undefined);
});

test("hardcover: books with author, reading flag, no-cover skipped", () => {
  const book = (title, image) => ({
    title,
    slug: "dune",
    release_year: 1965,
    cached_image: image && { url: image },
    cached_contributors: [{ author: { name: "Frank Herbert" } }],
  });
  const books = parseHardcover({
    data: {
      user_books: [
        {
          status_id: 2,
          rating: null,
          updated_at: "2026-11-01T10:00:00",
          book: book("Dune", "https://c/d.jpg"),
        },
        {
          status_id: 3,
          rating: 4.5,
          updated_at: "2026-10-01T10:00:00",
          book: book("No cover"),
        },
      ],
    },
  });
  assert.equal(books.length, 1);
  assert.equal(books[0].by, "Frank Herbert");
  assert.equal(books[0].reading, true);
  assert.equal(books[0].at, "2026-11-01");
  assert.equal(books[0].url, "https://hardcover.app/books/dune");
});

test("instagram: videos skipped, caption trimmed to first line", () => {
  const photos = parseInstagram({
    data: [
      {
        media_type: "IMAGE",
        media_url: "https://i/1.jpg",
        caption: "Montserrat\n#hike",
        timestamp: "2026-08-02T09:00:00+0000",
        permalink: "https://instagram.com/p/1",
      },
      { media_type: "VIDEO", media_url: "https://i/2.mp4" },
      {
        media_type: "CAROUSEL_ALBUM",
        media_url: "https://i/3.jpg",
        timestamp: "2026-07-01T09:00:00+0000",
      },
    ],
  });
  assert.equal(photos.length, 2);
  assert.equal(photos[0].caption, "Montserrat");
  assert.equal(photos[0].at, "2026-08-02");
  assert.equal(photos[1].caption, "");
});

test("trakt: one entry per show, its latest episode, https poster", () => {
  const ep = (slug, id, s, e, at, poster = true) => ({
    watched_at: at,
    episode: { season: s, number: e },
    show: {
      title: slug,
      year: 2022,
      ids: { trakt: id, slug },
      images: poster ? { poster: [`media.trakt.tv/shows/${id}/p.webp`] } : {},
    },
  });
  const shows = parseTrakt([
    ep("severance", 1, 2, 8, "2026-11-14T20:00:00.000Z"),
    ep("severance", 1, 2, 7, "2026-11-13T20:00:00.000Z"),
    ep("no-poster", 2, 1, 1, "2026-11-12T20:00:00.000Z", false),
  ]);
  assert.equal(shows.length, 1);
  assert.deepEqual(shows[0], {
    kind: "show",
    title: "severance",
    year: 2022,
    by: "S2 · E8",
    at: "2026-11-14",
    about: undefined,
    genres: undefined,
    url: "https://trakt.tv/shows/severance",
    image: "https://media.trakt.tv/shows/1/p.webp",
  });
});

test("games sheet: CSV with quotes and CRLF becomes up to 10 games", () => {
  const csv =
    "Title,Platform,Date,Cover\r\n" +
    '"Zelda: Tears of the Kingdom",Switch,2026-11-01,https://x/z.jpg\r\n' +
    "Balatro,Steam,2026-10-20,\r\n" +
    ",,,\r\n" +
    '"Say ""hi""",Switch,,\r\n';
  const rows = parseCsv(csv);
  assert.equal(rows.length, 3);
  assert.equal(rows[2].title, 'Say "hi"');
  const games = parseGames(rows);
  assert.deepEqual(games[0], {
    kind: "game",
    title: "Zelda: Tears of the Kingdom",
    by: "Nintendo Switch",
    url: undefined,
    image: "https://x/z.jpg",
  });
  assert.equal(games[1].image, undefined); // Steam fills it in at sync time
  assert.equal(games[1].by, "Steam");
  assert.equal(parseGames([{ title: "X", platform: "PS5" }])[0].by, "PS5");
  const many = parseGames(
    Array.from({ length: 14 }, (_, i) => ({ title: `G${i}` })),
  );
  assert.equal(many.length, 10);
});

test("games: the cover file is read from a Wikipedia infobox", () => {
  const box = (line) =>
    `{{Infobox video game\n| title = X\n${line}\n| developer = Y\n}}`;
  assert.equal(
    infoboxImage(box("| image = MarioKart8Boxart.jpg")),
    "MarioKart8Boxart.jpg",
  );
  assert.equal(
    infoboxImage(box("| image = [[File:Zelda OoT.png|250px]]")),
    "Zelda OoT.png",
  );
  assert.equal(infoboxImage(box("|image=File:Box art.webp")), "Box art.webp");
  assert.equal(infoboxImage(box("| image = ")), undefined);
  assert.equal(infoboxImage(undefined), undefined);
});

test("synopsis: tags out, cut at a sentence end", () => {
  assert.equal(synopsis("<i>Hello</i>  world.&nbsp;"), "Hello world.");
  assert.equal(synopsis(""), undefined);
  const long = "First sentence here. " + "word ".repeat(120);
  assert.equal(synopsis(long, 50), "First sentence here.");
  const noStop = "word ".repeat(120);
  assert.match(synopsis(noStop, 100), /…$/);
  assert.ok(synopsis(noStop, 100).length <= 101);
});
