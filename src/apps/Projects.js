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
    glow: ["#1f1a17", "#ff6a2b", "#f2b8c6"],
    props: { start: 3 },
    look: { w: 560, zoom: 0.7 },
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
    glow: ["#1b261d", "#5f8f4e", "#c9d8a8"],
    props: { slip: true },
    look: { w: 560, zoom: 0.7 },
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
    glow: ["#e6ecf1", "#93c2e4", "#f3d3b5"],
    props: { start: 3 },
    look: { w: 560, zoom: 0.72 },
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
    glow: ["#241d33", "#8b6cd9", "#f0a3c0"],
    props: {},
    look: { w: 700, zoom: 0.7, pad: 16 },
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
    glow: ["#17132a", "#a868e8", "#5ab0ff"],
    props: {},
    look: { w: 640, zoom: 0.85 },
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
    glow: ["#0d241a", "#03aa4b", "#9be3b5"],
    props: {},
    look: { w: 560, zoom: 0.62 },
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
    glow: ["#e4e9ee", "#7fb7d9", "#5d7c99"],
    props: {},
    look: { w: 640, zoom: 0.85 },
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
    glow: ["#260d10", "#d6453d", "#f5a07a"],
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
    glow: ["#ebeee7", "#4cc27c", "#c3e6cf"],
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
    glow: ["#0e1729", "#297ffa", "#8fd0ff"],
    props: {},
    look: { w: 390, zoom: 0.72 },
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
    glow: ["#f3e4d1", "#f0a35e", "#f6c7d0"],
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
    glow: ["#24170a", "#e0a21b", "#f4d58d"],
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

// a case's glow of colours: behind its card's preview, and alone as the
// band across the top of its page
const glow = ([base, a, b]) => ({
  background: `radial-gradient(60% 70% at 18% 22%, ${a}, transparent 72%), radial-gradient(55% 65% at 85% 85%, ${b}, transparent 70%), ${base}`,
});

