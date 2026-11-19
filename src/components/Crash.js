import React from "react";
import DIcon from "../assets/icons/icon-d.svg"; // the menu bar's D, crisp at boot size

// rm -rf / -> "panic" (kernel panic screen) -> "boot" (logo + progress bar).
// Shut Down -> "off" (click to wake) -> "boot".
// Desktop drives the phases and resets itself when the boot finishes.
const Crash = ({ phase, offText, onWake }) => (
  <div
    role="alert"
    className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black p-8 font-mono text-[13px] text-[#d7dae0]"
  >
    {phase === "off" ? (
      <button
        type="button"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        onClick={onWake}
        className="absolute inset-0 cursor-default text-[#6b7080] outline-none"
      >
        <span className="animate-[caret_2s_steps(1)_infinite]">{offText}</span>
      </button>
    ) : phase === "panic" ? (
      <pre className="max-w-2xl whitespace-pre-wrap">
        {`panic(cpu 0 caller 0xffffff8012a4b2c1): "rm -rf /" issued by guest
Kernel version: DavidOS 12.0.0 (coffee-powered)
Backtrace:
  0xffffff80 guest_curiosity + 0x2a
  0xffffff81 rm_rf_root + 0x1337
  0xffffff82 nothing_was_actually_deleted + 0x0

Don't worry, this is a resume. Rebooting…`}
      </pre>
    ) : (
      <>
        <img src={DIcon} alt="" className="mb-10 h-20 w-20" />
        <div className="h-1.5 w-48 overflow-hidden rounded-full bg-white/20">
          <div className="h-full animate-[loadbar_2.2s_ease-in-out_forwards] bg-white" />
        </div>
      </>
    )}
  </div>
);

export default Crash;
