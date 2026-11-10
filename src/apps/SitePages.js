import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Avatar from "../components/Avatar";
import { JOB_IMAGES, JOB_STACKS, SKILLS } from "../data";

// The website shown inside the Browser app (and on phones). Light, so it
// stands apart from the dark desktop apps, but tinted and layered: soft
// colour glows behind, raised white cards, plum/periwinkle accents.

const Icon = ({ name, className = "" }) => (
  <i className={`material-symbols-outlined ${className}`} aria-hidden="true">
    {name}
  </i>
);

const Card = ({ className = "", children, ...p }) => (
  <div
    className={`rounded-2xl border border-white/80 bg-white/80 shadow-[0_1px_2px_rgba(40,20,60,0.06),0_8px_24px_rgba(60,30,90,0.08)] backdrop-blur ${className}`}
    {...p}
  >
    {children}
  </div>
);

const PageTitle = ({ eyebrow, children }) => (
  <header className="mb-8">
    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-plum">
      {eyebrow}
    </div>
    <h1 className="font-display text-4xl font-bold tracking-tight text-[#17151f]">
      {children}
    </h1>
    <div className="mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-plum to-peri" />
  </header>
);

const Chip = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-medium ${className}`}
  >
    {children}
  </span>
);

const BtnPrimary = ({ icon, children, ...p }) => (
  <button
    type="button"
    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gradient-to-br from-plum to-[#6a3fa0] px-5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(110,50,140,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(110,50,140,0.4)]"
    {...p}
  >
    {icon && <Icon name={icon} className="text-lg" />}
    {children}
  </button>
);
const LinkSoft = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-paper-line bg-white px-5 text-sm font-semibold text-[#17151f] shadow-sm transition hover:-translate-y-0.5 hover:border-plum/40"
  >
    {children}
    <Icon name="north_east" className="text-base text-plum-muted" />
  </a>
);

const About = ({ onOpenCv }) => {
  const { t } = useTranslation();
  const paragraphs = [
    ...t("aboutDescription", { returnObjects: true }),
    ...t("skillsDescription", { returnObjects: true }),
  ];
  const years = new Date().getFullYear() - 2014;
  const stack = ["React", "Python", "FastAPI", "Django", "Rust"];
  return (
    <>
      <Card className="overflow-hidden">
        {/* banner: brand gradient with a faint dot grid (not the wallpaper,
            which is already behind the whole desktop) */}
        <div className="relative h-28 overflow-hidden bg-gradient-to-br from-plum via-[#6a3fa0] to-[#4b63b8] sm:h-32">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:16px_16px]"
          />
        </div>
        <div className="px-6 pb-6 sm:px-8">
          <div className="-mt-16 mb-4 w-fit rounded-full ring-4 ring-white">
            <Avatar />
          </div>
          <h1 className="font-display text-[40px] font-bold leading-none tracking-tight text-[#17151f] sm:text-[44px]">
            David Beltrà
          </h1>
          <p className="mt-2 text-lg font-semibold text-plum">
            {t("aboutRole")}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip className="bg-paper-tint text-plum-dark">
              <Icon name="location_on" className="text-base" />
              {t("contactLocationPlace")}
            </Chip>
            <Chip className="bg-[#e8eefc] text-[#2f4f9a]">
              <Icon name="work" className="text-base" />
              {t("desktop.about.years", { count: years })}
            </Chip>
            <Chip className="bg-paper-tint text-plum-dark">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-plum"
              />
              {t("desktop.status.roles")}
            </Chip>
          </div>
        </div>
      </Card>

      <Card className="mt-5 p-6 sm:p-8">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className={`text-[16.5px] leading-relaxed text-plum-text [&_b]:text-[#17151f] ${i ? "mt-3.5" : ""}`}
            dangerouslySetInnerHTML={{ __html: p }}
          />
        ))}
        <div className="mt-6 flex flex-wrap gap-2">
          {stack.map((s) => (
            <Chip
              key={s}
              className="border border-paper-line bg-paper font-mono text-xs text-plum-dark"
            >
              {s}
            </Chip>
          ))}
        </div>
      </Card>

      <div className="mt-6 flex flex-wrap gap-2.5">
        {onOpenCv && (
          <BtnPrimary icon="download" onClick={onOpenCv}>
            {t("desktop.about.cv")}
          </BtnPrimary>
        )}
        <LinkSoft href="https://github.com/dbeltra">GitHub</LinkSoft>
        <LinkSoft href="https://www.linkedin.com/in/dbeltra/">
          LinkedIn
        </LinkSoft>
      </div>
    </>
  );
};

export const useJobs = () => {
  const { t } = useTranslation();
  return t("experienceExperiences", { returnObjects: true })
    .map((job, i) => ({ ...job, img: JOB_IMAGES[i], stack: JOB_STACKS[i] }))
    .reverse(); // newest first
};

