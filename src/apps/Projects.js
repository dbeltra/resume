import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Window from "../components/Window";
import SecurityHub, { HubDiagram, COPY as hubCopy } from "./projects/hub";
import Shop, { COPY as shopCopy } from "./projects/shop";
import Mq, { Wiring, COPY as mqCopy } from "./projects/mq";
import Sites, { COPY as sitesCopy } from "./projects/sites";
import Cli, { Mesh, COPY as cliCopy } from "./projects/cli";
import Procurement, {
  Compare,
  COPY as procurementCopy,
} from "./projects/procurement";
import Builder, { Schedule, COPY as builderCopy } from "./projects/builder";
import Sitges, { COPY as sitgesCopy } from "./projects/sitges";
import Bbf, { COPY as bbfCopy } from "./projects/bbf";
import Learnings, {
  Capture,
  COPY as learningsCopy,
} from "./projects/learnings";
import SprintAgent, { Sprint, COPY as sprintCopy } from "./projects/sprint";
import Autopractik, {
  Cancel,
  COPY as autopractikCopy,
} from "./projects/autopractik";
import ShopShot from "../assets/images/archive/shop-2020.jpg";
import SitesShot from "../assets/images/archive/pep-2019.jpg";
import SitgesShot from "../assets/images/sitges/schedule.jpg";
import SitgesPlan from "../assets/images/sitges/plan.jpg";
import BbfShot from "../assets/images/bbf/rating.jpg";
import BbfFilter from "../assets/images/bbf/filter.jpg";
import { brand } from "./projects/ui";

// Case studies of past work. That code is closed source, so the snippets are
// rewritten and simplified for this page, never copied from the real repos.

// each company's brand colour, sampled from its logo: a card's hover
// underline and the case headers. Autopractik takes Ancora Dual's blue
const ACCENT = {
  "011h": "#3b683a",
  planck: "#a868e8",
  pep: "#03aa4b",
  ancora: "#297ffa",
  side: "#f0a35e",
};

const ALL = {
  en: "All projects",
  es: "Todos los proyectos",
  ca: "Tots els projectes",
};

const NEXT = { en: "Next", es: "Siguiente", ca: "Següent" };
const PREV = { en: "Previous", es: "Anterior", ca: "Anterior" };

// the chips on a card and the gallery's filters; work and personal come
// from c.side rather than from the tags
const TAGS = {
  all: { en: "All", es: "Todo", ca: "Tot" },
  work: { en: "Work", es: "Trabajo", ca: "Feina" },
  personal: { en: "Personal", es: "Personales", ca: "Personals" },
  back: { en: "Backend", es: "Backend", ca: "Backend" },
  front: { en: "Frontend", es: "Frontend", ca: "Frontend" },
  ai: { en: "AI", es: "IA", ca: "IA" },
};

