import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { enabled, findPreview, getRecentSongs, spotify } from "./lastfm";
import { ago, Cover, Eq } from "../apps/Spotify";

const REFRESH_MS = 60000;

// Bold borderless controls (styles: .np-btn in index.css). The play button
// stacks both icons and cross-fades/rotates between them.
const Ctl = ({ label, icon, play, active, ...p }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    className={`np-btn ${play ? "np-btn--play" : ""} ${active ? "is-active" : ""}`}
    {...p}
  >
    {play ? (
      <>
        <i className="material-symbols-outlined np-play" aria-hidden="true">
          play_arrow
        </i>
        <i className="material-symbols-outlined np-pause" aria-hidden="true">
          pause
        </i>
      </>
    ) : (
      <i className="material-symbols-outlined" aria-hidden="true">
        {icon}
      </i>
    )}
  </button>
);

// Desktop widget under status.json: David's Last.fm songs, newest first.
// ‹ › step through them, ▶ plays a 30 s Apple preview, ↗ searches it on
// Spotify, the title opens the Spotify app.
const NowPlaying = ({ onOpen }) => {
  const { t, i18n } = useTranslation();
  const [songs, setSongs] = useState(null);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1 of the preview
  const [noPreview, setNoPreview] = useState(false);
  const audio = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    const load = () =>
      document.visibilityState === "visible" &&
      getRecentSongs()
        .then((s) => alive && s.length && setSongs(s))
        .catch(() => {}); // ponytail: a failed refresh keeps the last songs shown
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      alive = false;
      clearInterval(id);
      audio.current?.pause();
    };
  }, []);

  const song = songs?.[Math.min(i, songs.length - 1)];

  const stop = () => {
    audio.current?.pause();
    audio.current = null;
    setPlaying(false);
    setProgress(0);
  };
  const go = (d) => {
    stop();
    setNoPreview(false);
    setI((n) => Math.max(0, Math.min(songs.length - 1, n + d)));
  };
  const toggle = async () => {
    if (playing) return stop();
    // phones (iOS Safari) only allow audio started inside the tap itself, and
    // the preview lookup below is async: create and "unlock" the element now,
    // attach the preview once Apple answers
    const a = new Audio();
    a.play().catch(() => {});
    const url = await findPreview(song);
    if (!url) return setNoPreview(true);
    a.src = url;
    a.volume = 0.6;
    a.ontimeupdate = () => setProgress(a.currentTime / (a.duration || 30));
    a.onended = stop;
    audio.current = a;
    a.play().then(
      () => setPlaying(true),
      () => setNoPreview(true),
    );
  };

  // mounts when Last.fm answers; its entrance (delayed a beat after
  // status.json's, see Desktop.js) makes the wait read as choreography
  if (!song) return null;
  const label = song.live
    ? t("desktop.spotify.live")
    : ago(song.at, i18n.resolvedLanguage);

  return (
    <section
      aria-label={t("desktop.nowPlaying.title")}
      className="relative flex h-[140px] overflow-hidden rounded-xl border border-[#2a2f3b] bg-ink-800 text-[13px] motion-safe:animate-[app-open_0.5s_ease-out_0.45s_both]"
    >
      {/* big cover on the left; the same cover, blurred and darkened, tints
          the controls side, like iOS's music widget */}
      {/* blurred tint behind the controls: a hidden Cover, so it retries too */}
      <span aria-hidden="true" className="absolute inset-0">
        <Cover
          src={song.art}
          className="h-full w-full scale-125 opacity-60 blur-2xl"
        />
      </span>
      {/* the cover is the Spotify link: ↗ shows on hover */}
      <a
        href={spotify(song)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("desktop.spotify.open")}
        title={t("desktop.spotify.open")}
        className="group relative h-full w-[128px] flex-none"
      >
        <Cover src={song.art} className="h-full w-full text-4xl" />
        <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
          <i
            className="material-symbols-outlined text-[26px]"
            aria-hidden="true"
          >
            open_in_new
          </i>
        </span>
      </a>
      <div className="relative flex min-w-0 flex-1 flex-col bg-black/35 px-3.5 pb-2.5 pt-3">
        <span className="flex items-center gap-1.5 whitespace-nowrap text-[11px] text-white/70">
          {(song.live || playing) && <Eq />}
          {playing ? t("desktop.nowPlaying.preview") : label}
        </span>
        <button
          type="button"
          onClick={onOpen}
          title={t("desktop.dock.spotify")}
          className="mt-0.5 min-w-0 text-left"
        >
          <span className="block truncate font-semibold text-white hover:underline">
            {song.name}
          </span>
          <span className="block truncate text-[12px] text-white/70">
            {song.artist}
          </span>
        </button>
        <div className="mt-auto flex items-center justify-center gap-5">
          <Ctl
            label={t("desktop.nowPlaying.prev")}
            icon="fast_rewind"
            disabled={i === 0}
            onClick={() => go(-1)}
          />
          <Ctl
            play
            active={playing}
            label={t(
              noPreview
                ? "desktop.nowPlaying.noPreview"
                : playing
                  ? "desktop.nowPlaying.pause"
                  : "desktop.nowPlaying.play",
            )}
            disabled={noPreview}
            onClick={toggle}
          />
          <Ctl
            label={t("desktop.nowPlaying.next")}
            icon="fast_forward"
            disabled={i >= songs.length - 1}
            onClick={() => go(1)}
          />
        </div>
        <div
          aria-hidden="true"
          className="mt-2 h-[3px] flex-none overflow-hidden rounded-full bg-white/15"
        >
          <div
            className="h-full rounded-full bg-white/80 transition-[width] duration-200 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
};

export default NowPlaying;
