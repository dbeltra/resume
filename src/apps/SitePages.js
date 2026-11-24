import React, { useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { JOB_CASES, JOB_LOGOS, JOB_STACKS, SKILLS } from "../data";
import { CASES } from "./Projects";
import Foam from "../assets/textures/foam.jpg";

// The website shown inside the Browser app (and on phones). A spec sheet:
// a dark band in the desktop's own dark, then a white sheet of numbered
// sections split by hairlines. Edge to edge, since it already sits in a
// window. One accent: lilac, only on the dark band.

const PAGES = ["about", "experience", "skills", "contact"];
const ACCENT = "#c79ac7";
const num = (p) => `0${PAGES.indexOf(p) + 1}`;

const Mono = ({ className = "", children }) => (
  <span
    className={`font-mono text-[11px] uppercase tracking-[0.08em] ${className}`}
  >
    {children}
  </span>
);

// the dark top of every page: "02 / Experience" over a big title
// acoustic foam (Niek Doup / Unsplash) under a dark wash, so the band has
// texture without hurting contrast; the wash fades a little towards the right
const BAND_BG = {
  backgroundColor: "#111318",
  backgroundImage: `linear-gradient(100deg, rgba(17,19,24,0.82), rgba(17,19,24,0.55)), url(${Foam})`,
  backgroundSize: "cover",
  backgroundPosition: "center 40%",
};

const Band = ({ eyebrow, title, children }) => (
  <header style={BAND_BG} className="px-5 text-white sm:px-10">
    <div className="reveal pb-11 pt-12 sm:pt-14">
      {eyebrow && <Mono className="text-xs text-[#8b8f98]">{eyebrow}</Mono>}
      <h1
        className={`font-pixel font-normal leading-[0.95] ${eyebrow ? "mt-3 text-[40px] sm:text-[56px]" : "text-[52px] sm:text-[80px]"}`}
      >
        {title}
      </h1>
      {children}
    </div>
  </header>
);

// one numbered row: mono label on the left, content on the right
const Section = ({ label, children }) => (
  <section className="flex flex-wrap gap-x-10 gap-y-4 border-b border-[#e7e4ec] px-5 py-10 sm:px-10">
    <h2 className="m-0 flex-[1_1_160px]">
      <Mono className="text-xs text-[#6b6775]">{label}</Mono>
    </h2>
    <div className="reveal min-w-0 flex-[4_1_480px]">{children}</div>
  </section>
);

const btn =
  "inline-flex min-h-[44px] items-center gap-2 px-4 text-[14.5px] transition";
const BtnDark = ({ children, ...p }) => (
  <button
    type="button"
    className={`${btn} bg-[#111318] font-semibold text-white hover:bg-[#262932]`}
    {...p}
  >
    {children}
  </button>
);
const BtnLine = ({ href, onClick, children }) => {
  const cls = `${btn} border border-[#d9d4e0] text-[#17151f] hover:border-[#17151f]`;
  if (onClick)
    return (
      <button type="button" onClick={onClick} className={cls}>
        {children}
      </button>
    );
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={cls}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
    </a>
  );
};

const Download = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
  </svg>
);

// CV, email, GitHub, LinkedIn
const Links = ({ onOpenCv, onOpenMail }) => (
  <div className="flex flex-wrap gap-3">
    {onOpenCv && (
      <BtnDark onClick={onOpenCv}>
        <Download />
        CV.pdf
      </BtnDark>
    )}
    <BtnLine onClick={onOpenMail} href="mailto:dbeltra@gmail.com">
      dbeltra@gmail.com
    </BtnLine>
    <BtnLine href="https://github.com/dbeltra">GitHub ↗</BtnLine>
    <BtnLine href="https://www.linkedin.com/in/dbeltra/">LinkedIn ↗</BtnLine>
  </div>
);

const skillName = (t, s) => (s.nameKey ? t(s.nameKey) : s.name);
const SKILL_GROUPS = [
  ["skillsLanguages", SKILLS.languages],
  ["skillsTools", SKILLS.tools],
  ["desktop.skills.title", SKILLS.ai],
];