// newest first. `Thumb` is the case's own diagram or mock, shrunk for its
// card; `img` a screenshot instead, `phones` two
// phone screenshots, kept small since they're only 369px wide
export const CASES = [
  {
    id: "sprint",
    props: { start: 3 },
    look: { w: 560, zoom: 0.7, h: 235 },
    copy: sprintCopy,
    tags: ["ai", "front"],
    co: "011h",
    Thumb: Sprint,
    title: {
      en: "Sprint agent",
      es: "Agente de sprint",
      ca: "Agent de sprint",
    },
    sub: "011h · Claude Code · 2026",
    Body: SprintAgent,
  },
  {
    id: "builder",
    props: { slip: true },
    look: { w: 560, zoom: 0.7, h: 240 },
    copy: builderCopy,
    tags: ["back"],
    co: "011h",
    Thumb: Schedule,
    title: { en: "Builder", es: "Builder", ca: "Builder" },
    sub: "011h · FastAPI · 2026",
    Body: Builder,
  },
  {
    id: "learnings",
    props: { start: 3 },
    look: { w: 560, zoom: 0.72, h: 340 },
    copy: learningsCopy,
    tags: ["ai", "back"],
    co: "011h",
    Thumb: Capture,
    title: {
      en: "Site learnings",
      es: "Lecciones de obra",
      ca: "Lliçons d’obra",
    },
    sub: "011h · AI · 2026",
    Body: Learnings,
  },
  {
    id: "procurement",
    props: {},
    look: { w: 540, zoom: 0.7, h: 205, pad: 16 },
    copy: procurementCopy,
    tags: ["back", "ai"],
    co: "011h",
    Thumb: Compare,
    title: { en: "Procurement", es: "Compras", ca: "Compres" },
    sub: "011h · FastAPI · 2025–26",
    Body: Procurement,
  },
  {
    id: "hub",
    props: {},
    look: { w: 560, zoom: 0.85, h: 290 },
    copy: hubCopy,
    tags: ["back"],
    co: "planck",
    Thumb: HubDiagram,
    title: { en: "Security Hub", es: "Security Hub", ca: "Security Hub" },
    sub: "Planck · Rust · 2024",
    Body: SecurityHub,
  },
  {
    id: "cli",
    props: {},
    look: { w: 560, zoom: 0.62, h: 215 },
    copy: cliCopy,
    tags: ["back"],
    co: "pep",
    Thumb: Mesh,
    title: {
      en: "Admin CLI",
      es: "CLI de administración",
      ca: "CLI d’administració",
    },
    sub: "p≡p · Python · 2020–22",
    Body: Cli,
  },
  {
    id: "mq",
    props: {},
    look: { w: 640, zoom: 0.85, x: 150, h: 205 },
    copy: mqCopy,
    tags: ["back"],
    co: "pep",
    Thumb: Wiring,
    title: {
      en: "Financial messaging",
      es: "Mensajería financiera",
      ca: "Missatgeria financera",
    },
    sub: "p≡p · MQ · 2020–22",
    Body: Mq,
  },
  {
    id: "shop",
    copy: shopCopy,
    tags: ["back", "front"],
    co: "pep",
    img: ShopShot,
    title: {
      en: "Licence shop",
      es: "Tienda de licencias",
      ca: "Botiga de llicències",
    },
    sub: "p≡p · Django · 2019–22",
    Body: Shop,
  },
  {
    id: "sites",
    copy: sitesCopy,
    tags: ["front"],
    co: "pep",
    img: SitesShot,
    title: {
      en: "Company websites",
      es: "Webs de empresa",
      ca: "Webs d’empresa",
    },
    sub: "p≡p · Mezzanine · 2018–24",
    Body: Sites,
  },
  {
    id: "autopractik",
    props: {},
    look: { w: 390, zoom: 0.72, h: 240 },
    copy: autopractikCopy,
    tags: ["back", "front"],
    co: "ancora",
    Thumb: Cancel,
    title: {
      en: "Autopractik",
      es: "Autopractik",
      ca: "Autopractik",
    },
    sub: "Ancora · Django · 2016–18",
    Body: Autopractik,
  },
  // side projects, after the work, newest first
  {
    id: "sitges",
    copy: sitgesCopy,
    tags: ["front"],
    co: "side",
    phones: [SitgesShot, SitgesPlan],
    title: {
      en: "Sitges planner",
      es: "Planificador Sitges",
      ca: "Planificador Sitges",
    },
    sub: "PWA · 2026",
    Body: Sitges,
    side: true,
  },
  {
    id: "bbf",
    copy: bbfCopy,
    tags: ["front"],
    co: "side",
    phones: [BbfShot, BbfFilter],
    title: {
      en: "Beer festival list",
      es: "Lista de cervezas",
      ca: "Llista de cerveses",
    },
    sub: "PWA · 2026",
    Body: Bbf,
    side: true,
  },
];

const label = (o, lang) => o[lang] || o.en;

