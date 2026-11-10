import React from "react";

// rm -rf / -> "panic" (kernel panic screen) -> "boot" (logo + progress bar).
// Desktop drives the phases and resets itself when the boot finishes.
const Crash = ({ phase }) => (
  <div
    role="alert"
    className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black p-8 font-mono text-[13px] text-[#d7dae0]"
  >
    {phase === "panic" ? (
      <pre className="max-w-2xl whitespace-pre-wrap">
        {`panic(cpu 0 caller 0xffffff8012a4b2c1): "rm -rf /" issued by recruiter
Kernel version: DavidOS 12.0.0 (coffee-powered)
Backtrace:
  0xffffff80 recruiter_curiosity + 0x2a
  0xffffff81 rm_rf_root + 0x1337
  0xffffff82 nothing_was_actually_deleted + 0x0

Don't worry, this is a resume. Rebooting…`}
      </pre>
    ) : (
      <>
        <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-full border-2 border-white font-sans text-3xl font-bold text-white">
          DB
        </div>
        <div className="h-1.5 w-48 overflow-hidden rounded-full bg-white/20">
          <div className="h-full animate-[loadbar_2.2s_ease-in-out_forwards] bg-white" />
        </div>
      </>
    )}
  </div>
);

export default Crash;