const About = ({ onOpenProject }) => {
  const { t } = useTranslation();
  const facts = [
    ["role", t("aboutRole")],
    ["based", `${t("contactLocationPlace")} · CET`],
    ["since", "2014"],
    ["now", "011h"],
  ];
  const paragraphs = [
    ...t("aboutDescription", { returnObjects: true }),
    ...t("skillsDescription", { returnObjects: true }),
  ];
  return (
    <>
      <Band
        title={
          // a self-closing tag; screen readers just get the name. Neopixel
          // has no < >, so both brackets are set in JetBrains Mono.
          <span className="block whitespace-nowrap text-[30px] sm:text-[64px]">
            <span
              aria-hidden="true"
              className="font-mono font-normal text-[#5d6170]"
            >
              {"< "}
            </span>
            david beltrà
            <span
              aria-hidden="true"
              className="font-mono font-normal text-[#5d6170]"
            >
              {" />"}
            </span>
          </span>
        }
      >
        <dl className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] border-t border-white/10">
          {facts.map(([k, v], i) => (
            <div
              key={k}
              className={`reveal pb-5 pt-4 ${i ? "border-white/10 sm:border-l sm:pl-4" : ""} pr-4`}
              style={{ "--d": `${150 + i * 80}ms` }}
            >
              <dt>
                <Mono className="text-[#8b8f98]">{t(`desktop.site.${k}`)}</Mono>
              </dt>
              <dd className="mt-2 flex items-center gap-2 text-[15.5px] font-medium">
                {k === "now" && (
                  <span
                    aria-hidden="true"
                    className="relative flex h-[7px] w-[7px]"
                  >
                    <span
                      className="absolute inset-0 animate-[ping_2.4s_ease-out_infinite] rounded-full opacity-60 motion-reduce:hidden"
                      style={{ background: ACCENT }}
                    />
                    <span
                      className="relative h-full w-full rounded-full"
                      style={{ background: ACCENT }}
                    />
                  </span>
                )}
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </Band>
      <Section label={`01 / ${t("desktop.pages.about")}`}>
        <div className="max-w-[640px]">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className={`text-base leading-[1.7] [&_b]:font-semibold [&_b]:text-[#17151f] ${i ? "mt-3.5" : ""}`}
              dangerouslySetInnerHTML={{ __html: p }}
            />
          ))}
          {onOpenProject && (
            <div className="mt-7">
              <BtnDark onClick={() => onOpenProject("all")}>
                {t("desktop.site.seeProjects")} →
              </BtnDark>
            </div>
          )}
        </div>
      </Section>
    </>
  );
};

// a job's case studies in the Projects window, by id
const CaseLinks = ({ ids, onOpenProject }) => {
  const { t, i18n } = useTranslation();
  if (!ids.length || !onOpenProject) return null;
  const lang = i18n.resolvedLanguage;
  return (
    <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[14px]">
      <Mono className="text-[#6b6775]">{t("desktop.site.cases")}</Mono>
      {ids.map((id) => {
        const c = CASES.find((x) => x.id === id);
        return (
          <button
            key={id}
            type="button"
            onClick={() => onOpenProject(id)}
            className="font-medium text-[#17151f] underline decoration-[#c79ac7] decoration-2 underline-offset-4 hover:decoration-[#17151f]"
          >
            {c.title[lang] || c.title.en}
          </button>
        );
      })}
    </p>
  );
};

