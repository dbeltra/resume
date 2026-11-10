import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Window from "../components/Window";
import { SiteNav, SitePage, SITE_BACKGROUND } from "./SitePages";

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
  // block body on purpose: scrollTo returns a Promise in recent Chrome,
  // and React would try to call it as the effect cleanup
  useEffect(() => {
    scroller.current?.scrollTo(0, 0);
  }, [page]);

  // reload: a short loading bar, then the page re-mounts from the top
  const [loads, setLoads] = useState(0);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const reload = () => {
    setLoading(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setLoads((n) => n + 1);
      setLoading(false);
      scroller.current?.scrollTo(0, 0);
    }, 450);
  };

  const path = page === "about" ? "" : `/${page}`;

  return (
    <Window
      {...win}
      label={t("desktop.apps.browser")}
      rect={{ w: 980, h: 700 }}
      className="border border-[#34363c] bg-[#202124]"
      barClassName="h-[38px] items-end"
      toolbar={
        <div className="ml-2 flex h-[30px] max-w-[280px] items-center gap-2 rounded-t-[9px] bg-[#35363a] px-3.5 text-xs text-[#e8eaed]">
          <span
            aria-hidden="true"
            className="h-3 w-3 flex-none rounded-[3px] bg-lilac"
          />
          <span className="truncate">
            {t(`desktop.pages.${page}`)} · David Beltrà
          </span>
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
        style={SITE_BACKGROUND}
        className="min-h-0 flex-1 overflow-auto font-sans text-[#17151f]"
      >
        <SiteNav page={page} onGo={onGo} />
        <SitePage
          key={loads}
          page={page}
          onOpenCv={() => onOpen("pdf")}
          onOpenMail={() => onOpen("mail")}
        />
      </div>
    </Window>
  );
};

export default Browser;
