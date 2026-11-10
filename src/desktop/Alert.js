import React from "react";

// macOS-style alert. buttons: [{ label, act, primary? }]; the primary one
// gets focus. Clicking outside or Esc closes it.
const Alert = ({ icon, title, body, buttons, onClose }) => (
  <div
    className="fixed inset-0 z-[9000] flex items-start justify-center bg-black/20 pt-[18vh]"
    onClick={onClose}
    onKeyDown={(e) => e.key === "Escape" && onClose()}
  >
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="alert-title"
      onClick={(e) => e.stopPropagation()}
      className="flex w-[280px] animate-[app-open_0.2s_ease-out] flex-col items-center gap-3 rounded-xl border border-white/10 bg-[#2a2c33]/95 p-5 text-center text-white shadow-2xl backdrop-blur-xl"
    >
      <img src={icon} alt="" className="h-14 w-14" />
      <h2 id="alert-title" className="text-[14px] font-semibold">
        {title}
      </h2>
      <p className="text-[12px] text-white/70">{body}</p>
      <div className="flex w-full gap-2">
        {buttons.map((b) => (
          <button
            key={b.label}
            type="button"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={b.primary}
            onClick={b.act}
            className={`min-h-[28px] flex-1 rounded-md px-3 text-[13px] font-medium ${b.primary ? "bg-[#0a84ff]" : "bg-white/15"}`}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default Alert;
