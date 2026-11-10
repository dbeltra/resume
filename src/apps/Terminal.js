import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Window from "../components/Window";
import { RUNS } from "../data";
import { parse, gitLog, NPM_STEPS, RM_LINES } from "./shell/commands";
import Vim from "./shell/Vim";

const STEP_MS = 650;
const DOT = { Plan: "#e0a46e" };

// Scripted agent replay: tool steps appear on a timer, then the answer.
// Nothing is sent anywhere: no API calls, no tokens.
// Counts 0..count one step per `ms`, then calls onEnd once.
const useTicker = (count, ms, onEnd) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= count) return void onEnd?.();
    const id = setTimeout(() => setN(n + 1), ms);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);
  return n;
};

const Npm = () => {
  const n = useTicker(NPM_STEPS.length, 420);
  const bar = Math.round((n / NPM_STEPS.length) * 24);
  return (
    <>
      {NPM_STEPS.slice(0, n).map((l) => (
        <div key={l} className="text-[#8b8f98]">
          <span className="text-mint">✓</span> {l}
        </div>
      ))}
      <div className="text-[#8b8f98]">
        [{"█".repeat(bar)}
        {"░".repeat(24 - bar)}] {Math.round((n / NPM_STEPS.length) * 100)}%
      </div>
      {n >= NPM_STEPS.length && (
        <div className="text-white">
          added 1 developer in {new Date().getFullYear() - 2014}y,{" "}
          <span className="text-mint">0 vulnerabilities</span>
          <br />1 package is looking for funding: run `sudo hire-me`
        </div>
      )}
    </>
  );
};

const Rm = ({ onCrash }) => {
  const n = useTicker(RM_LINES.length, 260, () => setTimeout(onCrash, 400));
  return RM_LINES.slice(0, n).map((l) => (
    <div key={l} className="text-[#e5534b]">
      {l}
    </div>
  ));
};

const Git = () =>
  gitLog().map((c) => (
    <div key={c.hash}>
      <span className="text-honey">* {c.hash}</span>
      {c.head && <span className="text-peri"> (HEAD -&gt; main)</span>}{" "}
      <span className="text-white">{c.msg}</span>{" "}
      <span className="text-[#6b7080]">{c.meta}</span>
    </div>
  ));

const Terminal = ({ win, onHire, onCrash }) => {
  const { t } = useTranslation();
  const [run, setRun] = useState("whoami");
  const [step, setStep] = useState(0);
  const [replays, setReplays] = useState(0); // clicking the same prompt replays it
  const timer = useRef(null);
  const input = useRef(null);
  const [cmd, setCmd] = useState("");
  const [shell, setShell] = useState([]); // typed commands and their output
  const [askPw, setAskPw] = useState(false); // sudo is waiting for a password
  const [vim, setVim] = useState(false);
  const leaveVim = (secs) => {
    setVim(false);
    setShell((s) => [
      ...s,
      {
        id: Date.now(),
        kind: "text",
        lines: [
          `🏆 You escaped Vim in ${secs}s. Plenty of developers never have.`,
        ],
      },
    ]);
    setTimeout(() => input.current?.focus());
  };

  const submit = (e) => {
    e.preventDefault();
    const id = Date.now();
    if (askPw) {
      setAskPw(false);
      setShell((s) => [...s, { id, kind: "granted" }]);
      setTimeout(onHire, 900);
    } else {
      const out = parse(cmd);
      if (out?.kind === "clear") setShell([]);
      else if (out) setShell((s) => [...s, { id, cmd: cmd.trim(), ...out }]);
      if (out?.kind === "sudo") setAskPw(true);
      if (out?.kind === "vim") setVim(true);
    }
    setCmd("");
  };

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

          {shell.map((o) => (
            <div key={o.id} className="mt-2">
              {o.cmd && (
                <div>
                  <span className="text-mint">david@resume</span>{" "}
                  <span className="text-peri">~</span> % {o.cmd}
                </div>
              )}
              {o.kind === "text" &&
                o.lines.map((l) => (
                  <div key={l} className="text-[#8b8f98]">
                    {l}
                  </div>
                ))}
              {o.kind === "sudo" && (
                <div className="text-[#8b8f98]">
                  [sudo] password for recruiter:
                </div>
              )}
              {o.kind === "granted" && (
                <div className="text-mint">
                  ✓ Permission granted. Opening Mail…
                </div>
              )}
              {o.kind === "git" && <Git />}
              {o.kind === "npm" && <Npm />}
              {o.kind === "rm" && <Rm onCrash={onCrash} />}
            </div>
          ))}

          <form
            onSubmit={submit}
            onClick={() => input.current?.focus()}
            className="mt-3.5 flex items-center gap-2 rounded-md border border-[#3a3d45] px-3 py-2 focus-within:border-[#5a5d65]"
          >
            <span className="text-[#8b8f98]">{askPw ? "🔑" : ">"}</span>
            <input
              ref={input}
              type={askPw ? "password" : "text"}
              value={cmd}
              onChange={(e) => setCmd(e.target.value)}
              aria-label={t("desktop.terminal.input")}
              placeholder={askPw ? "" : t("desktop.terminal.placeholder")}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent text-[#d7dae0] caret-[#d7dae0] outline-none placeholder:text-[#4b4f5a]"
            />
          </form>
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
      {vim && <Vim onExit={leaveVim} />}
    </Window>
  );
};

export default Terminal;
