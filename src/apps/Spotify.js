import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Window from "../components/Window";
import { enabled, getLibrary, spotify, USER } from "../desktop/lastfm";

const REFRESH_MS = 60000;

// "how long ago", in the site's language, from stdlib
const ago = (ms, lang) => {
  const s = Math.round((ms - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  for (const [unit, n] of [
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ])
    if (Math.abs(s) >= n) return rtf.format(Math.round(s / n), unit);
  return rtf.format(0, "minute");
};

const Cover = ({ src, className }) =>
  src ? (
    <img src={src} alt="" className={`object-cover ${className}`} />
  ) : (
    <span
      aria-hidden="true"
      className={`flex items-center justify-center bg-[#282828] text-[#7a7a7a] ${className}`}
    >
      ♫
    </span>
  );

const Eq = () => (
  <span aria-hidden="true" className="flex h-3 items-end gap-[2px]">
    {[0, 0.2, 0.4].map((d) => (
      <span
        key={d}
        style={{ animationDelay: `${d}s` }}
        className="h-full w-[3px] origin-bottom rounded-sm bg-[#1db954] motion-safe:animate-[eq_0.9s_ease-in-out_infinite_alternate]"
      />
    ))}
  </span>
);

// Spotify-style window fed by David's Last.fm scrobbles
const Spotify = ({ win }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || i18n.language;
  const [lib, setLib] = useState(null);
  const [failed, setFailed] = useState(!enabled);

  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    const load = () =>
      document.visibilityState === "visible" &&
      getLibrary()
        .then((x) => {
          if (!alive) return;
          setLib(x);
          setFailed(false);
        })
        // after a failed refresh the last good data stays on screen
        .catch(() => alive && setFailed(true));
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const hero = lib?.hero;
  const row =
    "flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-white/10";

  return (
    <Window
      {...win}
      label={t("desktop.apps.spotify")}
      rect={{ w: 780, h: 520 }}
      className="border border-[#2a2a2a] bg-[#121212] text-white"
      barClassName="h-10 bg-black"
      toolbar={
        <span className="flex-1 text-center text-[13px] font-semibold">
          Spotify
        </span>
      }
    >
      {!lib ? (
        <div className="flex flex-1 items-center justify-center text-sm text-[#a7a7a7]">
          {failed ? t("desktop.spotify.error") : t("desktop.spotify.loading")}
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-auto p-5 sm:flex-row">
          {hero && (
            <section className="flex flex-none flex-col gap-3 sm:w-[230px]">
              <Cover
                src={hero.art}
                className="aspect-square w-full rounded-lg text-5xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
              />
              <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-[#a7a7a7]">
                {hero.live && <Eq />}
                {t(
                  hero.live
                    ? "desktop.spotify.live"
                    : "desktop.spotify.onRepeat",
                )}
              </div>
              <div>
                <div className="text-[20px] font-bold leading-tight">
                  {hero.name}
                </div>
                <div className="text-[14px] text-[#a7a7a7]">
                  {hero.artist}
                  {!hero.live &&
                    ` · ${t("desktop.spotify.plays", { count: hero.plays })}`}
                </div>
              </div>
              <a
                href={spotify(hero)}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start rounded-full bg-[#1db954] px-5 py-2 text-[13px] font-bold text-black hover:scale-[1.03] hover:bg-[#1ed760]"
              >
                {t("desktop.spotify.open")}
              </a>
            </section>
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            {lib.recent.length > 0 && (
              <section>
                <h2 className="mb-1 px-2 text-[15px] font-bold">
                  {t("desktop.spotify.recent")}
                </h2>
                <ul>
                  {lib.recent.map((m) => (
                    <li key={`${m.name}-${m.at}`}>
                      <a
                        href={spotify(m)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={row}
                      >
                        <Cover
                          src={m.art}
                          className="h-10 w-10 flex-none rounded"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14px]">
                            {m.name}
                          </span>
                          <span className="block truncate text-[12px] text-[#a7a7a7]">
                            {m.artist}
                          </span>
                        </span>
                        <span className="flex-none text-[12px] text-[#a7a7a7]">
                          {ago(m.at, lang)}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {lib.top.length > 0 && (
              <section>
                <h2 className="mb-1 px-2 text-[15px] font-bold">
                  {t("desktop.spotify.topWeek")}
                </h2>
                <ol>
                  {lib.top.map((m, i) => (
                    <li key={m.url}>
                      <a
                        href={spotify(m)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={row}
                      >
                        <span className="w-5 flex-none text-right text-[14px] text-[#a7a7a7]">
                          {i + 1}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[14px]">
                          {m.name}{" "}
                          <span className="text-[#a7a7a7]">· {m.artist}</span>
                        </span>
                        <span className="flex-none text-[12px] text-[#a7a7a7]">
                          {t("desktop.spotify.plays", { count: m.plays })}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            )}
            <a
              href={`https://www.last.fm/user/${USER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto px-2 text-[11px] text-[#7a7a7a] hover:text-white"
            >
              {t("desktop.spotify.source")}
            </a>
          </div>
        </div>
      )}
    </Window>
  );
};

export default Spotify;
