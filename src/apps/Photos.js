import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Window from "../components/Window";
import { feedSrc, useFeed } from "../desktop/feed";

// Instagram posts synced by scripts/sync.mjs: a grid, and one photo at a time
const Photos = ({ win }) => {
  const { t, i18n } = useTranslation();
  const { items, failed } = useFeed("photos");
  const [open, setOpen] = useState(null); // index of the photo being viewed
  const n = items?.length || 0;
  const step = (d) => setOpen((i) => (i + d + n) % n);
  const it = open !== null && items?.[open];

  useEffect(() => {
    if (open === null || !win.front) return; // keys belong to the focused window
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, n, win.front]);

  const date = (d) =>
    d &&
    new Date(d).toLocaleDateString(i18n.resolvedLanguage, {
      month: "long",
      year: "numeric",
    });
  const nav =
    "absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20";

  return (
    <Window
      {...win}
      label={t("desktop.apps.photos")}
      rect={{ w: 900, h: 620 }}
      className="border border-[#343741] bg-[#1e2026] text-ink-text"
      barClassName="h-11 border-b border-[#343741] bg-[#262932]"
      toolbar={
        <span className="flex-1 text-center text-[13px] font-semibold">
          {t("desktop.apps.photos")}
        </span>
      }
    >
      <div className="relative flex min-h-0 flex-1 flex-col">
        {!n ? (
          <div className="flex flex-1 items-center justify-center text-sm text-ink-muted">
            {t(
              failed
                ? "desktop.photos.error"
                : items
                  ? "desktop.photos.empty"
                  : "desktop.photos.loading",
            )}
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-auto px-6 pb-6 pt-5">
            <h2 className="text-[26px] font-bold leading-tight">
              {t("desktop.photos.library")}
            </h2>
            <p className="mb-4 text-[13px] text-ink-muted">
              {t("desktop.photos.count", { count: n })}
            </p>
            <ul className="grid grid-cols-3 gap-[3px] sm:grid-cols-5">
              {items.map((p, i) => (
                <li key={p.url || p.src}>
                  <button
                    type="button"
                    aria-label={p.caption || t("desktop.photos.photo")}
                    onClick={() => setOpen(i)}
                    className="block aspect-square w-full overflow-hidden"
                  >
                    <img
                      src={feedSrc(p.src)}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.04]"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {it && (
          <div
            role="dialog"
            aria-label={it.caption || t("desktop.photos.photo")}
            className="absolute inset-0 flex flex-col bg-[#0b0b0c]/95 text-white"
          >
            <button
              type="button"
              autoFocus
              onClick={() => setOpen(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/10 px-3 py-1 text-[12px] hover:bg-white/20"
            >
              {t("desktop.photos.close")}
            </button>
            <div className="relative flex min-h-0 flex-1 items-center justify-center p-6">
              <img
                src={feedSrc(it.src)}
                alt={it.caption}
                className="max-h-full max-w-full rounded object-contain"
              />
              {n > 1 && (
                <>
                  <button
                    type="button"
                    aria-label={t("desktop.photos.prev")}
                    onClick={() => step(-1)}
                    className={`${nav} left-3`}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    aria-label={t("desktop.photos.next")}
                    onClick={() => step(1)}
                    className={`${nav} right-3`}
                  >
                    ›
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center justify-between gap-4 px-6 pb-4 text-[13px]">
              <span className="min-w-0 truncate">
                {it.caption}
                <span className="text-white/50">
                  {it.caption && it.at ? " · " : ""}
                  {date(it.at)}
                </span>
              </span>
              {it.url && (
                <a
                  href={it.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-none text-white/60 hover:text-white"
                >
                  {t("desktop.photos.onInstagram")} ↗
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </Window>
  );
};

export default Photos;
