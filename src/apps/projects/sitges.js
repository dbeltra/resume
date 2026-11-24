import React, { useState } from "react";
import {
  Article,
  Prose,
  Chip,
  H,
  Intro,
  Shots,
  Snippet,
  useCopy,
} from "./ui";
import ScheduleShot from "../../assets/images/sitges/schedule.jpg";
import FilmsShot from "../../assets/images/sitges/films.jpg";
import FilmShot from "../../assets/images/sitges/film.jpg";
import PlanShot from "../../assets/images/sitges/plan.jpg";

const SHOTS = [ScheduleShot, FilmsShot, FilmShot, PlanShot];

// Sitges festival planner, a personal side project. Its code is public, so
// the snippet is a trimmed excerpt of the real thing; the programme below is
// made up.

const LIVE = "https://dbeltra.github.io/sitges-planner/";
const REPO = "https://github.com/dbeltra/sitges-planner";

const CONFLICT = `// Why screening x can't join the plan for a film of this tier, or null if it can.
function planConflict(x, plan, tier) {
  for (const o of plan) {
    const [p, q] = o.a < x.a ? [o, x] : [x, o];
    const gap = (q.a - p.b) / 60000;
    if (gap < 0) return t('overlapsWith', { t: o.s.title });
    if (gap < need(p.s.location, q.s.location)) return t('tooClose', { t: o.s.title });
  }
  // ...plus a short night before the first session of a day, and full days
  return null;
}

// Plans are compared tier by tier: more must-sees beats any number of lower
// tiers. A depth-first search tries the hardest films first and prunes any
// branch that can't beat the best plan so far, inside a 600 ms budget.
(function go(i) {
  if (stop || (++nodes % 64 === 0 && (stop = performance.now() > deadline))) return;
  if (i === films.length) { /* keep it if it scores better */ return; }
  const can = [...got];
  for (let j = i; j < films.length; j++)
    if (films[j].opts.some(x => !planConflict(x, plan, films[j].tier))) can[films[j].tier - 1]++;
  if (!better([...can, 0], best.score)) return;
  // ...try each screening that fits, then leaving the film out
})(0);`;

// --- a made-up evening of the festival ---------------------------------------