const Experience = ({ onOpenProject }) => {
  const { t } = useTranslation();
  const jobs = t("experienceExperiences", { returnObjects: true })
    .map((job, i) => ({ ...job, stack: JOB_STACKS[i], cases: JOB_CASES[i], logo: JOB_LOGOS[i] }))
    .reverse(); // newest first
  const cols = ["flex-[1_1_130px]", "flex-[4_1_420px]", "flex-[1.4_1_150px]"];
  return (
    <>
      <Band
        eyebrow={`02 / ${t("desktop.pages.experience")}`}
        title={t("experienceTitle")}
      />
      <section className="px-5 pb-16 sm:px-10">
        <div className="flex flex-wrap gap-x-10 gap-y-2 border-b border-[#d9d4e0] py-3.5 text-[#6b6775]">
          {["years", "role", "stack"].map((k, i) => (
            <Mono key={k} className={cols[i]}>
              {t(`desktop.site.${k}`)}
            </Mono>
          ))}
        </div>
        {jobs.map((j) => (
          <article
            key={j.company + j.dates}
            className="reveal flex flex-wrap gap-x-10 gap-y-3 border-b border-[#e7e4ec] py-7"
          >
            <div
              className={`${cols[0]} pt-0.5 font-mono text-[13.5px] text-[#17151f]`}
            >
              {j.dates}
              <img
                src={j.logo}
                alt={j.company}
                loading="lazy"
                className="mt-4 size-auto max-h-8 max-w-[150px] object-contain"
              />
            </div>
            <div className={`${cols[1]} min-w-0`}>
              <h2 className="text-[19px] font-semibold text-[#17151f]">
                {j.title} <span className="font-normal text-[#6b6775]">·</span>{" "}
                {j.company}
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-[18px] text-[15.5px] leading-[1.6]">
                {j.responsibilities.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <CaseLinks ids={j.cases} onOpenProject={onOpenProject} />
            </div>
            <ul
              className={`${cols[2]} min-w-0 pt-0.5 font-mono text-[13px] leading-[1.8]`}
            >
              {j.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </>
  );
};

const Skills = () => {
  const { t } = useTranslation();
  return (
    <>
      <Band
        eyebrow={`03 / ${t("desktop.pages.skills")}`}
        title={t("skillsTitle")}
      />
      {SKILL_GROUPS.map(([title, items]) => (
        <Section key={title} label={t(title)}>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] border-l border-t border-[#e7e4ec]">
            {items.map((s, i) => (
              <li
                key={s.name || s.nameKey}
                className="reveal flex min-h-[56px] items-center gap-3 border-b border-r border-[#e7e4ec] px-4 py-3 text-[15px] font-medium text-[#17151f] hover:bg-[#f7f5f9]"
                style={{ "--d": `${i * 40}ms` }}
              >
                {s.symbol ? (
                  <i
                    aria-hidden="true"
                    className="material-symbols-outlined w-5 flex-none !text-[20px] text-[#6b6775]"
                  >
                    {s.symbol}
                  </i>
                ) : (
                  <img
                    src={s.icon}
                    alt=""
                    className={`size-5 flex-none object-contain ${s.iconClass || ""}`}
                  />
                )}
                {skillName(t, s)}
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </>
  );
};

const Contact = ({ onOpenCv, onOpenMail }) => {
  const { t } = useTranslation();
  const rows = [
    ["LinkedIn", "in/dbeltra", "https://www.linkedin.com/in/dbeltra/"],
    ["GitHub", "github.com/dbeltra", "https://github.com/dbeltra"],
    [
      t("contactLocation"),
      `${t("contactLocationPlace")} · ${t("contactLocationText")}`,
    ],
  ];
  return (
    <>
      <Band
        eyebrow={`04 / ${t("desktop.pages.contact")}`}
        title={t("contactTitle")}
      >
        <p className="mt-5 max-w-[600px] text-[17px] leading-relaxed text-[#c9ccd3]">
          {t("contactDescription", { returnObjects: true })[0]}
        </p>
      </Band>
      <Section label={t("contactEmail")}>
        <Links onOpenCv={onOpenCv} onOpenMail={onOpenMail} />
        <p className="mt-3 text-sm text-[#6b6775]">{t("contactEmailText")}</p>
      </Section>
      {rows.map(([label, value, href]) => (
        <Section key={label} label={label}>
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[17px] font-medium text-[#17151f] underline decoration-[#d9d4e0] underline-offset-4 hover:decoration-[#17151f]"
            >
              {value} ↗
            </a>
          ) : (
            <span className="text-[17px] font-medium text-[#17151f]">
              {value}
            </span>
          )}
        </Section>
      ))}
    </>
  );
};

// Site header: name and the numbered menu. Used inside the Browser app.
export const SiteNav = ({ page, onGo }) => {
  const { t, i18n } = useTranslation();
  // the lilac bar: one for the whole menu, sliding under the section you
  // read. Placed from the current label's box (offsets inside the nav), and
  // again whenever the nav resizes (a web font landing, another language).
  const nav = useRef(null);
  const [bar, setBar] = useState(null);
  useLayoutEffect(() => {
    const place = () => {
      const el = nav.current?.querySelector('[aria-current="page"] span');
      if (el)
        setBar({
          x: el.offsetLeft,
          y: el.offsetTop + el.offsetHeight + 5,
          w: el.offsetWidth,
        });
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(nav.current);
    return () => ro.disconnect();
  }, [page, i18n.language]);
  return (
    // buttons reset text-transform, so `lowercase` goes on each of them.
    // Phones: the big name is right below, so the menu gets the whole row
    // and scrolls sideways instead of wrapping.
    <div className="sticky top-0 z-[2] flex items-center justify-between gap-x-6 border-b border-white/10 bg-[#111318] px-3 py-1.5 font-mono text-[13px] text-white sm:px-10">
      <button
        type="button"
        onClick={() => onGo("about")}
        className="hidden min-h-[44px] text-left lowercase sm:block"
      >
        david beltrà <span className="text-[#8b8f98]">— {t("aboutRole")}</span>
      </button>
      <nav
        ref={nav}
        aria-label={t("desktop.browser.site")}
        className="relative flex min-w-0 items-center overflow-x-auto whitespace-nowrap sm:gap-1"
      >
        {PAGES.map((p) => (
          <button
            key={p}
            type="button"
            aria-current={p === page ? "page" : undefined}
            onClick={() => onGo(p)}
            className={`min-h-[44px] flex-none px-2 lowercase transition-colors duration-300 sm:px-2.5 ${p === page ? "text-white" : "text-[#a9adb6] hover:text-white"}`}
          >
            <span>
              {num(p)} {t(`desktop.pages.${p}`)}
            </span>
          </button>
        ))}
        {bar && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 h-0.5 transition-[transform,width] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none"
            style={{
              width: bar.w,
              transform: `translate(${bar.x}px, ${bar.y}px)`,
              background: ACCENT,
            }}
          />
        )}
      </nav>
    </div>
  );
};

const PAGE_COMPONENTS = {
  about: About,
  experience: Experience,
  skills: Skills,
  contact: Contact,
};

// One page, every section in order; the menu scrolls to them (Browser.js
// finds each by its data-page).
export const SitePage = (callbacks) => (
  <div className="text-[#3d3a45]">
    {PAGES.map((p) => {
      const Page = PAGE_COMPONENTS[p];
      return (
        <div key={p} data-page={p}>
          <Page {...callbacks} />
        </div>
      );
    })}
  </div>
);
