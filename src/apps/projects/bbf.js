import React from "react";
import { Article, Bullets, H, Intro, Shots, Snippet, useCopy } from "./ui";
import ListShot from "../../assets/images/bbf/list.jpg";
import RatingShot from "../../assets/images/bbf/rating.jpg";
import FilterShot from "../../assets/images/bbf/filter.jpg";

// The Barcelona Beer Festival list, a personal side project. Its code is
// public, so the snippet is a trimmed excerpt of the real thing.

const REPO = "https://github.com/dbeltra/bbf2026";
const SHOTS = [ListShot, RatingShot, FilterShot];

const MATCH = `// Untappd searches by beer name, and plenty of breweries make a "Pale Ale".
// So: search the name, then take the first result whose brewery matches ours,
// loosely, because "Brasserie Cantillon" and "Cantillon" are the same place.
const normalise = (s) =>
  s.toLowerCase().replace(/[^a-z0-9\\s]/g, ' ').replace(/\\s+/g, ' ').trim();

function breweryMatches(untappdBrewery, ourBrewery) {
  const a = normalise(untappdBrewery);
  const b = normalise(ourBrewery);
  return a.includes(b) || b.includes(a);
}

function findRating(html, targetBrewery) {
  for (const item of html.split('<div class="beer-item').slice(1)) {
    const brewery = item.match(/<p class="brewery">\\s*<a[^>]*>([^<]+)<\\/a>/i);
    if (brewery && breweryMatches(brewery[1], targetBrewery))
      return item.match(/data-rating="([\\d.]+)"/)?.[1] ?? null;
  }
  return null;
}`;

const COPY = {
  en: {
    title: "Barcelona Beer Festival list",
    pitch:
      "Three hundred and forty-seven beers and one afternoon. A phone list of everything on tap at the festival, with each beer’s Untappd rating, so I could sort by what’s actually good.",
    source: "Source on GitHub",
    shotsH: "On the phone",
    shots: [
      "Every beer, with style, ABV, IBU, origin and tags",
      "Sorted by Untappd rating, best first",
      "Filters: style, brewery, origin, tags and search",
    ],
    builtH: "How it works",
    bullets: [
      [
        "The list.",
        "The festival’s beers as a tab-separated file, with tags like New, Gluten Free or 0% written into the name the way the festival did, parsed back out.",
      ],
      [
        "The ratings.",
        "A Node script looks each beer up on Untappd, matches the brewery, saves the rating to the same file, and stops politely when it gets rate-limited.",
      ],
      [
        "The app.",
        "Plain JavaScript modules and a service worker, so it opens offline in a festival with no signal, hosted on Netlify.",
      ],
    ],
    codeH: "Finding the right beer",
    caption: "scripts/scraper.js · trimmed from the public repo",
  },
  es: {
    title: "Lista del Barcelona Beer Festival",
    pitch:
      "Trescientas cuarenta y siete cervezas y una tarde. Una lista para el móvil con todo lo que había en el festival y la nota de Untappd de cada cerveza, para poder ordenar por lo que de verdad está bueno.",
    source: "Código en GitHub",
    shotsH: "En el móvil",
    shots: [
      "Todas las cervezas, con estilo, graduación, IBU, origen y etiquetas",
      "Ordenadas por nota de Untappd, las mejores primero",
      "Filtros: estilo, cervecera, origen, etiquetas y búsqueda",
    ],
    builtH: "Cómo funciona",
    bullets: [
      [
        "La lista.",
        "Las cervezas del festival en un fichero separado por tabuladores, con etiquetas como Nueva, Sin gluten o 0% escritas dentro del nombre, como hacía el festival, y separadas al leerlo.",
      ],
      [
        "Las notas.",
        "Un script en Node busca cada cerveza en Untappd, comprueba la cervecera, guarda la nota en el mismo fichero y para con educación cuando le limitan las peticiones.",
      ],
      [
        "La app.",
        "Módulos de JavaScript sin framework y un service worker, para que abra sin conexión en un festival sin cobertura, alojada en Netlify.",
      ],
    ],
    codeH: "Encontrar la cerveza correcta",
    caption: "scripts/scraper.js · recortado del repo público",
  },
  ca: {
    title: "Llista del Barcelona Beer Festival",
    pitch:
      "Tres-centes quaranta-set cerveses i una tarda. Una llista per al mòbil amb tot el que hi havia al festival i la nota d’Untappd de cada cervesa, per poder ordenar pel que de debò és bo.",
    source: "Codi a GitHub",
    shotsH: "Al mòbil",
    shots: [
      "Totes les cerveses, amb estil, graduació, IBU, origen i etiquetes",
      "Ordenades per nota d’Untappd, les millors primer",
      "Filtres: estil, cervesera, origen, etiquetes i cerca",
    ],
    builtH: "Com funciona",
    bullets: [
      [
        "La llista.",
        "Les cerveses del festival en un fitxer separat per tabuladors, amb etiquetes com Nova, Sense gluten o 0% escrites dins del nom, com feia el festival, i separades en llegir-lo.",
      ],
      [
        "Les notes.",
        "Un script en Node busca cada cervesa a Untappd, comprova la cervesera, desa la nota al mateix fitxer i s’atura amb educació quan li limiten les peticions.",
      ],
      [
        "L’app.",
        "Mòduls de JavaScript sense framework i un service worker, perquè s’obri sense connexió en un festival sense cobertura, allotjada a Netlify.",
      ],
    ],
    codeH: "Trobar la cervesa correcta",
    caption: "scripts/scraper.js · retallat del repo públic",
  },
};

const link =
  "rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold text-ink-text hover:bg-white/15";

const Bbf = () => {
  const t = useCopy(COPY);
  return (
    <Article>
      <Intro
        kicker="Side project · 2026"
        title={t.title}
        pitch={t.pitch}
        stack={["JavaScript", "Node", "Service worker", "PWA", "Netlify"]}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={REPO}
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          {t.source} ↗
        </a>
      </div>
      <H>{t.shotsH}</H>
      <Shots items={SHOTS.map((src, i) => [src, t.shots[i]])} />
      <H>{t.builtH}</H>
      <Bullets items={t.bullets} />
      <H>{t.codeH}</H>
      <Snippet caption={t.caption} language="javascript" code={MATCH} />
    </Article>
  );
};

export default Bbf;
