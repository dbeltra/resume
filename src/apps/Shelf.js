import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Window from "../components/Window";
import { feedSrc, useFeed } from "../desktop/feed";

const KINDS = ["film", "show", "book", "game"];
const stars = (r) => "★".repeat(Math.floor(r)) + (r % 1 ? "½" : "");

// A cover, or for a game without one, its title on a dashed card so the
// missing cover is easy to spot.
const Cover = ({ item, className = "" }) =>
  item.src ? (
    <img
      src={feedSrc(item.src)}
      alt=""
      loading="lazy"
      className={`aspect-[2/3] w-full rounded-md object-cover ${className}`}
    />
  ) : (
    <span
      aria-hidden="true"
      className={`flex aspect-[2/3] w-full items-center justify-center overflow-hidden rounded-md border border-dashed border-[#4a4f5c] bg-[#262932] p-2 text-center text-[11px] font-semibold leading-tight text-ink-muted ${className}`}
    >
      {item.title}
    </span>
  );

// One kind's row: a header (name, count, source) over covers that scroll
// sideways, with ‹ › buttons on hover and soft fades at the edges.
const Row = ({ kind, items, picked, onPick }) => {
  const { t } = useTranslation();
  const list = useRef(null);
  const nudge = (d) =>
    list.current?.scrollBy({
      left: d * list.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  const arrow =
    "absolute top-[38%] z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition-opacity hover:bg-black/80 focus-visible:opacity-100 group-hover:opacity-100";

  return (
    <section className="group relative pb-1 pt-4">
      <h2 className="flex items-baseline gap-2 px-6">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-text">
          {t(`desktop.shelf.${kind}s`)}
        </span>
        <span className="text-[11px] text-ink-muted">{items.length}</span>
        <span className="ml-auto text-[11px] text-ink-muted">
          {t(`desktop.shelf.from.${kind}`)}
        </span>
      </h2>
      <button
        type="button"
        aria-label={t("desktop.shelf.left")}
        onClick={() => nudge(-1)}
        className={`${arrow} left-2`}
      >
        ‹
      </button>
      <ul
        ref={list}
        className="flex snap-x scroll-px-6 gap-4 overflow-x-auto scroll-smooth px-6 pb-3 pt-3 [mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)] [scrollbar-width:none]"
      >
        {items.map((x) => (
          <li key={x.url || x.title} className="w-[104px] flex-none snap-start">
            <button
              type="button"
              aria-pressed={x === picked}
              aria-label={x.title}
              onClick={() => onPick(x)}
              className="group/c block w-full text-left"
            >
              <Cover
                item={x}
                className={`transition duration-200 ${
                  x === picked
                    ? "-translate-y-1 shadow-[0_14px_28px_rgba(0,0,0,0.6)] outline outline-2 outline-offset-2 outline-lilac"
                    : "shadow-[0_6px_14px_rgba(0,0,0,0.45)] group-hover/c:-translate-y-1 group-hover/c:shadow-[0_12px_24px_rgba(0,0,0,0.55)]"
                }`}
              />
              <span
                className={`mt-2 line-clamp-2 text-[11px] leading-snug ${x === picked ? "text-ink-text" : "text-ink-muted group-hover/c:text-ink-text"}`}
              >
                {x.title}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        aria-label={t("desktop.shelf.right")}
        onClick={() => nudge(1)}
        className={`${arrow} right-2`}
      >
        ›
      </button>
    </section>
  );
};

// The picked title, large: cover over its own blurred art, what it is, the
// facts each source gives (rating, episode, author, pages, platform) and a
// synopsis.
const Details = ({ item, onSuggest }) => {
  const { t } = useTranslation();
  const facts = [
    item.by,
    item.year,
    item.pages && t("desktop.shelf.pages", { count: item.pages }),
    ...(item.genres || []).map((g) => g[0].toUpperCase() + g.slice(1)),
  ].filter(Boolean);

  return (
    <aside className="relative flex max-h-[50%] min-h-0 flex-col overflow-hidden border-t border-[#2e313a] md:max-h-none md:w-[300px] md:flex-none md:border-l md:border-t-0">
      {item.src && (
        <img
          src={feedSrc(item.src)}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-125 object-cover opacity-25 blur-3xl"
        />
      )}
      <div
        key={item.url || item.title}
        className="relative flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-5 motion-safe:animate-[app-open_0.3s_ease-out]"
      >
        {/* phones: small cover beside the title; wider: cover on top */}
        <div className="flex gap-4 md:flex-col md:gap-3">
          <div className="w-[84px] flex-none md:mx-auto md:w-[150px]">
            <Cover
              item={item}
              className="shadow-[0_18px_40px_rgba(0,0,0,0.6)]"
            />
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-text">
                {t(`desktop.shelf.${item.kind}`)}
              </span>
              {item.reading && (
                <span className="rounded-full bg-lilac/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-lilac-text">
                  {t("desktop.shelf.reading")}
                </span>
              )}
              {item.rating ? (
                <span
                  className="text-[12px] text-[#f5c451]"
                  aria-label={`${item.rating}/5`}
                >
                  {stars(item.rating)}
                </span>
              ) : null}
            </div>
            <h3 className="text-[18px] font-semibold leading-tight text-white">
              {item.title}
            </h3>
            {facts.length > 0 && (
              <p className="text-[12px] text-ink-muted">{facts.join(" · ")}</p>
            )}
          </div>
        </div>
        {item.about && (
          <p className="text-[13px] leading-relaxed text-[#c3c7d0]">
            {item.about}
          </p>
        )}
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 self-start rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] font-semibold text-ink-text hover:bg-white/15"
          >
            {t(`desktop.shelf.on.${item.kind}`)} ↗
          </a>
        )}
      </div>
      <button
        type="button"
        onClick={onSuggest}
        className="relative flex-none border-t border-[#2e313a] px-5 py-3 text-left text-[12px] font-semibold text-ink-text hover:bg-white/5"
      >
        {t("desktop.shelf.suggest")} →
      </button>
    </aside>
  );
};

// Films from Letterboxd, shows from Trakt, books from Hardcover and games
// from a Google Sheet, synced by scripts/sync.mjs
const Shelf = ({ win, onSuggest }) => {
  const { t } = useTranslation();
  const { items, failed } = useFeed("shelf");
  const [picked, setPicked] = useState(null);
  const it = (picked && items?.find((x) => x === picked)) || items?.[0];
  // one row per kind; a kind with nothing synced is skipped
  const rows = KINDS.map((kind) => [
    kind,
    (items || []).filter((x) => x.kind === kind),
  ]).filter(([, xs]) => xs.length);

  return (
    <Window
      {...win}
      label={t("desktop.apps.shelf")}
      rect={{ w: 1000, h: 680 }}
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
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pb-3">
            {rows.map(([kind, xs]) => (
              <Row
                key={kind}
                kind={kind}
                items={xs}
                picked={it}
                onPick={setPicked}
              />
            ))}
          </div>
          {it && <Details item={it} onSuggest={onSuggest} />}
        </div>
      )}
    </Window>
  );
};

export default Shelf;
