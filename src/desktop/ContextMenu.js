import React, { useEffect, useRef } from "react";

// Right-click menu at { x, y }. items: [{ label, act } | "-"] ("-" = divider)
const ContextMenu = ({ x, y, items, onClose }) => {
  const ref = useRef(null);
  useEffect(() => {
    // keep it on screen, like the real one flips near the edges
    const el = ref.current;
    const r = el.getBoundingClientRect();
    if (r.right > window.innerWidth) el.style.left = `${x - r.width}px`;
    if (r.bottom > window.innerHeight) el.style.top = `${y - r.height}px`;
    el.querySelector("button")?.focus();
    const key = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [x, y, onClose]);

  return (
    <div
      className="fixed inset-0 z-[9700]"
      onClick={onClose}
      onContextMenu={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div
        ref={ref}
        role="menu"
        style={{ left: x, top: y }}
        onClick={(e) => e.stopPropagation()}
        className="fixed min-w-[220px] animate-[app-open_0.1s_ease-out] rounded-[9px] border border-white/15 bg-[#2a2c33]/90 p-1.5 text-[13px] text-white shadow-[0_18px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl"
      >
        {items.map((it, i) =>
          it === "-" ? (
            <div
              key={i}
              role="separator"
              className="mx-2 my-1 h-px bg-white/15"
            />
          ) : (
            <button
              key={it.label}
              type="button"
              role="menuitem"
              onClick={() => {
                onClose();
                it.act();
              }}
              className="flex min-h-[26px] w-full items-center rounded-[5px] px-2.5 text-left hover:bg-[#0a84ff] focus:bg-[#0a84ff] focus:outline-none"
            >
              {it.label}
            </button>
          ),
        )}
      </div>
    </div>
  );
};

export default ContextMenu;
