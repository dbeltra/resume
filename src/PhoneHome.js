import React from "react";
import { useTranslation } from "react-i18next";
import Avatar from "./components/Avatar";
import AppTile from "./components/AppTile";
import FolderIcon from "./assets/icons/apps/folder.png";
import FileIcon from "./assets/icons/apps/file.png";
import GithubIcon from "./assets/icons/mono/github.png";
import LinkedinIcon from "./assets/icons/mono/linkedin.png";

const TILE = "h-[60px] w-[60px] rounded-[14px]";
const LANGS = ["en", "es", "ca"];

const Label = ({ children }) => (
  <span className="max-w-[76px] truncate text-xs font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
    {children}
  </span>
);

// iOS-style home screen for phones: a profile widget, an app grid and a dock.
const PhoneHome = ({ onOpen, onGo, page }) => {
  const { t, i18n } = useTranslation();

  const grid = [
    { label: "CV", app: "pdf", act: () => onOpen("pdf") },
    { label: "Spotify", app: "spotify", act: () => onOpen("spotify") },
    {
      label: "Agents.md",
      icon: FileIcon,
      tile: "bg-white",
      act: () => onOpen("code", "agents"),
    },
    {
      label: "resume-src",
      icon: FolderIcon,
      tile: "bg-white",
      act: () => onOpen("code", "about"),
    },
    {
      label: "GitHub",
      icon: GithubIcon,
      tile: "bg-[#181717]",
      img: "h-[58%] w-[58%]",
      href: "https://github.com/dbeltra",
    },
    {
      label: "LinkedIn",
      icon: LinkedinIcon,
      tile: "bg-[#0a66c2]",
      img: "h-[58%] w-[58%]",
      href: "https://www.linkedin.com/in/dbeltra/",
    },
  ];
  const dock = ["browser", "code", "term", "mail"];

  return (
    <main className="fixed inset-0 flex flex-col overflow-y-auto bg-page-bg bg-cover bg-center px-5 pb-[max(12px,env(safe-area-inset-bottom))] pt-[max(24px,env(safe-area-inset-top))] font-sans">
      {/* profile widget */}
      <section
        aria-label="David Beltrà"
        className="rounded-[22px] border border-white/25 bg-[rgba(110,110,120,0.32)] p-4 text-white shadow-[0_8px_30px_rgba(0,0,0,0.15)] backdrop-blur-2xl"
      >
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 flex-none overflow-hidden rounded-full">
            <div className="origin-top-left scale-50">
              <Avatar />
            </div>
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-xl font-bold leading-tight">
              David Beltrà
            </h1>
            <p className="text-sm text-white/85">{t("desktop.about.role")}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/85">
              <span
                aria-hidden="true"
                className="h-[7px] w-[7px] rounded-full bg-lilac"
              />
              {t("desktop.status.roles")}
            </p>
          </div>
        </div>
        <div
          role="group"
          aria-label={t("desktop.menu.language")}
          className="mt-3 flex gap-1 rounded-full bg-black/15 p-1 text-xs font-semibold"
        >
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={i18n.resolvedLanguage === l}
              onClick={() => i18n.changeLanguage(l)}
              className={`h-8 flex-1 rounded-full uppercase ${i18n.resolvedLanguage === l ? "bg-white text-[#17151f]" : "text-white/90"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </section>

      {/* app grid */}
      <nav
        aria-label={t("desktop.labels.files")}
        className="mt-7 grid grid-cols-4 gap-y-6"
      >
        {grid.map((g) => {
          const body = (
            <>
              <AppTile
                app={g.app}
                icon={g.icon}
                tile={g.tile}
                img={g.img}
                size={TILE}
              />
              <Label>{g.label}</Label>
            </>
          );
          const cls =
            "flex flex-col items-center gap-1.5 active:scale-95 transition-transform";
          return g.href ? (
            <a
              key={g.label}
              href={g.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cls}
            >
              {body}
            </a>
          ) : (
            <button key={g.label} type="button" onClick={g.act} className={cls}>
              {body}
            </button>
          );
        })}
      </nav>

      <div className="min-h-6 flex-1" />

      {/* dock */}
      <nav
        aria-label={t("desktop.labels.dock")}
        className="flex justify-around rounded-[30px] border border-white/20 bg-[rgba(110,110,120,0.32)] px-2 py-3 backdrop-blur-3xl backdrop-saturate-150"
      >
        {dock.map((id) => (
          <button
            key={id}
            type="button"
            aria-label={t(`desktop.dock.${id}`)}
            onClick={() => (id === "browser" ? onGo(page) : onOpen(id))}
            className="transition-transform active:scale-95"
          >
            <AppTile app={id} size={TILE} />
          </button>
        ))}
      </nav>
      <a
        href="https://www.flaticon.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 text-center text-[11px] text-white/80"
      >
        {t("desktop.credits")}
      </a>
    </main>
  );
};

export default PhoneHome;
