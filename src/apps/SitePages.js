import React from "react";
import { useTranslation } from "react-i18next";
import { JOB_STACKS, SKILLS } from "../data";

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
const Band = ({ eyebrow, title, children }) => (
  <header className="bg-[#111318] px-5 text-white sm:px-10">
    <div className="pb-11 pt-12 sm:pt-14">
      {eyebrow && <Mono className="text-xs text-[#8b8f98]">{eyebrow}</Mono>}
      <h1
        className={`font-display font-bold leading-[0.95] tracking-[-0.035em] ${eyebrow ? "mt-3 text-[40px] sm:text-[56px]" : "text-[52px] sm:text-[80px]"}`}
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
    <div className="min-w-0 flex-[4_1_480px]">{children}</div>
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

// CV, email, GitHub, LinkedIn: shared by About and Contact
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

const About = ({ onOpenCv, onOpenMail }) => {
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
          // a self-closing tag in the code font; screen readers just get
          // the name. Mono runs wide, so it's smaller than the other titles.
          <span className="block whitespace-nowrap font-mono text-[28px] tracking-[-0.04em] sm:text-[60px]">
            <span aria-hidden="true" className="font-normal text-[#5d6170]">
              {"< "}
            </span>
            david beltrà
            <span aria-hidden="true" className="font-normal text-[#5d6170]">
              {" />"}
            </span>
          </span>
        }
      >
        <dl className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] border-t border-white/10">
          {facts.map(([k, v], i) => (
            <div
              key={k}
              className={`pb-5 pt-4 ${i ? "border-white/10 sm:border-l sm:pl-4" : ""} pr-4`}
            >
              <dt>
                <Mono className="text-[#8b8f98]">{t(`desktop.site.${k}`)}</Mono>
              </dt>
              <dd className="mt-2 flex items-center gap-2 text-[15.5px] font-medium">
                {k === "now" && (
                  <span
                    aria-hidden="true"
                    className="h-[7px] w-[7px] rounded-full"
                    style={{ background: ACCENT }}
                  />
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
        </div>
      </Section>
      <Section label={`03 / ${t("desktop.pages.skills")}`}>
        <dl className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-6">
          {SKILL_GROUPS.map(([title, items]) => (
            <div key={title}>
              <dt className="text-[13px] font-semibold text-[#17151f]">
                {t(title)}
              </dt>
              <dd className="mt-1.5 text-[15px] leading-[1.65]">
                {items.map((s) => (
                  <div key={s.name || s.nameKey}>{skillName(t, s)}</div>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Section>
      <Section label={`04 / ${t("desktop.pages.contact")}`}>
        <Links onOpenCv={onOpenCv} onOpenMail={onOpenMail} />
      </Section>
    </>
  );
};

const Experience = () => {
  const { t } = useTranslation();
  const jobs = t("experienceExperiences", { returnObjects: true })
    .map((job, i) => ({ ...job, stack: JOB_STACKS[i] }))
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
            className="flex flex-wrap gap-x-10 gap-y-3 border-b border-[#e7e4ec] py-7"
          >
            <div
              className={`${cols[0]} pt-0.5 font-mono text-[13.5px] text-[#17151f]`}
            >
              {j.dates}
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
            {items.map((s) => (
              <li
                key={s.name || s.nameKey}
                className="flex min-h-[56px] items-center gap-3 border-b border-r border-[#e7e4ec] px-4 py-3 text-[15px] font-medium text-[#17151f]"
              >
                <img
                  src={s.icon}
                  alt=""
                  className={`h-5 w-5 flex-none object-contain ${s.iconClass || ""}`}
                />
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
  const { t } = useTranslation();
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
        aria-label={t("desktop.browser.site")}
        className="flex min-w-0 items-center overflow-x-auto whitespace-nowrap sm:gap-1"
      >
        {PAGES.map((p) => (
          <button
            key={p}
            type="button"
            aria-current={p === page ? "page" : undefined}
            onClick={() => onGo(p)}
            className={`min-h-[44px] flex-none px-2 lowercase underline-offset-[6px] sm:px-2.5 ${p === page ? "text-white underline decoration-2" : "text-[#a9adb6] hover:text-white"}`}
            style={p === page ? { textDecorationColor: ACCENT } : undefined}
          >
            {num(p)} {t(`desktop.pages.${p}`)}
          </button>
        ))}
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

export const SitePage = ({ page, ...callbacks }) => {
  const Page = PAGE_COMPONENTS[page] || About;
  return (
    <div className="text-[#3d3a45]">
      <Page {...callbacks} />
    </div>
  );
};
