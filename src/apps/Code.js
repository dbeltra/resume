import "highlight.js/styles/atom-one-dark.css";
import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import json from "highlight.js/lib/languages/json";
import python from "highlight.js/lib/languages/python";
import rust from "highlight.js/lib/languages/rust";
import markdown from "highlight.js/lib/languages/markdown";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Window from "../components/Window";
import { CODE, SOURCES } from "../data";

hljs.registerLanguage("xml", xml);
hljs.registerLanguage("json", json);
hljs.registerLanguage("python", python);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("markdown", markdown);

// hljs returns one HTML string; split it per line for the gutter.
// ponytail: a token spanning several lines (block comment) loses its colour
// after the first line; none of the snippets have one.
const highlightLines = (code, language) =>
  hljs.highlight(code, { language }).value.split("\n");

const FOLDERS = [
  { name: ".git", files: ["HEAD", "config", "index"] },
  {
    name: "public",
    files: ["index.html", "favicon.ico", "manifest.json", "robots.txt"],
  },
  { name: "src" }, // children are the openable SOURCES
];

const Code = ({ win, tab, onTab }) => {
  const [openDirs, setOpenDirs] = useState({ src: true });
  const { t } = useTranslation();
  const src = SOURCES.find((s) => s.id === tab) || SOURCES[0];
  const lines = useMemo(
    () => highlightLines(CODE[src.id], src.language),
    [src],
  );

  return (
    <Window
      {...win}
      label={t("desktop.apps.code")}
      title={`resume — src/${src.file}`}
      rect={{ w: 900, h: 600 }}
      className="border border-[#2a2f3b] bg-ink-800 text-ink-text"
      barClassName="h-9 border-b border-ink-500 bg-ink-850"
    >
      <div className="flex min-h-0 flex-1">
        <nav
          aria-label={t("desktop.code.files")}
          className="hidden w-[200px] flex-none flex-col gap-0.5 border-r border-ink-500 bg-ink-850 px-2.5 py-3 text-[13px] sm:flex"
        >
          {FOLDERS.map((f) => (
            <div key={f.name} role="group" aria-label={f.name}>
              <button
                type="button"
                aria-expanded={!!openDirs[f.name]}
                onClick={() =>
                  setOpenDirs((d) => ({ ...d, [f.name]: !d[f.name] }))
                }
                className="flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-ink-soft hover:bg-ink-700"
              >
                <i
                  className={`material-symbols-outlined text-lg transition-transform duration-150 ${openDirs[f.name] ? "rotate-90" : ""}`}
                  aria-hidden="true"
                >
                  chevron_right
                </i>
                {f.name}
              </button>
              {openDirs[f.name] &&
                (f.name === "src"
                  ? SOURCES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => onTab(s.id)}
                        className={`flex min-h-[30px] w-full items-center gap-2 rounded-md py-1.5 pl-[30px] pr-1.5 text-left ${s.id === src.id ? "bg-ink-600 text-white" : "text-ink-soft hover:bg-ink-700"}`}
                      >
                        <i
                          className="material-symbols-outlined text-[17px]"
                          style={{ color: s.color }}
                          aria-hidden="true"
                        >
                          {s.icon}
                        </i>
                        {s.file}
                      </button>
                    ))
                  : // ponytail: files outside src/ are listed for realism but don't open
                    f.files.map((name) => (
                      <div
                        key={name}
                        className="flex min-h-[30px] items-center gap-2 py-1.5 pl-[30px] pr-1.5 text-ink-muted"
                      >
                        <i
                          className="material-symbols-outlined text-[17px]"
                          aria-hidden="true"
                        >
                          description
                        </i>
                        {name}
                      </div>
                    )))}
            </div>
          ))}
        </nav>
        <div className="flex min-w-0 flex-1 flex-col">
          <div
            role="tablist"
            className="flex h-[34px] flex-none overflow-x-auto border-b border-ink-500 bg-ink-900"
          >
            {SOURCES.map((s) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={s.id === src.id}
                onClick={() => onTab(s.id)}
                className={`flex items-center whitespace-nowrap border-r border-ink-500 px-3.5 text-xs ${s.id === src.id ? "bg-ink-800 text-white shadow-[inset_0_2px_0_#b98ab9]" : "text-ink-soft hover:bg-ink-800"}`}
              >
                {s.file}
              </button>
            ))}
          </div>
          <pre className="m-0 min-h-0 flex-1 overflow-auto bg-ink-900 py-3.5 font-mono text-[13px] leading-[1.8]">
            <code>
              {lines.map((html, i) => (
                <div key={i} className="flex gap-[18px] px-4">
                  <span className="w-[22px] flex-none select-none text-right text-[#4f5664]">
                    {i + 1}
                  </span>
                  <span
                    className="whitespace-pre"
                    dangerouslySetInnerHTML={{ __html: html || " " }}
                  />
                </div>
              ))}
            </code>
          </pre>
          <div className="flex h-6 flex-none items-center justify-between border-t border-ink-500 bg-ink-950 px-3 font-mono text-[11px] text-ink-muted">
            <span>⑂ main ⊗ 0 ⚠ 0</span>
            <span>Ln 1/{lines.length} · Spaces: 2 · UTF-8</span>
          </div>
        </div>
      </div>
    </Window>
  );
};

export default Code;
