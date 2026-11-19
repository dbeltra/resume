import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Window from "../components/Window";
import { SiteNav, SitePage } from "./SitePages";

const IconBtn = ({ label, icon, onClick, disabled }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    onClick={onClick}
    disabled={disabled}
    className="flex h-8 w-8 items-center justify-center rounded-full text-[#e8eaed] hover:bg-white/10 disabled:text-[#6b6e74] disabled:hover:bg-transparent"
  >
    <i className="material-symbols-outlined" aria-hidden="true">
      {icon}
    </i>
  </button>
);

const Browser = ({
  win,
  page,
  canBack,
  canForward,
  onBack,
  onForward,
  onGo,
  onOpen,
}) => {
  const { t } = useTranslation();
  const scroller = useRef(null);
  // One-page site: a page is a section. Scroll so its top sits under the
  // sticky menu (the scroller's first child).
  const scrollTo = (p, behavior = "smooth") => {
    const el = scroller.current;
    const s = el?.querySelector(`[data-page="${p}"]`);
    if (!s) return;
    const top =
      s.getBoundingClientRect().top -
      el.getBoundingClientRect().top +
      el.scrollTop -
      el.firstChild.offsetHeight;
    el.scrollTo({ top: p === "about" ? 0 : top, behavior });
  };
  // back/forward and the menu bar change the page: go to its section.
  // Block body on purpose: scrollTo returns a Promise in recent Chrome,
  // and React would try to call it as the effect cleanup
  useEffect(() => {
    scrollTo(page);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  // the section being read, for the menu's underline and the address bar:
  // the last one whose top has passed the menu
  const [seen, setSeen] = useState(page);
  const onScroll = () => {
    const el = scroller.current;
    const line =
      el.getBoundingClientRect().top + el.firstChild.offsetHeight + 8;
    let cur = "about";
    for (const s of el.querySelectorAll("[data-page]"))
      if (s.getBoundingClientRect().top <= line) cur = s.dataset.page;
    setSeen(cur);
  };
  // a menu click: history as before, and a scroll even when it is the page
  // already in history (you may have scrolled away from it since)
  const goTo = (p) => {
    onGo(p);
    scrollTo(p);
  };

  // reload: a short loading bar, then the page re-mounts from the top
  const [loads, setLoads] = useState(0);
  const [loading, setLoading] = useState(false);
  // blocks rise in (index.css .reveal) the first time they scroll into view;
  // rerun on reload, which remounts the page
  useEffect(() => {
    const root = scroller.current;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("in");
          io.unobserve(e.target);
        }),
      { root, rootMargin: "0px 0px -8% 0px" },
    );
    root.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [loads]); // eslint-disable-line react-hooks/exhaustive-deps

  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const reload = () => {
    setLoading(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setLoads((n) => n + 1);
      setLoading(false);
      scroller.current?.scrollTo(0, 0);
      setSeen("about");
    }, 450);
  };

  const path = seen === "about" ? "" : `/${seen}`;

  return (
    <Window
      {...win}
      label={t("desktop.apps.browser")}
      rect={{ w: 980, h: 700 }}
      className="border border-[#34363c] bg-[#202124]"
      barClassName="h-[38px] items-end"
      toolbar={
        <div className="ml-2 flex h-[30px] max-w-[280px] items-center gap-2 rounded-t-[9px] bg-[#35363a] px-3.5 text-xs text-[#e8eaed]">
          {/* the site's real favicon, so the tab matches the browser's own */}
          <img
            src={`${process.env.PUBLIC_URL}/favicon-32x32.png`}
            alt=""
            className="h-4 w-4 flex-none rounded-[3px]"
          />
          <span className="truncate">David Beltrà</span>
        </div>
      }
    >
      <div className="flex h-10 flex-none items-center gap-1 border-b border-[#1c1d20] bg-[#35363a] px-2.5">
        <IconBtn
          label={t("desktop.browser.back")}
          icon="arrow_back"
          onClick={onBack}
          disabled={!canBack}
        />
        <IconBtn
          label={t("desktop.browser.forward")}
          icon="arrow_forward"
          onClick={onForward}
          disabled={!canForward}
        />
        <IconBtn
          label={t("desktop.browser.reload")}
          icon="refresh"
          onClick={reload}
        />
        <div className="flex h-[30px] flex-1 items-center gap-2 rounded-full bg-[#202124] px-3.5 text-[13px] text-[#e8eaed]">
          <i
            className="material-symbols-outlined text-base text-[#9aa0a6]"
            aria-hidden="true"
          >
            lock
          </i>
          davidbeltra.com<span className="text-[#9aa0a6]">{path}</span>
        </div>
      </div>
      <div
        aria-hidden="true"
        className={`h-0.5 flex-none bg-transparent ${loading ? "" : "invisible"}`}
      >
        <div
          className={`h-full bg-gradient-to-r from-plum to-peri ${loading ? "animate-[loadbar_0.45s_ease-out_forwards]" : "w-0"}`}
        />
      </div>
      <div
        ref={scroller}
        onScroll={onScroll}
        className="min-h-0 flex-1 overflow-auto bg-white font-sans text-[#17151f]"
      >
        <SiteNav page={seen} onGo={goTo} />
        <SitePage
          key={loads}
          onOpenCv={() => onOpen("pdf")}
          onOpenMail={() => onOpen("mail")}
        />
      </div>
    </Window>
  );
};

export default Browser;
