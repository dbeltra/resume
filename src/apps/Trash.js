import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Window from "../components/Window";
import FileIcon from "../assets/icons/apps/file.png";
import FolderIcon from "../assets/icons/apps/folder.png";
import PdfIcon from "../assets/icons/apps/pdf.png";

// Finder-style Trash with a few joke files. "Empty" clears them until the
// window is closed and reopened.
const FILES = [
  { name: "jquery_spaghetti.js", icon: FileIcon },
  { name: "class_components", icon: FolderIcon },
  { name: "TODO_final_FINAL_v3.txt", icon: FileIcon },
  { name: "resume_2014.pdf", icon: PdfIcon },
  { name: "node_modules", icon: FolderIcon },
];

const Trash = ({ win }) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState(FILES);
  const [selected, setSelected] = useState(null);
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
          <div className="flex h-7 flex-none items-center justify-center border-t border-[#33363e] text-[11px] text-ink-muted">
            {t("desktop.trashApp.items", { count: files.length })}
          </div>
        </div>
      </div>
    </Window>
  );
};

export default Trash;
