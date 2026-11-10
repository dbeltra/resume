import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Window from "../components/Window";
import { RUNS } from "../data";

const STEP_MS = 650;
const DOT = { Plan: "#e0a46e" };

// Scripted agent replay: tool steps appear on a timer, then the answer.
// Nothing is sent anywhere: no API calls, no tokens.
const Terminal = ({ win }) => {
  const { t } = useTranslation();
  const [run, setRun] = useState("whoami");
  const [step, setStep] = useState(0);
  const [replays, setReplays] = useState(0); // clicking the same prompt replays it
  const timer = useRef(null);

  useEffect(() => {
    setStep(0);
    timer.current = setInterval(() => {
      setStep((n) => {
        if (n >= RUNS[run].length) {
          clearInterval(timer.current);
          return n;
        }
        return n + 1;
      });
    }, STEP_MS);
    return () => clearInterval(timer.current);
  }, [run, replays]);

  const steps = RUNS[run];
  const done = step >= steps.length;
  const copy = (id) =>
    t(`desktop.terminal.runs.${id}`, { returnObjects: true });

  return (
    <Window
      {...win}
      label={t("desktop.apps.term")}
      title="david — claude — 80×24"
      rect={{ w: 780, h: 500 }}
      className="border border-[#2a2d33] bg-[#08090c]/95 font-mono"
      barClassName="h-[30px] bg-[#1c1d21]"
    >
      {/* column-reverse keeps the view pinned to the newest line */}
      <div className="flex min-h-0 flex-1 flex-col-reverse overflow-auto px-[18px] py-3.5 text-[13.5px] leading-[1.65] text-[#d7dae0]">
        <div aria-live="polite">
          <div className="text-[#6b7080]">{t("desktop.terminal.login")}</div>
          <div>
            <span className="text-mint">david@resume</span>{" "}
            <span className="text-peri">~</span> % claude --replay
          </div>
          <div className="my-3 inline-block rounded-lg border border-lilac px-3.5 py-2.5">
            <span className="text-honey">✻</span> <b>Claude Code</b>
          </div>

          <div className="mt-1 text-white">&gt; {copy(run).label}</div>
          {steps.slice(0, step).map((s) => (
            <div key={s.tool + s.arg} className="mt-2">
              <div>
                <span style={{ color: DOT[s.tool] || "#6fbf8a" }}>⏺</span>{" "}
                <b>{s.tool}</b>(<span className="text-ink-soft">{s.arg}</span>)
              </div>
              <div className="whitespace-pre text-[#8b8f98]">
                {"  ⎿  "}
                {s.result}
              </div>
            </div>
          ))}
          {!done && (
            <div className="mt-2 text-honey">
              ✻ {t("desktop.terminal.thinking")}
            </div>
          )}
          {done && (
            <div className="mt-2.5">
              <span className="text-white">⏺</span>
              {copy(run).answer.map((line, i) => (
                <div
                  key={i}
                  className={`whitespace-pre-wrap pl-[18px] ${line.startsWith("-") ? "text-ink-soft" : "text-white"}`}
                >
                  {line || " "}
                </div>
              ))}
            </div>
          )}

          <div className="mt-3.5 flex items-center gap-1 rounded-md border border-[#3a3d45] px-3 py-2">
            <span className="text-[#8b8f98]">&gt;</span>
            <span
              aria-hidden="true"
              className="h-4 w-2 animate-[caret_1s_steps(1)_infinite] bg-[#d7dae0]"
            />
          </div>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {Object.keys(RUNS).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setRun(id);
                  setReplays((n) => n + 1);
                }}
                aria-pressed={id === run}
                className={`min-h-[32px] rounded-md border border-[#3a3d45] px-2.5 py-1.5 text-[12.5px] ${id === run ? "bg-[#2a2d36] text-white" : "text-[#a9adb6] hover:text-white"}`}
              >
                › {copy(id).label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Window>
  );
};

export default Terminal;
