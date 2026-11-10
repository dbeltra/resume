import React from "react";
import { useTranslation } from "react-i18next";

const LANGS = { en: "English", es: "Español", ca: "Català" };

const MenuBar = ({
  appName,
  menu,
  onMenu,
  onOpen,
  onGo,
  onCloseAll,
  onAbout,
  onRestart,
  onShutDown,
  onSpotlight,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || i18n.language;

  const menus = [
    {
      // the Apple-menu spot, with the site's logo square instead
      id: "system",
      logo: true,
      items: [
        { label: t("desktop.menu.about"), act: onAbout },
        { label: t("desktop.menu.restart"), act: onRestart },
        { label: t("desktop.menu.shutDown"), act: onShutDown },
      ],
    },
    {
      id: "file",
      items: [
        {
          label: t("desktop.menu.newBrowser"),
          hint: "davidbeltra.com",
          act: () => onGo("about"),
        },
        {
          label: t("desktop.menu.openCv"),
          hint: "Preview",
          act: () => onOpen("pdf"),
        },
        {
          label: t("desktop.menu.newMessage"),
          hint: "Mail",
          act: () => onOpen("mail"),
        },
        { label: t("desktop.menu.closeAll"), act: onCloseAll },
      ],
    },
    {
      id: "go",
      items: ["about", "experience", "skills", "contact"].map((p) => ({
        label: t(`desktop.pages.${p}`),
        hint: p === "about" ? "/" : `/${p}`,
        act: () => onGo(p),
      })),
    },
    {
      id: "agents",
      items: [
        {
          label: t("desktop.menu.watchReplay"),
          hint: "Terminal",
          act: () => onOpen("term"),
        },
        {
          label: t("desktop.menu.readAgentsMd"),
          hint: "Code",
          act: () => onOpen("code", "agents"),
        },
      ],
    },
    {
      id: "language",
      items: Object.entries(LANGS).map(([code, name]) => ({
        label: name,
        hint: lang === code ? "✓" : "",
        act: () => {
          i18n.changeLanguage(code);
          onMenu(null);
        },
      })),
    },
  ];

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-[1000] flex h-8 items-center justify-between border-b border-white/10 bg-ink-950/55 px-3 text-[13px] text-white backdrop-blur-2xl backdrop-saturate-150 [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]">
        <nav
          aria-label={t("desktop.menu.label")}
          className="flex items-center gap-0.5"
        >
          {menus.map((m) => (
            <div
              key={m.id}
              className="relative"
              style={{ order: m.logo ? -2 : undefined }}
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-label={m.logo ? t("desktop.menu.system") : undefined}
                aria-expanded={menu === m.id}
                onClick={() => onMenu(menu === m.id ? null : m.id)}
                onMouseEnter={() => menu && menu !== m.id && onMenu(m.id)}
                className={`flex h-[26px] items-center rounded-md px-2.5 font-medium ${menu === m.id ? "bg-ink-400" : "hover:bg-ink-600"}`}
              >
                {m.logo ? (
                  <span className="block h-3.5 w-3.5 rounded bg-lilac" />
                ) : (
                  t(`desktop.menu.${m.id}`)
                )}
              </button>
              {menu === m.id && (
                <div
                  role="menu"
                  className="absolute left-0 top-[30px] min-w-[270px] rounded-[9px] border border-ink-400 bg-ink-700 p-1.5 [text-shadow:none] shadow-[0_18px_50px_rgba(0,0,0,0.5)]"
                >
                  {m.items.map((it) => (
                    <button
                      key={it.label}
                      type="button"
                      role="menuitem"
                      onClick={it.act}
                      className="flex min-h-[34px] w-full items-center justify-between gap-4 rounded-md px-2.5 py-2 text-left hover:bg-ink-600"
                    >
                      <span>{it.label}</span>
                      <span className="font-mono text-[11px] text-ink-muted">
                        {it.hint}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <span className="-order-1 pl-1 pr-2.5 font-bold">{appName}</span>
        </nav>
        <div className="flex items-center gap-3.5 text-white/90">
          <button
            type="button"
            onClick={onSpotlight}
            aria-label={t("desktop.spotlight.label")}
            title="⌘K"
            className="flex h-[26px] items-center rounded-md px-1.5 hover:bg-ink-600"
          >
            <i
              className="material-symbols-outlined text-[18px]"
              aria-hidden="true"
            >
              search
            </i>
          </button>
          <span className="font-semibold uppercase">{lang}</span>
          <span>
            {new Date().toLocaleString(lang, {
              weekday: "short",
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </header>
      {menu && (
        <div
          className="absolute inset-0 z-[900]"
          onClick={() => onMenu(null)}
        />
      )}
    </>
  );
};

export default MenuBar;
