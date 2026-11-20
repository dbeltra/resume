// node --test scripts/   (the parsers only; network calls aren't tested)
import assert from "node:assert/strict";
import test from "node:test";
import {
  parseHardcover,
  parseInstagram,
  parseLetterboxd,
  parseTrakt,
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
    url: "https://trakt.tv/shows/severance",
    image: "https://media.trakt.tv/shows/1/p.webp",
  });
});
