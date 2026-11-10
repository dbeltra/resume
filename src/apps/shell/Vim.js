import React, { useRef, useState } from "react";
import { VIM_EXITS } from "./commands";

const STUCK_AFTER = 8; // wasted keystrokes before a gentle hint

// A Vim that is, faithfully, hard to leave. Covers the terminal until one of
// VIM_EXITS (or ZZ) is typed; onExit gets the seconds it took.
const Vim = ({ onExit }) => {
  const started = useRef(Date.now());
  const [mode, setMode] = useState("normal"); // normal | insert | cmd
  const [cmd, setCmd] = useState("");
  const [msg, setMsg] = useState("");
  const wasted = useRef(0);
  const lastZ = useRef(false);

  const exit = () => onExit(Math.round((Date.now() - started.current) / 1000));
  const waste = () => {
    wasted.current += 1;
    if (wasted.current >= STUCK_AFTER) setMsg("Stuck? Type :q and press Enter");
  };

  const key = (e) => {
    if (e.metaKey) return; // leave browser shortcuts alone
    e.preventDefault();
    const k = e.key;
    if (e.ctrlKey && k === "c") {
      setMode("normal"); // like Esc, then the famous hint
      setMsg(
        "Type  :qa!  and press <Enter> to abandon all changes and exit Vim",
      );
      return waste();
    }
    if (mode === "cmd") {
      if (k === "Escape") return setMode("normal");
      if (k === "Backspace") {
        if (cmd.length <= 1) return setMode("normal");
        return setCmd(cmd.slice(0, -1));
      }
      if (k === "Enter") {
        const c = cmd.trim();
        setMode("normal");
        if (VIM_EXITS.includes(c)) return exit();
        setMsg(
          c.startsWith(":help")
            ? "E149: Sorry, no help for escaping. Try :q"
            : `E492: Not an editor command: ${c.slice(1)}`,
        );
        return waste();
      }
      if (k.length === 1) setCmd(cmd + k);
      return;
    }
    if (mode === "insert") {
      if (k === "Escape") setMode("normal");
      else waste(); // typing goes nowhere, like your first Vim session
      return;
    }
    // normal mode
    if (k === ":") {
      setMode("cmd");
      setCmd(":");
      setMsg("");
      return;
    }
    if (k === "Z") {
      if (lastZ.current) return exit();
      lastZ.current = true;
      return;
    }
    lastZ.current = false;
    if (["i", "a", "o", "I", "A", "O"].includes(k)) {
      setMode("insert");
      setMsg("");
      return;
    }
    if (k.length === 1 || k === "Escape") waste();
  };

  return (
    <div
      role="application"
      aria-label="Vim"
      tabIndex={0}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
      ref={(el) => el?.focus()}
      onKeyDown={key}
      onClick={(e) => e.currentTarget.focus()}
      className="absolute inset-x-0 bottom-0 top-[30px] z-[2] flex flex-col bg-[#08090c] font-mono text-[13.5px] leading-[1.65] text-[#d7dae0] outline-none"
    >
      <div className="relative flex-1 overflow-hidden px-2 pt-1">
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} className="text-[#5f87d7]">
            ~
          </div>
        ))}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div>VIM - Vi IMproved</div>
          <div className="mb-3">version 9.1.2026</div>
          <div className="text-[#8b8f98]">Help poor developers escape Vim!</div>
          <div className="mt-3 text-[#8b8f98]">
            type <span className="text-white">:q&lt;Enter&gt;</span> to exit
          </div>
          <div className="text-[#8b8f98]">
            type <span className="text-white">:help&lt;Enter&gt;</span> for help
            (there is none)
          </div>
        </div>
      </div>
      <div
        aria-live="polite"
        className="flex h-6 flex-none items-center justify-between px-2"
      >
        <span className={msg.startsWith("E") ? "text-[#e5534b]" : ""}>
          {mode === "cmd" ? cmd : mode === "insert" ? "-- INSERT --" : msg}
          {mode === "cmd" && (
            <span className="ml-px inline-block h-4 w-2 animate-[caret_1s_steps(1)_infinite] bg-[#d7dae0] align-middle" />
          )}
        </span>
        <span className="text-[#6b7080]">0,0-1 All</span>
      </div>
    </div>
  );
};

export default Vim;
