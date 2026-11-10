import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import AppTile from "../components/AppTile";
import { search } from "./search";

// items: [{ id, label, kind, keywords?, app?, icon?, act }]
// kind is the group shown on the right (Page, App, Skill…).
const Spotlight = ({ items, onClose }) => {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const results = search(items, q);

  const run = (it) => {
    onClose();
    it.act();
  };
  const key = (e) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const d = e.key === "ArrowDown" ? 1 : -1;
      setSel((s) => (s + d + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter" && results[sel]) run(results[sel]);
  };

  return (
    <div
      className="fixed inset-0 z-[9600] flex items-start justify-center pt-[18vh]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("desktop.spotlight.label")}
        onClick={(e) => e.stopPropagation()}
        className="w-[640px] max-w-[calc(100vw-32px)] animate-[app-open_0.15s_ease-out] overflow-hidden rounded-2xl border border-white/15 bg-[#26282e]/85 text-white shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
      >
        <div className="flex items-center gap-3 px-4">
          <i
            className="material-symbols-outlined text-[26px] text-white/60"
            aria-hidden="true"
          >
            search
          </i>
          <input
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="spotlight-results"
            aria-activedescendant={
              results[sel] ? `sp-${results[sel].id}` : undefined
            }
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            onKeyDown={key}
            placeholder={t("desktop.spotlight.placeholder")}
            spellCheck={false}
            autoComplete="off"
            className="h-14 flex-1 bg-transparent text-[22px] font-light outline-none placeholder:text-white/40"
          />
        </div>
        {q.trim() && (
          <ul
            id="spotlight-results"
            role="listbox"
            className="max-h-[50vh] overflow-auto border-t border-white/10 p-1.5"
          >
            {results.length === 0 && (
              <li className="px-3 py-3 text-[14px] text-white/50">
                {t("desktop.spotlight.none")}
              </li>
            )}
            {results.map((it, i) => (
              <li
                key={it.id}
                id={`sp-${it.id}`}
                role="option"
                aria-selected={i === sel}
                onMouseMove={() => setSel(i)}
                onClick={() => run(it)}
                className={`flex cursor-default items-center gap-3 rounded-lg px-3 py-2 ${i === sel ? "bg-[#0a84ff]" : ""}`}
              >
                {it.app ? (
                  <AppTile app={it.app} size="h-7 w-7 rounded-[7px]" />
                ) : (
                  <i
                    className="material-symbols-outlined w-7 text-center text-[22px] text-white/80"
                    aria-hidden="true"
                  >
                    {it.icon}
                  </i>
                )}
                <span className="flex-1 truncate text-[14px]">{it.label}</span>
                <span
                  className={`text-[12px] ${i === sel ? "text-white/80" : "text-white/45"}`}
                >
                  {t(`desktop.spotlight.kinds.${it.kind}`)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Spotlight;