// Short, stable fake commit hash per role (same input -> same hash).
const shortHash = (s) => {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
};
// branch pill per role, newest first; pEp became Planck
const REFS = [
  [{ label: "HEAD -> main", cls: "bg-[#e3f5ea] text-[#1f6b3d]" }],
  [{ label: "planck", cls: "bg-[#e8eefc] text-[#2f4f9a]" }],
  [{ label: "pep → planck", cls: "bg-[#e8eefc] text-[#2f4f9a]" }],
  [{ label: "tag: v1.0", cls: "bg-[#fdf0d5] text-[#8a5a00]" }],
];

const Experience = () => {
  const { t } = useTranslation();
  const jobs = useJobs();
  const [open, setOpen] = useState(0);
  return (
    <>
      <PageTitle eyebrow={t("desktop.pages.experience")}>
        {t("experienceTitle")}
      </PageTitle>
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 bg-[#1b1d24] px-4 py-2.5 font-mono text-[12.5px] text-[#c9ced8]">
          <span className="text-mint">david@resume</span>
          <span className="text-peri">~/career</span>
          <span className="text-[#8b8f98]">$</span> git log --graph
        </div>
        <ol className="py-2 font-mono">
          {jobs.map((j, i) => {
            const isOpen = open === i;
            const last = i === jobs.length - 1;
            return (
              <li key={j.company + j.dates} className="flex">
                {/* graph lane: a line through every commit, ending at the first one */}
                <div aria-hidden="true" className="relative w-12 flex-none">
                  <span
                    className={`absolute left-[23px] w-0.5 bg-gradient-to-b from-plum to-peri ${i === 0 ? "top-6" : "top-0"} ${last ? "h-6" : "bottom-0"}`}
                  />
                  <span
                    className={`absolute left-[17px] top-[18px] h-3.5 w-3.5 rounded-full border-2 ${i === 0 ? "border-plum bg-plum shadow-[0_0_0_4px_rgba(142,63,142,0.18)]" : "border-peri bg-white"}`}
                  />
                </div>
                <div
                  className={`min-w-0 flex-1 border-b border-paper-line pr-4 ${last ? "border-b-0" : ""}`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full py-3.5 text-left"
                  >
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px]">
                      <Icon
                        name="chevron_right"
                        className={`text-base text-plum-muted transition-transform ${isOpen ? "rotate-90" : ""}`}
                      />
                      <span className="text-[#b07a00]">
                        {shortHash(j.company + j.dates)}
                      </span>
                      {REFS[i].map((r) => (
                        <span
                          key={r.label}
                          className={`rounded px-1.5 py-px font-semibold ${r.cls}`}
                        >
                          ({r.label})
                        </span>
                      ))}
                      <span className="text-plum-muted">{j.dates}</span>
                    </div>
                    <div className="mt-1.5 pl-6 font-sans text-[17px] font-bold text-[#17151f]">
                      {j.title}{" "}
                      <span className="font-medium text-plum">
                        @ {j.company}
                      </span>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="mb-4 ml-6 flex flex-wrap gap-5 rounded-xl border border-paper-line bg-paper/70 p-4">
                      <div className="min-w-0 flex-[1_1_320px] text-[12.5px] leading-relaxed">
                        <div className="text-plum-muted">
                          Author: David Beltrà
                        </div>
                        <div className="text-plum-muted">Date: {j.dates}</div>
                        <ul className="mt-3 space-y-2 font-sans text-[15px] leading-normal text-plum-text">
                          {j.responsibilities.map((r) => (
                            <li key={r} className="flex gap-2.5">
                              <span
                                aria-hidden="true"
                                className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-plum/60"
                              />
                              {r}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-[#1f7a43]">
                          {j.stack.map((s) => (
                            <span key={s}>+ {s}</span>
                          ))}
                        </div>
                      </div>
                      <img
                        src={j.img}
                        alt={j.company}
                        className="h-20 w-36 flex-none rounded-xl object-cover shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </Card>
    </>
  );
};

const Skills = () => {
  const { t } = useTranslation();
  const groups = [
    ["skillsLanguages", SKILLS.languages, "from-plum/15"],
    ["skillsTools", SKILLS.tools, "from-peri/20"],
    ["desktop.skills.title", SKILLS.ai, "from-plum/25"],
  ];
  return (
    <>
      <PageTitle eyebrow={t("desktop.pages.skills")}>
        {t("skillsTitle")}
      </PageTitle>
      {groups.map(([title, items, tint]) => (
        <section key={title} className="mb-8">
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-plum-muted">
            {t(title)}
          </h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {items.map((s) => (
              <li key={s.name || s.nameKey}>
                <Card className="flex items-center gap-3.5 px-4 py-3.5 text-[15px] font-medium text-[#17151f] transition hover:-translate-y-0.5">
                  <span
                    className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-gradient-to-br ${tint} to-white ring-1 ring-paper-line`}
                  >
                    {s.icon ? (
                      <img
                        src={s.icon}
                        alt=""
                        className={`h-6 w-6 object-contain ${s.iconClass || ""}`}
                      />
                    ) : (
                      <Icon name={s.symbol} className="text-[24px] text-plum" />
                    )}
                  </span>
                  {s.nameKey ? t(s.nameKey) : s.name}
                </Card>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
};

const Contact = ({ onOpenMail }) => {
  const { t } = useTranslation();
  const emailInner = (
    <>
      <Icon name="mail" />
      dbeltra@gmail.com
    </>
  );
  const emailClass =
    "mt-6 inline-flex min-h-[52px] items-center gap-2.5 rounded-xl bg-white px-6 text-[17px] font-semibold text-plum-dark shadow-lg transition hover:-translate-y-0.5";
  const cards = [
    {
      title: "LinkedIn",
      sub: "in/dbeltra",
      icon: "link",
      href: "https://www.linkedin.com/in/dbeltra/",
    },
    {
      title: "GitHub",
      sub: "dbeltra",
      icon: "code",
      href: "https://github.com/dbeltra",
    },
    {
      title: t("contactLocationPlace"),
      sub: t("contactLocationText"),
      icon: "location_on",
    },
  ];
  return (
    <>
      <PageTitle eyebrow={t("desktop.pages.contact")}>
        {t("contactTitle")}
      </PageTitle>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-plum via-[#6a3fa0] to-[#4b63b8] p-7 text-white shadow-[0_18px_40px_rgba(90,40,130,0.35)] sm:p-9">
        <p className="relative max-w-[520px] text-[17px] leading-relaxed text-white/90">
          {t("contactDescription", { returnObjects: true })[0]}
        </p>
        <div className="relative">
          {onOpenMail ? (
            <button type="button" onClick={onOpenMail} className={emailClass}>
              {emailInner}
            </button>
          ) : (
            <a href="mailto:dbeltra@gmail.com" className={emailClass}>
              {emailInner}
            </a>
          )}
          <p className="mt-2.5 text-sm text-white/75">
            {t("contactEmailText")}
          </p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {cards.map((c) => {
          const body = (
            <Card className="h-full p-4 transition group-hover:-translate-y-0.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-paper-tint text-plum">
                <Icon name={c.icon} className="text-xl" />
              </span>
              <div className="mt-3 font-semibold text-[#17151f]">{c.title}</div>
              <div className="mt-0.5 text-[13px] text-plum-muted">{c.sub}</div>
            </Card>
          );
          return c.href ? (
            <a
              key={c.title}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              {body}
            </a>
          ) : (
            <div key={c.title}>{body}</div>
          );
        })}
      </div>
    </>
  );
};

// Site header + current page. Used inside the Browser app.
export const SiteNav = ({ page, onGo, extra }) => {
  const { t } = useTranslation();
  return (
    <div className="sticky top-0 z-[2] flex flex-wrap items-center justify-between gap-2 border-b border-white/70 bg-white/60 px-4 py-2.5 shadow-[0_1px_12px_rgba(60,30,90,0.06)] backdrop-blur-xl sm:px-8">
      <span className="flex items-center gap-2 font-display text-lg font-bold text-[#17151f]">
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 rounded bg-gradient-to-br from-plum to-peri"
        />
        David Beltrà
      </span>
      <nav
        aria-label={t("desktop.browser.site")}
        className="flex flex-wrap items-center gap-1"
      >
        {["about", "experience", "skills", "contact"].map((p) => (
          <button
            key={p}
            type="button"
            aria-current={p === page ? "page" : undefined}
            onClick={() => onGo(p)}
            className={`h-9 rounded-full px-3.5 text-sm font-medium transition ${p === page ? "bg-gradient-to-br from-plum to-[#6a3fa0] text-white shadow-[0_4px_12px_rgba(110,50,140,0.3)]" : "text-plum-text hover:bg-white"}`}
          >
            {t(`desktop.pages.${p}`)}
          </button>
        ))}
        {extra}
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

// soft colour glows behind the page so it isn't flat white
export const SITE_BACKGROUND = {
  backgroundColor: "#f4f1f8",
  backgroundImage:
    "radial-gradient(900px 420px at 0% -5%, rgba(185,138,185,0.28), transparent 70%), radial-gradient(800px 420px at 100% 0%, rgba(127,159,224,0.25), transparent 70%), radial-gradient(700px 500px at 50% 110%, rgba(185,138,185,0.18), transparent 70%)",
  backgroundAttachment: "local",
};

export const SitePage = ({ page, ...callbacks }) => {
  const Page = PAGE_COMPONENTS[page] || About;
  return (
    <div className="mx-auto max-w-[760px] px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
      <Page {...callbacks} />
    </div>
  );
};