// a case on the cover: a tile in a masonry wall, a grey ground with the
// case's mock, screenshot or phones set in it, and under it a caption the
// way a portfolio lists its case studies: what and when, the case's own
// headline and pitch. A mock sits at its own height, which is what varies
// the tiles and makes the columns interlock
const Card = ({ c, lang, onOpen }) => {
  const copy = c.copy[lang] || c.copy.en;
  return (
    <div
      style={{ "--accent": ACCENT[c.co] }}
      className="card group relative mb-7 break-inside-avoid"
    >
      <div
        style={{ height: c.phones ? 340 : c.img ? 250 : undefined }}
        // grey to black for every tile; the company's colour is only in the
        // hover underline
        className="relative overflow-hidden rounded-2xl bg-[linear-gradient(155deg,#6b6a70,#2a292d_55%,#0f0f11)] ring-p-fg/80 ring-offset-2 ring-offset-[#f4f2ee] group-has-[:focus-visible]:ring-2"
      >
        {c.phones ? (
          <div className="absolute inset-x-0 top-12 flex origin-bottom justify-center transition duration-500 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.04]">
            {c.phones.map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                loading="lazy"
                className={`w-[118px] rounded-[16px] border-[3px] border-black/80 shadow-[0_18px_40px_rgba(0,0,0,0.45)] ${i ? "-ml-6 mt-6 rotate-[5deg]" : "rotate-[-5deg]"}`}
              />
            ))}
          </div>
        ) : c.img ? (
          <img
            src={c.img}
            alt=""
            loading="lazy"
            className="absolute bottom-0 left-6 right-0 top-12 size-auto origin-top-left rounded-tl-xl object-cover object-left-top shadow-[0_18px_50px_rgba(0,0,0,0.4)] transition duration-500 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.04]"
          />
        ) : (
          // the mock as a window running off the right edge: laid out `w`
          // wide, shrunk by `zoom`, shifted by x/y to its best part
          <div
            style={{ height: c.look.h }}
            className="thumb ml-6 mt-12 origin-top-left overflow-hidden rounded-tl-xl bg-p-sunk shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition duration-500 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.04]"
          >
            {/* ponytail: the live mock, inert so it stays out of the tab order */}
            <div
              aria-hidden="true"
              inert=""
              style={{
                width: c.look.w,
                zoom: c.look.zoom,
                margin: `${-(c.look.y || 0)}px 0 0 ${-(c.look.x || 0)}px`,
                padding: c.look.pad,
              }}
              className="pointer-events-none text-p-body"
            >
              <c.Thumb {...c.props} />
            </div>
          </div>
        )}
        <ul className="absolute left-3.5 top-3.5 flex gap-1">
          {c.tags.map((t) => (
            <li
              key={t}
              className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#17151f]"
            >
              {label(TAGS[t], lang)}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3 px-0.5">
        <div
          style={{ "--d": "250ms" }}
          className="rise font-mono text-[10.5px] uppercase tracking-wide text-p-muted"
        >
          {brand(c.sub)}
        </div>
        {/* the title's click area covers the whole card; a card can't be one
            button since the mocks inside have buttons of their own */}
        <button
          type="button"
          onClick={onOpen}
          style={{ "--d": "310ms" }}
          className="rise mt-1 text-left text-[18px] font-semibold leading-snug text-p-fg outline-none after:absolute after:inset-0"
        >
          {/* an underline in the company's colour grows in on hover */}
          <span className="bg-[linear-gradient(var(--accent),var(--accent))] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 [transition-timing-function:var(--ease-io)] group-hover:bg-[length:100%_2px]">
            {copy.title || label(c.title, lang)}
          </span>
        </button>
        <p
          style={{ "--d": "370ms" }}
          className="rise mt-1 line-clamp-3 text-[13px] leading-relaxed text-p-body"
        >
          {copy.pitch}
        </p>
      </div>
    </div>
  );
};

const Projects = ({ win, tab }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;
  // null is the cover with every project on it
  const [id, setId] = useState(null);
  const [filter, setFilter] = useState("all");
  const shown = CASES.filter((c) =>
    filter === "all"
      ? true
      : filter === "work"
        ? !c.side
        : filter === "personal"
          ? c.side
          : c.tags.includes(filter),
  );
  // a link elsewhere on the site can open a given case study, or "all"
  useEffect(() => {
    if (tab === "all") setId(null);
    else if (CASES.some((c) => c.id === tab)) setId(tab);
  }, [tab]);
  const open = CASES.find((c) => c.id === id);
  // cover cards build in (index.css .card) the first time they scroll into
  // view; keyed on the filter, so changing it plays them again
  const cover = useRef(null);
  useEffect(() => {
    const root = cover.current;
    if (!root) return;
    const cards = root.querySelectorAll(".card:not(.in)");
    // jsdom has no IntersectionObserver
    if (!window.IntersectionObserver)
      return cards.forEach((el) => el.classList.add("in"));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("in");
          io.unobserve(e.target);
        }),
      { root, rootMargin: "0px 0px -6% 0px" },
    );
    cards.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [filter, id]);
  const at = CASES.indexOf(open);
  const next = open && CASES[(at + 1) % CASES.length];
  const prev = open && CASES[(at - 1 + CASES.length) % CASES.length];

  return (
    <Window
      {...win}
      label={t("desktop.apps.projects")}
      rect={{ w: 980, h: 700 }}
      className="border border-[#343741] bg-[#1e2026] text-ink-text"
      barClassName="h-11 border-b border-[#343741] bg-[#262932]"
      toolbar={
        <span className="pointer-events-none absolute inset-x-0 text-center text-[13px] font-semibold">
          {t("desktop.apps.projects")}
        </span>
      }
    >
      {!open ? (
        <div
          ref={cover}
          className="proj min-h-0 flex-1 overflow-y-auto bg-[#f4f2ee] px-4 pt-4 text-p-fg sm:px-5"
        >
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {shown.map((c) => (
              <Card
                key={filter + c.id}
                c={c}
                lang={lang}
                onOpen={() => setId(c.id)}
              />
            ))}
          </div>
          {/* floating filters, like the wall's own menu */}
          <div className="sticky bottom-4 z-10 mx-auto mb-4 mt-2 flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-xl bg-white p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.18)] sm:flex-nowrap">
            {Object.keys(TAGS).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`flex-none rounded-lg bg-[#f0eee9] bg-[linear-gradient(#17151f,#17151f)] bg-left bg-no-repeat px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide transition-[background-size,color] duration-300 [transition-timing-function:var(--ease-io)] sm:px-3 ${filter === f ? "bg-[length:100%_100%] text-white" : "bg-[length:0%_100%] text-[#17151f] hover:bg-[#e4e1da]"}`}
              >
                {label(TAGS[f], lang)}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // keyed so a new case starts at the top
        <div
          key={id}
          className="proj case-in min-h-0 flex-1 overflow-y-auto bg-p-surface text-p-fg"
          style={{
            "--accent": ACCENT[open.co],
            backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${ACCENT[open.co]} 16%, transparent), transparent 320px)`,
            backgroundAttachment: "local",
          }}
        >
          {/* back to the wall, floating like its filter bar */}
          <div className="sticky top-3 z-10 h-0 px-3">
            <button
              type="button"
              onClick={() => setId(null)}
              className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#17151f] shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:bg-[#f0eee9]"
            >
              ← {label(ALL, lang)}
            </button>
          </div>
          <div className="pt-8">
            <open.Body />
          </div>
          {/* the cases either side, newest to oldest and round */}
          <nav className="mx-6 grid gap-4 border-t border-p-fg/10 pb-12 pt-5 sm:grid-cols-2 md:mx-auto md:max-w-[672px]">
            {[
              [prev, PREV, "←"],
              [next, NEXT, "→"],
            ].map(([c, word, arrow], i) => (
              <button
                key={word.en}
                type="button"
                onClick={() => setId(c.id)}
                className={`group flex flex-col gap-1 ${i ? "sm:items-end sm:text-right" : "items-start text-left"}`}
              >
                <span className="font-mono text-[10.5px] uppercase tracking-wide text-p-muted">
                  {label(word, lang)}
                </span>
                <span className="text-[17px] font-semibold leading-snug text-p-fg">
                  {!i && (
                    <span className="mr-1 inline-block transition-transform duration-300 [transition-timing-function:var(--ease-out)] group-hover:-translate-x-1">
                      {arrow}
                    </span>
                  )}
                  <span className="group-hover:underline">
                    {(c.copy[lang] || c.copy.en).title || label(c.title, lang)}
                  </span>
                  {!!i && (
                    <span className="ml-1 inline-block transition-transform duration-300 [transition-timing-function:var(--ease-out)] group-hover:translate-x-1">
                      {arrow}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </Window>
  );
};

export default Projects;