// a case's preview on the cover: its mock, screenshot or phones floating
// on its glow
const Art = ({ c, wide }) => {
  // a mock shrinks further when its frame is too narrow for it, so it's
  // never cut off on either side
  const frame = useRef(null);
  const [fit, setFit] = useState(c.look?.zoom);
  useEffect(() => {
    const el = frame.current;
    if (!c.look || !el || !window.ResizeObserver) return;
    const ro = new ResizeObserver(() =>
      setFit(
        Math.min(c.look.zoom, (el.clientWidth * 0.86) / c.look.w),
      ),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, [c.look]);
  return (
    <div
      style={glow(c.glow)}
      ref={frame}
      className={`art relative flex items-center justify-center overflow-hidden rounded-[20px] ring-p-fg/80 ring-offset-2 ring-offset-[#f4f2ee] [container-type:size] group-has-[:focus-visible]:ring-2 ${wide ? "aspect-[16/10]" : "aspect-[4/5]"}`}
    >
      <div className="flex max-w-[86%] justify-center transition duration-700 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.035]">
        {c.phones ? (
          c.phones.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              loading="lazy"
              className={`w-[118px] rounded-[16px] border-[3px] border-black/80 shadow-[0_18px_40px_rgba(0,0,0,0.4)] ${i ? "-ml-6 mt-6 rotate-[5deg]" : "rotate-[-5deg]"}`}
            />
          ))
        ) : c.img ? (
          <img
            src={c.img}
            alt=""
            loading="lazy"
            className={`aspect-[16/10] max-h-[78cqh] w-[440px] max-w-full rounded-lg object-cover object-top shadow-[0_18px_50px_rgba(0,0,0,0.35)]`}
          />
        ) : (
          // the mock as a small window: laid out `w` wide, shrunk by
          // `zoom` (or more, to fit), shifted up by y to its best part
          <div className="thumb max-h-[80cqh] max-w-full overflow-hidden rounded-xl bg-p-sunk shadow-[0_18px_50px_rgba(0,0,0,0.3)]">
            {/* ponytail: the live mock, inert so it stays out of the tab order */}
            <div
              aria-hidden="true"
              inert=""
              style={{
                width: c.look.w,
                zoom: fit,
                marginTop: -(c.look.y || 0),
                padding: c.look.pad,
              }}
              className="pointer-events-none text-p-body"
            >
              <c.Thumb {...c.props} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const VIEW = { en: "View", es: "Ver", ca: "Veure" };

// a case on the cover, the way a portfolio shows one: a light title with a
// one-line pitch under it, the case's mock, screenshot or phones floating
// on a soft glow of colours, and under it what and when, and "View"
const Card = ({ c, lang, wide, onOpen }) => {
  const copy = c.copy[lang] || c.copy.en;
  // the pitch's first sentence is the line beside the title
  const line = copy.pitch.split(/(?<=[.!?])\s/)[0];
  return (
    <div className="card group relative">
      <div className="mb-4 px-0.5">
        {/* the title's click area covers the whole card; a card can't be one
            button since the mocks inside have buttons of their own */}
        <button
          type="button"
          onClick={onOpen}
          style={{ "--d": "250ms" }}
          className="rise block text-left text-[26px] font-light leading-[1.05] tracking-tight text-p-fg outline-none after:absolute after:inset-0 after:z-10 sm:text-[30px]"
        >
          {label(c.title, lang)}
        </button>
        <p
          style={{ "--d": "310ms" }}
          className="rise mt-1.5 line-clamp-2 max-w-[520px] text-[13px] leading-snug text-p-muted"
        >
          {line}
        </p>
      </div>
      <Art c={c} wide={wide} />
      <div
        style={{ "--d": "370ms" }}
        className="rise mt-3 flex justify-between gap-4 px-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-p-fg"
      >
        <span>{brand(c.sub)}</span>
        <span className="flex-none">
          {label(VIEW, lang)}{" "}
          <span className="inline-block transition-transform duration-300 [transition-timing-function:var(--ease-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            ↗
          </span>
        </span>
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
          className="proj min-h-0 flex-1 overflow-y-auto bg-[#f4f2ee] px-5 pt-4 text-p-fg sm:px-8"
        >
          {/* pairs of a narrow and a wide card, swapping sides each row, the
              second of each pair set lower */}
          <div className="mx-auto grid max-w-[1200px] gap-x-10 gap-y-14 pb-6 pt-4 md:grid-cols-12">
            {shown.map((c, i) => {
              const wide = (i % 2 === 1) === (Math.floor(i / 2) % 2 === 0);
              return (
                <div
                  key={filter + c.id}
                  className={`min-w-0 ${wide ? "md:col-span-7" : "md:col-span-5"} ${i % 2 ? "md:mt-28" : ""}`}
                >
                  <Card
                    c={c}
                    lang={lang}
                    wide={wide}
                    onOpen={() => setId(c.id)}
                  />
                </div>
              );
            })}
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
          className="proj case-in min-h-0 flex-1 overflow-y-auto bg-[#f4f2ee] text-p-fg"
          style={{ "--accent": ACCENT[open.co] }}
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
          {/* the case's glow, edge to edge, as its cover */}
          {/* the glow kept at a card's 16:10 and cropped to a band, so it
              isn't stretched */}
          <div className="relative h-[180px] overflow-hidden sm:h-[320px]">
            <div
              style={glow(open.glow)}
              className="absolute inset-x-0 top-1/2 aspect-[16/10] -translate-y-1/2"
            />
          </div>
          <div className="relative mx-auto -mt-20 max-w-[880px] rounded-t-[24px] bg-[#f4f2ee] sm:-mt-48">
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
                <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-p-muted">
                  {label(word, lang)}
                </span>
                <span className="text-[24px] font-light leading-tight tracking-tight text-p-fg">
                  {!i && (
                    <span className="mr-1 inline-block transition-transform duration-300 [transition-timing-function:var(--ease-out)] group-hover:-translate-x-1">
                      {arrow}
                    </span>
                  )}
                  <span className="group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                    {label(c.title, lang)}
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
