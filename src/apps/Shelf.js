import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Window from "../components/Window";
import { feedSrc, useFeed } from "../desktop/feed";

const stars = (r) => "★".repeat(Math.floor(r)) + (r % 1 ? "½" : "");

// Films from Letterboxd, shows from Trakt and books from Hardcover, synced
// by scripts/sync.mjs
const Shelf = ({ win, onSuggest }) => {
  const { t } = useTranslation();
  const { items, failed } = useFeed("shelf");
  const [sel, setSel] = useState(null); // url of the picked item
  const it = items?.find((x) => x.url === sel) || items?.[0];
  // one row per kind: films, then books; a kind with nothing synced is skipped
  const rows = ["film", "show", "book"]
    .map((kind) => [kind, (items || []).filter((x) => x.kind === kind)])
    .filter(([, xs]) => xs.length);

  return (
    <Window
      {...win}
      label={t("desktop.apps.shelf")}
      rect={{ w: 860, h: 690 }}
      className="border border-[#343741] bg-[#1e2026] text-ink-text"
      barClassName="h-11 border-b border-[#343741] bg-[#262932]"
      toolbar={
        <span className="flex-1 text-center text-[13px] font-semibold">
          {t("desktop.shelf.title")}
        </span>
      }
    >
      {!items?.length ? (
        <div className="flex flex-1 items-center justify-center text-sm text-ink-muted">
          {t(
            failed
              ? "desktop.shelf.error"
              : items
                ? "desktop.shelf.empty"
                : "desktop.shelf.loading",
          )}
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-auto">
          {rows.map(([kind, xs]) => (
            <section key={kind} className="flex-none pt-3">
              <h2 className="px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                {t(`desktop.shelf.${kind}s`)}
              </h2>
              <ul className="flex gap-3 overflow-x-auto px-6 pb-1.5 pt-2.5">
                {xs.map((x) => (
                  <li key={x.url} className="flex-none">
                    <button
                      type="button"
                      aria-pressed={x === it}
                      aria-label={x.title}
                      onClick={() => setSel(x.url)}
                      className={`block w-[80px] transition-transform duration-200 ${x === it ? "-translate-y-1.5" : "hover:-translate-y-1"}`}
                    >
                      <img
                        src={feedSrc(x.src)}
                        alt=""
                        loading="lazy"
                        className={`aspect-[2/3] w-full rounded-[3px] object-cover ${x === it ? "shadow-[0_12px_24px_rgba(0,0,0,0.55)] outline outline-2 outline-offset-2 outline-lilac" : "shadow-[0_4px_10px_rgba(0,0,0,0.4)]"}`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          {it && (
            <div className="flex flex-col items-center gap-0.5 px-6 pb-5 pt-2 text-center">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                {t(
                  it.reading
                    ? "desktop.shelf.reading"
                    : `desktop.shelf.${it.kind}`,
                )}
                {it.rating ? ` · ${stars(it.rating)}` : ""}
              </span>
              <span className="text-[17px] font-semibold">{it.title}</span>
              <span className="text-[12px] text-ink-muted">
                {[it.by, it.year].filter(Boolean).join(" · ")}
              </span>
              <a
                href={it.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-[12px] text-ink-muted underline-offset-2 hover:text-ink-text hover:underline"
              >
                {t(`desktop.shelf.on.${it.kind}`)} ↗
              </a>
            </div>
          )}
          <div className="mt-auto flex items-center justify-between border-t border-[#2e313a] px-6 py-3 text-[12px] text-ink-muted">
            <span>{t("desktop.shelf.source")}</span>
            <button
              type="button"
              onClick={onSuggest}
              className="font-semibold text-ink-text hover:underline"
            >
              {t("desktop.shelf.suggest")} →
            </button>
          </div>
        </div>
      )}
    </Window>
  );
};

export default Shelf;
