import React from "react";
import { useTranslation } from "react-i18next";
import AppTile from "./components/AppTile";
import NowPlaying from "./desktop/NowPlaying";
import FolderIcon from "./assets/icons/apps/folder.png";
import FileIcon from "./assets/icons/apps/doc-md.svg";
import PhotosIcon from "./assets/icons/apps/photos.png";
import BooksIcon from "./assets/icons/apps/books.png";
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
const PhoneHome = ({ onOpen, onGo, page, hasPhotos }) => {
  const { t, i18n } = useTranslation();

  const grid = [
    { label: "CV", app: "pdf", act: () => onOpen("pdf") },
    { label: "Spotify", app: "spotify", act: () => onOpen("spotify") },
    { label: "Claude", app: "claude", act: () => onOpen("claude") },
    ...(hasPhotos
      ? [
          {
            label: t("desktop.apps.photos"),
            icon: PhotosIcon,
            tile: "bg-white",
            act: () => onOpen("photos"),
          },
        ]
      : []),
    {
      label: t("desktop.apps.shelf"),
      icon: BooksIcon,
      tile: "bg-white",
      act: () => onOpen("shelf"),
    },
    {
      label: t("desktop.apps.projects"),
      app: "projects",
      act: () => onOpen("projects"),
    },
    {
      label: "Agents.md",
      icon: FileIcon,
      tile: "bg-[#262932]", // dark, so the white page icon stands out
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
        <div className="flex items-start justify-between gap-3">
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
          {/* language: a small corner control, not the card's main action */}
          <div
            role="group"
            aria-label={t("desktop.menu.language")}
            className="-mr-1.5 -mt-1 flex flex-none text-[11px] font-semibold uppercase"
          >
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={i18n.resolvedLanguage === l}
                onClick={() => i18n.changeLanguage(l)}
                className={`flex h-8 min-w-8 items-center justify-center rounded-full px-1.5 uppercase ${i18n.resolvedLanguage === l ? "text-white" : "text-white/45"}`}
              >
                <span
                  className={
                    i18n.resolvedLanguage === l
                      ? "underline decoration-lilac decoration-2 underline-offset-4"
                      : ""
                  }
                >
                  {l}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* same Last.fm player as the desktop's; tapping the song opens Spotify */}
      <div className="mt-3">
        <NowPlaying onOpen={() => onOpen("spotify")} />
      </div>

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
