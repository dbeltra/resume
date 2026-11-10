import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Window from "../components/Window";
import { TRASH_FILES as FILES } from "./trashFiles";

const Trash = ({ win }) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState(FILES);
  const [selected, setSelected] = useState(null);
  const [look, setLook] = useState(null); // Quick Look: Space or double-click
  const peek = files.find((f) => f.name === look);
  const places = ["desktop", "documents", "downloads"];

  return (
    <Window
      {...win}
      label={t("desktop.apps.trash")}
      rect={{ w: 640, h: 420 }}
      className="border border-[#3a3d45] bg-[#1e2026] text-ink-text"
      barClassName="h-[52px] border-b border-[#33363e] bg-[#2a2d34]"
      toolbar={
        <>
          <span className="flex-1 pl-2 text-[13px] font-semibold">
            {t("desktop.apps.trash")}
          </span>
          <button
            type="button"
            onClick={() => {
              setFiles([]);
              setSelected(null);
              setLook(null);
            }}
            disabled={!files.length}
            className="h-7 rounded-md border border-[#4a4d55] px-3 text-xs font-medium hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            {t("desktop.trashApp.empty")}
          </button>
        </>
      }
    >
      <div className="flex min-h-0 flex-1">
        <nav
          aria-label={t("desktop.trashApp.favorites")}
          className="hidden w-[150px] flex-none flex-col gap-0.5 border-r border-[#33363e] bg-[#24262d] px-2 py-3 text-[13px] sm:flex"
        >
          <div className="px-2 pb-1 text-[11px] font-semibold text-ink-muted">
            {t("desktop.trashApp.favorites")}
          </div>
          {places.map((p) => (
            <div key={p} className="rounded-md px-2 py-1 text-ink-soft">
              {t(`desktop.trashApp.${p}`)}
            </div>
          ))}
          <div className="rounded-md bg-ink-600 px-2 py-1 text-white">
            {t("desktop.apps.trash")}
          </div>
        </nav>
        <div
          className="flex min-w-0 flex-1 flex-col"
          onClick={() => setSelected(null)}
        >
          {files.length ? (
            <ul className="grid flex-1 grid-cols-[repeat(auto-fill,minmax(110px,1fr))] content-start gap-2 overflow-auto p-4">
              {files.map((f) => (
                <li key={f.name}>
                  <button
                    type="button"
                    aria-pressed={selected === f.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(f.name);
                    }}
                    onDoubleClick={() => setLook(f.name)}
                    onKeyDown={(e) => {
                      if (e.key !== " " && e.key !== "Enter") return;
                      e.preventDefault();
                      setSelected(f.name);
                      setLook((l) => (l === f.name ? null : f.name));
                    }}
                    className="flex w-full flex-col items-center gap-1.5 rounded-lg p-2 text-center"
                  >
                    <img
                      src={f.icon}
                      alt=""
                      className={`h-14 w-14 rounded-md object-contain p-0.5 ${selected === f.name ? "bg-white/15" : ""}`}
                    />
                    <span
                      className={`break-all rounded px-1 text-xs leading-tight ${selected === f.name ? "bg-[#0a64d6] text-white" : "text-ink-soft"}`}
                    >
                      {f.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-ink-muted">
              {t("desktop.trashApp.isEmpty")}
            </div>
          )}
          {peek && (
            <div
              role="dialog"
              aria-label={`${t("desktop.trashApp.quickLook")}: ${peek.name}`}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key !== "Escape" && e.key !== " ") return;
                e.preventDefault();
                setLook(null);
              }}
              className="absolute inset-x-6 bottom-10 top-16 z-10 flex animate-[app-open_0.18s_ease-out] flex-col overflow-hidden rounded-xl border border-white/15 bg-[#2a2c33]/95 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex h-9 flex-none items-center gap-2 border-b border-white/10 px-3 text-[12px] font-semibold">
                <button
                  type="button"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  onClick={() => setLook(null)}
                  aria-label={t("desktop.trashApp.close")}
                  className="h-3 w-3 rounded-full bg-[#e5534b] hover:brightness-110"
                />
                <img src={peek.icon} alt="" className="h-4 w-4" />
                {peek.name}
              </div>
              <pre className="m-0 flex-1 overflow-auto whitespace-pre-wrap p-4 font-mono text-[12.5px] leading-relaxed text-[#d7dae0]">
                {peek.body}
              </pre>
            </div>
          )}
          <div className="flex h-7 flex-none items-center justify-center border-t border-[#33363e] text-[11px] text-ink-muted">
            {selected
              ? t("desktop.trashApp.hint")
              : t("desktop.trashApp.items", { count: files.length })}
          </div>
        </div>
      </div>
    </Window>
  );
};

export default Trash;
