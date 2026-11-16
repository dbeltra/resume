import React, { useRef, useState } from "react";
import useTicker from "../hooks/useTicker";
import { useTranslation } from "react-i18next";
import Window from "../components/Window";
import { RUNS } from "../data";
import {
  parse,
  ask,
  isExit,
  gitLog,
  NPM_STEPS,
  RM_LINES,
} from "./shell/commands";
import Vim from "./shell/Vim";
import Clawd from "./claude/ClawdCanvas";
import { animate, hello, sceneFor } from "./claude/clawd";

const STEP_MS = 650;
const DOT = { Plan: "#e0a46e" };

// Scripted agent replay: tool steps appear on a timer, then the answer.
// Nothing is sent anywhere: no API calls, no tokens.
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

// one scripted Claude answer: tool calls tick in, then the answer
const Run = ({ run, q }) => {
  const { t } = useTranslation();
  const steps = RUNS[run];
  const n = useTicker(steps.length, STEP_MS);
  const now = useRef(0); // read by Clawd's loop each frame
  now.current = n;
  const copy = t(`desktop.terminal.runs.${run}`, { returnObjects: true });
  return (
    <>
      <div className="text-white">&gt; {q || copy.label}</div>
      {steps.slice(0, n).map((s) => (
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
      {n < steps.length ? (
        <div className="mt-2 flex items-end gap-2 text-honey">
          {/* the Claude app's working Clawd, acting out the running tool */}
          <Clawd
            className="h-[34px] w-12"
            draw={(c) =>
              animate(
                c,
                Date.now() - 4000,
                () => sceneFor(steps[now.current]?.tool) || "think",
              )
            }
          />
          {t("desktop.terminal.thinking")}
        </div>
      ) : (
        <div className="mt-2.5">
          <span className="text-white">⏺</span>
          {copy.answer.map((line, i) => (
            <div
              key={i}
              className={`whitespace-pre-wrap pl-[18px] ${line.startsWith("-") ? "text-ink-soft" : "text-white"}`}
            >
              {line || " "}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

const Prompt = ({ children }) => (
  <div>
    <span className="text-mint">david@resume</span>{" "}
    <span className="text-peri">~</span> % {children}
  </div>
);

// A plain zsh; `claude` starts a fake agent session in the same scrollback,
// `/exit` or Esc drops back to zsh.
const Terminal = ({ win, onHire, onCrash }) => {
  const { t } = useTranslation();
  const input = useRef(null);
  const [cmd, setCmd] = useState("");
  const [log, setLog] = useState([]); // everything printed, oldest first
  const [claude, setClaude] = useState(false);
  const [askPw, setAskPw] = useState(false); // sudo is waiting for a password
  const [vim, setVim] = useState(false);
  const print = (...entries) =>
    setLog((l) => [
      ...l,
      ...entries.map((e, i) => ({ id: `${Date.now()}-${i}`, ...e })),
    ]);
  const focus = () => setTimeout(() => input.current?.focus());

  const enterClaude = (typed) => {
    setClaude(true);
    print({ cmd: typed, kind: "banner" });
    focus();
  };
  const exitClaude = (typed) => {
    setClaude(false);
    print({ q: typed, kind: "text", lines: ["Bye!"] });
    focus();
  };

  const leaveVim = (secs) => {
    setVim(false);
    print({
      kind: "text",
      lines: [
        `🏆 You escaped Vim in ${secs}s. Plenty of developers never have.`,
      ],
    });
    focus();
  };

  const submit = (e) => {
    e.preventDefault();
    const typed = cmd.trim();
    setCmd("");
    if (askPw) {
      setAskPw(false);
      print({ kind: "granted" });
      setTimeout(onHire, 900);
    } else if (claude) {
      if (!typed) return;
      if (isExit(typed)) return exitClaude(typed);
      const run = ask(typed);
      if (run) print({ kind: "run", run, q: typed });
      else print({ q: typed, kind: "fallback" });
    } else {
      const out = parse(cmd);
      if (out?.kind === "clear") return setLog([]);
      if (out?.kind === "claude") return enterClaude(typed);
      if (out) print({ cmd: typed, ...out });
      if (out?.kind === "sudo") setAskPw(true);
      if (out?.kind === "vim") setVim(true);
    }
  };

  const chip = (id) => t(`desktop.terminal.runs.${id}.label`);

  return (
    <Window
      {...win}
      label={t("desktop.apps.term")}
      title={`david — ${claude ? "claude" : "zsh"} — 80×24`}
      rect={{ w: 780, h: 500 }}
      className="border border-[#2a2d33] bg-[#08090c]/95 font-mono"
      barClassName="h-[30px] bg-[#1c1d21]"
    >
      <div
        // a click anywhere types into the prompt, unless it selected text
        onMouseUp={() =>
          window.getSelection()?.isCollapsed && input.current?.focus()
        }
        className="flex min-h-0 flex-1 cursor-text flex-col-reverse overflow-auto px-[18px] py-3.5 text-[13.5px] leading-[1.65] text-[#d7dae0]"
      >
        <div aria-live="polite">
          <div className="text-[#6b7080]">{t("desktop.terminal.login")}</div>

          {log.map((o) => (
            <div key={o.id} className="mt-2">
              {o.cmd !== undefined && <Prompt>{o.cmd}</Prompt>}
              {o.q && o.kind !== "run" && (
                <div className="text-white">&gt; {o.q}</div>
              )}
              {o.kind === "banner" && (
                // Claude Code's welcome box, with Clawd waving in it
                <div className="my-1 flex max-w-[460px] items-center gap-4 rounded-lg border border-[#d77757] px-4 py-3">
                  <Clawd draw={hello} className="h-[42px] w-[66px] flex-none" />
                  <div className="min-w-0 leading-[1.5]">
                    <div>
                      <b className="text-white">Claude Code</b>{" "}
                      <span className="text-[#6b7080]">v1.0</span>
                    </div>
                    <div className="text-[#8b8f98]">David 1.0 · ~/resume</div>
                    <div className="text-[#6b7080]">/exit to leave</div>
                  </div>
                </div>
              )}
              {o.kind === "run" && <Run run={o.run} q={o.q} />}
              {o.kind === "fallback" && (
                <div className="mt-2 pl-[18px] text-white">
                  {t("desktop.terminal.fallback")}
                  {Object.keys(RUNS).map((id) => (
                    <div key={id} className="text-ink-soft">
                      - {chip(id)}
                    </div>
                  ))}
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

          {claude ? (
            <>
              <form
                onSubmit={submit}
                onClick={() => input.current?.focus()}
                className="mt-3.5 flex items-center gap-2 rounded-md border border-[#3a3d45] px-3 py-2 focus-within:border-[#5a5d65]"
              >
                <span className="text-[#8b8f98]">&gt;</span>
                <input
                  ref={input}
                  autoFocus={!win.phone}
                  value={cmd}
                  onChange={(e) => setCmd(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && exitClaude("/exit")}
                  aria-label={t("desktop.terminal.input")}
                  placeholder={t("desktop.terminal.ask")}
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
                    onClick={() => print({ kind: "run", run: id })}
                    className="min-h-[32px] rounded-md border border-[#3a3d45] px-2.5 py-1.5 text-[12.5px] text-[#a9adb6] hover:text-white"
                  >
                    › {chip(id)}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <form
              onSubmit={submit}
              onClick={() => input.current?.focus()}
              className="mt-2 flex items-center"
            >
              {askPw ? (
                <span className="mr-2 text-[#8b8f98]">🔑</span>
              ) : (
                <span className="mr-2 whitespace-nowrap">
                  <span className="text-mint">david@resume</span>{" "}
                  <span className="text-peri">~</span> %
                </span>
              )}
              <input
                ref={input}
                autoFocus={!win.phone}
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
          )}
        </div>
      </div>
      {vim && <Vim onExit={leaveVim} />}
    </Window>
  );
};

export default Terminal;
