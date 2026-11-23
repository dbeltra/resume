import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Window from "../components/Window";
import SecurityHub from "./projects/hub";
import Shop from "./projects/shop";
import Mq from "./projects/mq";
import Sites from "./projects/sites";
import Cli from "./projects/cli";
import Procurement from "./projects/procurement";
import Learnings from "./projects/learnings";
import SprintAgent from "./projects/sprint";

// Case studies of past work. That code is closed source, so the snippets are
// rewritten and simplified for this page, never copied from the real repos.
// newest first
const CASES = [
  {
    id: "sprint",
    title: {
      en: "Sprint agent",
      es: "Agente de sprint",
      ca: "Agent de sprint",
    },
    sub: "011h · Claude Code · 2026",
    Body: SprintAgent,
  },
  {
    id: "learnings",
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
    title: { en: "Procurement", es: "Compras", ca: "Compres" },
    sub: "011h · FastAPI · 2025–26",
    Body: Procurement,
  },
  {
    id: "hub",
    title: { en: "Security Hub", es: "Security Hub", ca: "Security Hub" },
    sub: "Planck · Rust · 2024",
    Body: SecurityHub,
  },
  {
    id: "cli",
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
    title: {
      en: "Company websites",
      es: "Webs de empresa",
      ca: "Webs d’empresa",
    },
    sub: "p≡p · Mezzanine · 2018–24",
    Body: Sites,
  },
];

const Projects = ({ win }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;
  const [id, setId] = useState(CASES[0].id);
  const { Body } = CASES.find((c) => c.id === id);

  return (
    <Window
      {...win}
      label={t("desktop.apps.projects")}
      rect={{ w: 980, h: 700 }}
      className="border border-[#343741] bg-[#1e2026] text-ink-text"
      barClassName="h-11 border-b border-[#343741] bg-[#262932]"
      toolbar={
        <span className="flex-1 text-center text-[13px] font-semibold">
          {t("desktop.apps.projects")}
        </span>
      }
    >
      {/* phones: the list is a row of tabs on top */}
      <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
        {CASES.length > 1 && (
          <nav className="flex flex-none gap-0.5 overflow-x-auto border-b border-[#2e313a] bg-[#1a1c21] p-2 sm:w-[190px] sm:flex-col sm:border-b-0 sm:border-r">
            {CASES.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-current={c.id === id}
                onClick={() => setId(c.id)}
                className={`flex-none rounded-md px-3 py-2 text-left ${c.id === id ? "bg-white/10" : "hover:bg-white/5"}`}
              >
                <div className="text-[13px] font-semibold">
                  {c.title[lang] || c.title.en}
                </div>
                <div className="text-[11px] text-ink-muted">{c.sub}</div>
              </button>
            ))}
          </nav>
        )}
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          <Body />
        </div>
      </div>
    </Window>
  );
};

export default Projects;