const VENUES = ["Auditori", "Retiro", "Prado"];
// walking minutes between venues
const WALK = { "Auditori-Retiro": 25, "Auditori-Prado": 25, "Prado-Retiro": 5 };
const walk = (a, b) => (a === b ? 0 : WALK[[a, b].sort().join("-")]);
const T0 = 16 * 60; // the grid starts at 16:00
const SPAN = 8.5 * 60; // ...and ends at 00:30
// [id, film, venue, start, end] in minutes from midnight
const SESSIONS = [
  ["a", "The Hollow Tide", "Auditori", 960, 1070],
  ["b", "Neon Cicadas", "Retiro", 990, 1090],
  ["c", "The Hollow Tide", "Prado", 1095, 1205],
  ["d", "Night of the Long Teeth", "Auditori", 1110, 1220],
  ["e", "Neon Cicadas", "Prado", 1230, 1330],
  ["f", "Midnight X-Ray", "Auditori", 1350, 1455],
  ["g", "Night of the Long Teeth", "Retiro", 1320, 1430],
];
// the watchlist and its tiers: 1 must-see, 2 would like to
const WATCH = [
  ["The Hollow Tide", 1],
  ["Night of the Long Teeth", 2],
  ["Neon Cicadas", 2],
];
const hhmm = (m) =>
  `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

// warnings for each marked session, like the app's analyse()
const warnings = (marked) => {
  const list = SESSIONS.filter((s) => marked.has(s[0]));
  const out = {};
  for (const x of list)
    for (const y of list) {
      if (x === y || y[3] < x[3]) continue;
      const gap = y[3] - x[4];
      const need = walk(x[2], y[2]);
      if (gap < 0) (out[x[0]] ??= []).push(["clash", y]);
      else if (gap < need) (out[x[0]] ??= []).push(["tight", y, gap, need]);
      if (x[1] === y[1]) (out[x[0]] ??= []).push(["twice", y]);
    }
  return out;
};

const fits = (plan) => Object.keys(warnings(new Set(plan))).length === 0;

// The app's search, small enough here to try every combination: one
// screening or none per watchlist film, best by tiers covered, then fewest
// sessions.
const autoPlan = () => {
  let best = { score: [-1, -1, 0], plan: [] };
  const go = (i, plan, got) => {
    if (i === WATCH.length) {
      const score = [got[0], got[1], -plan.length];
      const better = score.findIndex((v, k) => v !== best.score[k]);
      if (better >= 0 && score[better] > best.score[better])
        best = { score, plan: [...plan] };
      return;
    }
    const [film, tier] = WATCH[i];
    for (const s of SESSIONS.filter((x) => x[1] === film))
      if (fits([...plan, s[0]])) {
        const g = [...got];
        g[tier - 1]++;
        go(i + 1, [...plan, s[0]], g);
      }
    go(i + 1, plan, got);
  };
  go(0, [], [0, 0]);
  return best.plan;
};

const COPY = {
  en: {
    shotsH: "Screenshots",
    built: [
      "It’s a single HTML page with a service worker, so it works offline and installs on Android as an app. The programme comes from Python scripts that download the festival’s pages, only the ones that changed, and build the schedule with directors, running times and trailers.",
      "The warnings catch overlaps, venue changes with no time to walk, the same film marked twice, and nights too short before the next morning’s first session. Auto-plan puts must-sees first and never drops them for lower tiers, caps the sessions per day, and for every film that doesn’t fit, tells you which of your sessions is in the way.",
      "It’s in Catalan and English, plans can be shared, the phone’s Back button works, and I got around an Android rendering bug by drawing the mark animation frame by frame. From the first commit to version 2.1 took under a week, just before the festival.",
      "I used it at the festival and it was really useful. I sent it to a few colleagues and they used it too, since the official festival app is missing most of the planning features.",
    ],
    tap: "Tap sessions to mark them, or let it plan for you.",
    auto: "Auto-plan my watchlist",
    clear: "Clear",
    watch: "Watchlist:",
    tiers: { 1: "must-see", 2: "would like to" },
    clash: (o) => `overlaps ${o}`,
    tight: (o, gap, need) =>
      `only ${gap} min to reach ${o}, the walk takes ${need}`,
    twice: (o) => `same film as at ${o}`,
    fine: "No conflicts.",
    noFit: (f) =>
      `${f} doesn’t fit around the rest: every screening clashes or leaves no time to walk.`,
    title: "Sitges festival planner",
    pitch:
      "A phone app I made for the Sitges film festival: the whole programme as a day-by-venue grid, warnings when sessions clash or there’s no time to walk between venues, and an auto-planner that fits your watchlist in.",
    open: "Open the planner",
    source: "Source on GitHub",
    ideaH: "Try a made-up evening",
    idea: "Real venues, made-up films and times. Mark sessions to see the warnings, or let the planner pick one screening of each film on the watchlist, must-sees first:",
    builtH: "What’s in it",
    codeH: "The search",
    caption: "index.html · trimmed from the public repo",
    shots: [
      "The schedule, a day by venue, with my sessions marked",
      "The watchlist, by priority, with what still fits",
      "A film’s details: poster, synopsis, trailer and screenings",
      "Auto-plan’s suggestions, ready to add in one go",
    ],
  },
  es: {
    shotsH: "Capturas",
    built: [
      "Es una única página HTML con un service worker, así que funciona sin conexión y se instala en Android como una app. La programación sale de unos scripts en Python que descargan las páginas del festival, solo las que han cambiado, y la montan con directores, duraciones y tráilers.",
      "Los avisos detectan solapamientos, cambios de sala sin tiempo para ir andando, la misma película marcada dos veces y noches demasiado cortas antes de la primera sesión del día siguiente. La planificación automática pone las imprescindibles primero y nunca las descarta por otras, limita las sesiones al día y, para cada película que no cabe, te dice cuál de tus sesiones lo impide.",
      "Está en catalán e inglés, los planes se pueden compartir, el botón Atrás del móvil funciona, y esquivé un fallo de renderizado de Android dibujando la animación de marcar fotograma a fotograma. Del primer commit a la versión 2.1 pasó menos de una semana, justo antes del festival.",
      "La usé en el festival y me fue muy útil. Se la pasé a algunas personas del trabajo y también la usaron, porque a la app oficial del festival le faltan casi todas las funciones de planificación.",
    ],
    tap: "Toca sesiones para marcarlas, o deja que planifique por ti.",
    auto: "Planificar mi lista",
    clear: "Borrar",
    watch: "Lista:",
    tiers: { 1: "imprescindible", 2: "me gustaría" },
    clash: (o) => `se solapa con ${o}`,
    tight: (o, gap, need) =>
      `solo ${gap} min para llegar a ${o}, el paseo es de ${need}`,
    twice: (o) => `misma película que a las ${o}`,
    fine: "Sin conflictos.",
    noFit: (f) =>
      `${f} no cabe con el resto: cada proyección se solapa o no deja tiempo para ir andando.`,
    title: "Planificador del festival de Sitges",
    pitch:
      "Una app para el móvil que hice para el festival de cine de Sitges: todo el programa como una parrilla por día y sala, avisos cuando las sesiones se solapan o no da tiempo a ir andando de una sala a otra, y un planificador automático que encaja tu lista.",
    open: "Abrir el planificador",
    source: "Código en GitHub",
    ideaH: "Prueba una tarde inventada",
    idea: "Salas reales, películas y horarios inventados. Marca sesiones para ver los avisos, o deja que el planificador elija una proyección de cada película de la lista, las imprescindibles primero:",
    builtH: "Qué tiene",
    codeH: "La búsqueda",
    caption: "index.html · recortado del repo público",
    shots: [
      "La programación, un día por sala, con mis sesiones marcadas",
      "La lista, por prioridad, con lo que aún cabe",
      "La ficha de una película: póster, sinopsis, tráiler y proyecciones",
      "Las sugerencias de la planificación automática, listas para añadir de una vez",
    ],
  },
  ca: {
    shotsH: "Captures",
    built: [
      "És una única pàgina HTML amb un service worker, així que funciona sense connexió i s’instal·la a Android com una app. La programació surt d’uns scripts en Python que descarreguen les pàgines del festival, només les que han canviat, i la munten amb directors, durades i tràilers.",
      "Els avisos detecten solapaments, canvis de sala sense temps d’anar-hi a peu, la mateixa pel·lícula marcada dues vegades i nits massa curtes abans de la primera sessió de l’endemà. La planificació automàtica posa les imprescindibles primer i mai no les descarta per d’altres, limita les sessions al dia i, per a cada pel·lícula que no hi cap, et diu quina de les teves sessions ho impedeix.",
      "És en català i anglès, els plans es poden compartir, el botó Enrere del mòbil funciona, i vaig esquivar un error de renderitzat d’Android dibuixant l’animació de marcar fotograma a fotograma. Del primer commit a la versió 2.1 va passar menys d’una setmana, just abans del festival.",
      "La vaig fer servir al festival i em va anar molt bé. La vaig passar a algunes persones de la feina i també la van fer servir, perquè a l’app oficial del festival li falten gairebé totes les funcions de planificació.",
    ],
    tap: "Toca sessions per marcar-les, o deixa que planifiqui per tu.",
    auto: "Planifica la meva llista",
    clear: "Esborra",
    watch: "Llista:",
    tiers: { 1: "imprescindible", 2: "m’agradaria" },
    clash: (o) => `se solapa amb ${o}`,
    tight: (o, gap, need) =>
      `només ${gap} min per arribar a ${o}, el passeig és de ${need}`,
    twice: (o) => `mateixa pel·lícula que a les ${o}`,
    fine: "Cap conflicte.",
    noFit: (f) =>
      `${f} no hi cap amb la resta: cada projecció se solapa o no deixa temps per anar-hi a peu.`,
    title: "Planificador del festival de Sitges",
    pitch:
      "Una app per al mòbil que vaig fer per al festival de cinema de Sitges: tot el programa com una graella per dia i sala, avisos quan les sessions se solapen o no hi ha temps d’anar a peu d’una sala a l’altra, i un planificador automàtic que hi encaixa la teva llista.",
    open: "Obre el planificador",
    source: "Codi a GitHub",
    ideaH: "Prova una tarda inventada",
    idea: "Sales reals, pel·lícules i horaris inventats. Marca sessions per veure els avisos, o deixa que el planificador triï una projecció de cada pel·lícula de la llista, les imprescindibles primer:",
    builtH: "Què hi ha",
    codeH: "La cerca",
    caption: "index.html · retallat del repo públic",
    shots: [
      "La programació, un dia per sala, amb les meves sessions marcades",
      "La llista, per prioritat, amb el que encara hi cap",
      "La fitxa d’una pel·lícula: pòster, sinopsi, tràiler i projeccions",
      "Els suggeriments de la planificació automàtica, a punt per afegir d’una vegada",
    ],
  },
};

const Programme = () => {
  const t = useCopy(COPY);
  const [marked, setMarked] = useState(new Set());
  const [left, setLeft] = useState([]); // watchlist films the auto-plan left out
  const toggle = (id) => {
    setLeft([]);
    setMarked((m) => {
      const n = new Set(m);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };
  const warn = warnings(marked);
  const flagged = new Set(
    Object.entries(warn).flatMap(([id, ws]) => [id, ...ws.map((w) => w[1][0])]),
  );
  const say = ([kind, o, gap, need]) =>
    kind === "clash"
      ? t.clash(o[1])
      : kind === "tight"
        ? t.tight(o[2], gap, need)
        : t.twice(hhmm(o[3]));

  return (
    <figure className="rounded-lg border border-p-line bg-p-sunk p-3">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Chip
          onClick={() => {
            const plan = autoPlan();
            setMarked(new Set(plan));
            setLeft(
              WATCH.map(([f]) => f).filter(
                (f) => !SESSIONS.some((s) => plan.includes(s[0]) && s[1] === f),
              ),
            );
          }}
        >
          ✦ {t.auto}
        </Chip>
        <button
          type="button"
          onClick={() => {
            setMarked(new Set());
            setLeft([]);
          }}
          className="px-2 text-[11px] text-p-muted underline hover:text-p-fg"
        >
          {t.clear}
        </button>
        <span className="text-[11px] text-p-muted">
          {t.watch}{" "}
          {WATCH.map(([f, tier]) => `${f} (${t.tiers[tier]})`).join(" · ")}
        </span>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[560px]">
          {VENUES.map((v) => (
            <div
              key={v}
              className="flex items-stretch border-b border-p-line last:border-b-0"
            >
              <div className="flex w-[68px] flex-none items-center text-[10px] text-p-muted">
                {v}
              </div>
              <div className="relative h-12 flex-1">
                {SESSIONS.filter((s) => s[2] === v).map(
                  ([id, film, , a, b]) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={marked.has(id)}
                      onClick={() => toggle(id)}
                      className={`absolute inset-y-1 overflow-hidden rounded px-1.5 text-left text-[10px] leading-tight transition-colors ${marked.has(id) ? "bg-p-fg text-p-surface" : "bg-p-raised text-p-fg hover:bg-p-line2"} ${flagged.has(id) ? "ring-2 ring-p-bad" : ""}`}
                      style={{
                        left: `${((a - T0) / SPAN) * 100}%`,
                        width: `${((b - a) / SPAN) * 100}%`,
                      }}
                    >
                      <span className="block truncate font-semibold">
                        {film}
                      </span>
                      <span className="opacity-70">
                        {hhmm(a)}–{hhmm(b)}
                      </span>
                    </button>
                  ),
                )}
              </div>
            </div>
          ))}
          <div className="relative ml-[68px] h-4 text-[9px] text-p-muted">
            {[16, 18, 20, 22, 24].map((h) => (
              <span
                key={h}
                className="absolute top-1 -translate-x-1/2"
                style={{ left: `${((h * 60 - T0) / SPAN) * 100}%` }}
              >
                {hhmm(h * 60)}
              </span>
            ))}
          </div>
        </div>
      </div>
      <ul className="mt-2 flex min-h-[20px] flex-col gap-0.5 text-[12px]">
        {!marked.size && <li className="text-p-muted">{t.tap}</li>}
        {marked.size > 0 && !Object.keys(warn).length && (
          <li className="text-p-ok">{t.fine}</li>
        )}
        {Object.entries(warn).flatMap(([id, ws]) => {
          const s = SESSIONS.find((x) => x[0] === id);
          return ws.map((w, i) => (
            <li key={`${id}${i}`} className="text-p-bad">
              {s[1]} {hhmm(s[3])}: {say(w)}
            </li>
          ));
        })}
        {left.map((f) => (
          <li key={f} className="text-p-warn">
            {t.noFit(f)}
          </li>
        ))}
      </ul>
    </figure>
  );
};

const STACK = ["JavaScript", "HTML", "CSS", "Service worker", "PWA", "Python"];

const link =
  "rounded-full bg-p-fg/10 px-3 py-1 text-[12px] font-semibold text-p-fg hover:bg-p-fg/15";

const Sitges = () => {
  const t = useCopy(COPY);
  return (
    <Article>
      <Intro
        kicker="Side project · 2026"
        title={t.title}
        pitch={t.pitch}
        stack={STACK}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={LIVE}
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          {t.open} ↗
        </a>
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
      <H>{t.ideaH}</H>
      <p className="mb-4">{t.idea}</p>
      <Programme />
      <H>{t.builtH}</H>
      <Prose items={t.built} />
      <H>{t.codeH}</H>
      <Snippet caption={t.caption} language="javascript" code={CONFLICT} />
    </Article>
  );
};

export default Sitges;
