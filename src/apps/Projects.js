import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Window from "../components/Window";
import SecurityHub, { HubDiagram } from "./projects/hub";
import Shop from "./projects/shop";
import Mq, { Wiring } from "./projects/mq";
import Sites from "./projects/sites";
import Cli, { Mesh } from "./projects/cli";
import Procurement, { Compare } from "./projects/procurement";
import Builder, { Schedule } from "./projects/builder";
import Sitges from "./projects/sitges";
import Bbf from "./projects/bbf";
import Learnings, { Capture } from "./projects/learnings";
import SprintAgent, { Sprint } from "./projects/sprint";
import Autopractik, { Cancel } from "./projects/autopractik";
import ShopShot from "../assets/images/archive/shop-2020.jpg";
import SitesShot from "../assets/images/archive/pep-2019.jpg";
import SitgesShot from "../assets/images/sitges/schedule.jpg";
import SitgesPlan from "../assets/images/sitges/plan.jpg";
import BbfShot from "../assets/images/bbf/rating.jpg";
import BbfFilter from "../assets/images/bbf/filter.jpg";

// Case studies of past work. That code is closed source, so the snippets are
// rewritten and simplified for this page, never copied from the real repos.
// sidebar group headings: work first, then side projects
const GROUPS = {
  work: { en: "Work", es: "Trabajo", ca: "Feina" },
  side: {
    en: "Side projects",
    es: "Proyectos personales",
    ca: "Projectes personals",
  },
};

// each company's brand colour, sampled from its logo: the cards, the sidebar
// dots and the case headers. Autopractik takes Ancora Dual's blue
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

// newest first. `Thumb` is the case's own diagram or mock, shrunk for its
// card; `img` a screenshot instead, `phones` two
// phone screenshots, kept small since they're only 369px wide
export const CASES = [
  {
    id: "sprint",
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
    co: "011h",
    Thumb: Schedule,
    title: { en: "Builder", es: "Builder", ca: "Builder" },
    sub: "011h · FastAPI · 2026",
    Body: Builder,
  },
  {
    id: "learnings",
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
    co: "011h",
    Thumb: Compare,
    title: { en: "Procurement", es: "Compras", ca: "Compres" },
    sub: "011h · FastAPI · 2025–26",
    Body: Procurement,
  },
  {
    id: "hub",
    co: "planck",
    Thumb: HubDiagram,
    title: { en: "Security Hub", es: "Security Hub", ca: "Security Hub" },
    sub: "Planck · Rust · 2024",
    Body: SecurityHub,
  },
  {
    id: "cli",
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

// a case on the cover, like a file in Finder's gallery: its diagram or
// screenshot as the preview, the name and company underneath
const Card = ({ c, lang, onOpen }) => (
  <div style={{ "--accent": ACCENT[c.co] }} className="group relative">
    <div className="thumb h-[160px] overflow-hidden rounded-lg bg-p-sunk ring-1 ring-p-fg/10 transition group-hover:ring-2 group-hover:ring-[color:var(--accent)] group-has-[:focus-visible]:ring-2 group-has-[:focus-visible]:ring-[color:var(--accent)]">
      {c.phones ? (
        <div className="flex justify-center gap-3 pt-4">
          {c.phones.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              loading="lazy"
              className="w-[110px] rounded-[14px] border-[3px] border-p-line shadow-[0_12px_28px_rgba(0,0,0,0.45)]"
            />
          ))}
        </div>
      ) : c.img ? (
        <img
          src={c.img}
          alt=""
          loading="lazy"
          className="size-full object-cover object-top"
        />
      ) : (
        // ponytail: the live mock at half size, inert so it stays out of the tab order
        <div
          aria-hidden="true"
          inert=""
          className="pointer-events-none w-[200%] origin-top-left scale-50 p-4"
        >
          <c.Thumb />
        </div>
      )}
    </div>
    {/* the title's click area covers the whole card; a card can't be one
        button since the mocks inside have buttons of their own */}
    <button
      type="button"
      onClick={onOpen}
      className="mt-2.5 text-left text-[13px] font-semibold text-p-fg outline-none after:absolute after:inset-0"
    >
      {c.title[lang] || c.title.en}
    </button>
    <div className="text-[11px] text-p-muted">{c.sub}</div>
  </div>
);

const Projects = ({ win, tab }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;
  // null is the cover with every project on it
  const [id, setId] = useState(null);
  // a link elsewhere on the site can open a given case study, or "all"
  useEffect(() => {
    if (tab === "all") setId(null);
    else if (CASES.some((c) => c.id === tab)) setId(tab);
  }, [tab]);
  const open = CASES.find((c) => c.id === id);
  // phones: bring the open case's tab into the row's view
  useEffect(() => {
    document
      .querySelector('[data-cases] [aria-current="true"]')
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [id]);
  const group = (side) => GROUPS[side ? "side" : "work"];
  const heading = (side) => (
    <div
      className={`flex-none self-center px-3 pb-1 pt-3 text-[10px] uppercase tracking-[0.14em] text-p-muted sm:self-auto`}
    >
      {group(side)[lang] || group(side).en}
    </div>
  );

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
        <div className="proj min-h-0 flex-1 overflow-y-auto bg-p-surface px-4 pb-8 pt-2 text-p-fg sm:px-6">
          {[false, true].map((side) => (
            <section key={String(side)}>
              <h3 className="mb-3 mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-p-muted">
                {group(side)[lang] || group(side).en}
              </h3>
              <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                {CASES.filter((c) => !!c.side === side).map((c) => (
                  <Card
                    key={c.id}
                    c={c}
                    lang={lang}
                    onOpen={() => setId(c.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        // phones: the list is a row of tabs on top
        <div className="proj flex min-h-0 flex-1 flex-col bg-p-surface text-p-fg sm:flex-row">
          <nav
            data-cases
            className="flex flex-none gap-0.5 overflow-x-auto border-b border-p-line bg-p-side p-2 sm:w-[190px] sm:flex-col sm:border-b-0 sm:border-r"
          >
            <button
              type="button"
              onClick={() => setId(null)}
              className="flex-none rounded-md px-3 py-2 text-left text-[13px] font-semibold text-p-muted hover:bg-p-fg/5 hover:text-p-fg"
            >
              ← {ALL[lang] || ALL.en}
            </button>
            {CASES.map((c, i) => (
              <React.Fragment key={c.id}>
                {(i === 0 || !!c.side !== !!CASES[i - 1].side) &&
                  heading(c.side)}
                <button
                  type="button"
                  aria-current={c.id === id}
                  onClick={() => setId(c.id)}
                  className={`flex-none rounded-md px-3 py-2 text-left ${c.id === id ? "bg-p-fg/10" : "hover:bg-p-fg/5"}`}
                >
                  <div className="flex items-center gap-2 text-[13px] font-semibold">
                    <i
                      className="size-2 flex-none rounded-full"
                      style={{ background: ACCENT[c.co] }}
                    />
                    {c.title[lang] || c.title.en}
                  </div>
                  <div className="pl-4 text-[11px] text-p-muted">{c.sub}</div>
                </button>
              </React.Fragment>
            ))}
          </nav>
          {/* keyed so a new case starts at the top */}
          <div
            key={id}
            className="min-h-0 min-w-0 flex-1 overflow-y-auto"
            style={{
              "--accent": ACCENT[open.co],
              backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${ACCENT[open.co]} 16%, transparent), transparent 320px)`,
              backgroundAttachment: "local",
            }}
          >
            <open.Body />
          </div>
        </div>
      )}
    </Window>
  );
};

export default Projects;
