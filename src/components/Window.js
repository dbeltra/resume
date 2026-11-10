import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { genie as playGenie, prefersReducedMotion } from "./genie";
import { useTranslation } from "react-i18next";

const MENU_BAR = 32;
const DOCK_SPACE = 100; // keep maximized windows clear of the dock

// Shared window chrome. Each app brings its own colours and toolbar.
// Default size and position are centred on the viewport and clamped to fit,
// so the desktop works on any laptop. Dragging adds an offset on top of that.
const Window = ({
  label,
  title,
  toolbar,
  z,
  minimized,
  dockId, // which dock icon to minimize into / open out of
  animateOpen = false, // genie out of the dock icon when it first appears
  overview = null, // Mission Control: { dx, dy, s, onPick }
  onFocus,
  onClose,
  onMinimize,
  rect,
  cascade = 0,
  phone = false, // full-screen sheet with a "‹ Home" bar instead of a window
  phoneToolbar = null, // controls to keep in the phone header (e.g. Mail's Send)
  className = "",
  barClassName = "",
  children,
}) => {
  const { t } = useTranslation();
  const { w, h } = rect;
  const step = cascade * 28; // macOS-style cascade, down and to the right
  const W = `min(${w}px, 100vw - 150px)`;
  const H = `min(${h}px, 100vh - 150px)`;
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [maximized, setMaximized] = useState(false);
  const [dragging, setDragging] = useState(false);
  const drag = useRef(null);
  const self = useRef(null);
  const genie = useRef(null);
  const [gone, setGone] = useState(false); // hidden after the minimize animation

  // open: the minimize warp played backwards, out of the dock icon.
  // Layout effect so the first painted frame is already at the icon.
  useLayoutEffect(() => {
    const el = self.current;
    const icon = document.querySelector(`[data-dock="${dockId}"] img`);
    if (phone || !animateOpen || !el || !icon || prefersReducedMotion()) return;
    genie.current = playGenie(el, icon, {
      reverse: true,
      onDone: () => (genie.current = null),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wasMinimized = useRef(minimized);
  useEffect(() => {
    if (wasMinimized.current === minimized) return; // mount / dock change
    wasMinimized.current = minimized;
    const el = self.current;
    const icon = document.querySelector(`[data-dock="${dockId}"] img`);
    const from = genie.current?.p; // pick up mid-flight if interrupted
    genie.current?.cancel();
    genie.current = null;
    if (minimized) {
      if (!el || !icon || prefersReducedMotion()) return setGone(true);
      genie.current = playGenie(el, icon, {
        from,
        onDone: () => setGone(true),
      });
    } else {
      setGone(false);
      if (!el) return;
      if (!icon || prefersReducedMotion()) return (el.style.opacity = "");
      // restore: same warp backwards, out of the icon
      genie.current = playGenie(el, icon, {
        reverse: true,
        from,
        onDone: () => (genie.current = null),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minimized, dockId]);

  const onPointerDown = (e) => {
    // drag from the title bar, not from its buttons or tab strip controls
    if (maximized || e.button !== 0 || e.target.closest("button, a, input"))
      return;
    const r = self.current.getBoundingClientRect();
    drag.current = {
      sx: e.clientX,
      sy: e.clientY,
      ox: offset.x,
      oy: offset.y,
      r,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    let mx = e.clientX - d.sx;
    let my = e.clientY - d.sy;
    // keep the title bar below the menu bar and at least 120px on screen
    my = Math.max(my, MENU_BAR - d.r.top);
    my = Math.min(my, window.innerHeight - 40 - d.r.top);
    mx = Math.max(mx, 120 - d.r.right);
    mx = Math.min(mx, window.innerWidth - 120 - d.r.left);
    setOffset({ x: d.ox + mx, y: d.oy + my });
  };
  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  if (phone) {
    return (
      // solid backing: some apps are translucent on the desktop (Terminal),
      // but a full-screen phone app must not show the home screen through
      <div
        style={{ zIndex: z }}
        className={`fixed inset-0 bg-ink-950 ${minimized ? "hidden" : "animate-[app-open_0.28s_ease-out]"}`}
      >
        <section
          aria-label={label}
          className={`flex h-full flex-col ${className}`}
        >
          <div
            // inline style wins over the app's desktop bar height/alignment
            style={{ height: 48, alignItems: "center" }}
            className={`relative flex flex-none gap-2 px-2 pt-[env(safe-area-inset-top)] text-white ${barClassName}`}
          >
            <button
              type="button"
              onClick={onMinimize}
              className="z-[1] flex h-10 items-center pr-2 text-[16px] text-[#0a84ff]"
            >
              <i
                className="material-symbols-outlined text-[26px]"
                aria-hidden="true"
              >
                chevron_left
              </i>
              {t("desktop.phone.home")}
            </button>
            <span className="pointer-events-none absolute inset-x-0 text-center text-[15px] font-semibold">
              {label}
            </span>
            {phoneToolbar && (
              <div className="z-[1] ml-auto flex items-center gap-2">
                {phoneToolbar}
              </div>
            )}
          </div>
          {children}
          {/* home indicator */}
          <button
            type="button"
            aria-label={t("desktop.phone.home")}
            onClick={onMinimize}
            className="flex h-7 flex-none items-center justify-center pb-[env(safe-area-inset-bottom)]"
          >
            <span className="h-[5px] w-32 rounded-full bg-white/70 mix-blend-difference" />
          </button>
        </section>
      </div>
    );
  }

  const frame = maximized
    ? {
        left: 0,
        top: MENU_BAR,
        width: "100vw",
        height: `calc(100vh - ${MENU_BAR + DOCK_SPACE}px)`,
        transform: "none",
      }
    : {
        // centred in the space between the menu bar and the dock, clamped
        // clear of the desktop icons (left), menu bar (top) and dock (bottom)
        width: W,
        height: H,
        // clamp(min, wanted, max): the cascade never pushes a window under
        // the dock or past the right edge
        left: `clamp(128px, calc(50% - ${W} / 2 + ${step}px), calc(100vw - 16px - ${W}))`,
        top: `clamp(44px, calc(50% - ${H} / 2 - ${(DOCK_SPACE - MENU_BAR) / 2}px + ${step}px), calc(100vh - ${DOCK_SPACE}px - ${H}))`,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
      };

  if (overview)
    frame.transform = `translate(${overview.dx}px, ${overview.dy}px) ${frame.transform} scale(${overview.s})`;

  const light = "h-3 w-3 rounded-full hover:brightness-110";

  return (
    <section
      ref={self}
      data-win={dockId}
      aria-label={label}
      aria-hidden={minimized || undefined}
      onMouseDown={onFocus}
      onFocusCapture={onFocus}
      style={{
        zIndex: z,
        ...frame,
        ...(minimized && { pointerEvents: "none" }),
        // hidden (and out of the tab order) once the genie animation ends
        ...(gone && { visibility: "hidden" }),
        ...(overview && { zIndex: 9500 }),
      }}
      className={`absolute flex flex-col overflow-hidden shadow-[0_30px_80px_rgba(20,10,40,0.45)] ${maximized ? "rounded-none" : "rounded-xl"} ${dragging ? "" : "transition-[left,top,width,height,transform] duration-300 ease-out"} ${className}`}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={(e) =>
          !e.target.closest("button, a, input") && setMaximized((m) => !m)
        }
        className={`relative flex flex-none touch-none select-none items-center gap-3 px-3 ${maximized ? "" : "cursor-grab"} ${dragging ? "cursor-grabbing" : ""} ${barClassName}`}
      >
        <span className="z-[1] flex gap-[7px] self-center">
          <button
            type="button"
            aria-label={t("desktop.window.close", { name: label })}
            onClick={onClose}
            className={`${light} bg-[#e5534b]`}
          />
          <button
            type="button"
            aria-label={t("desktop.window.minimize", { name: label })}
            onClick={onMinimize}
            className={`${light} bg-[#d4a72c]`}
          />
          <button
            type="button"
            aria-label={t(
              maximized ? "desktop.window.restore" : "desktop.window.maximize",
              {
                name: label,
              },
            )}
            onClick={() => setMaximized((m) => !m)}
            className={`${light} bg-[#57ab5a]`}
          />
        </span>
        {title && (
          <span className="pointer-events-none absolute inset-x-0 text-center font-mono text-xs text-ink-muted">
            {title}
          </span>
        )}
        {toolbar}
      </div>
      {children}
      {overview && (
        <button
          type="button"
          aria-label={label}
          onClick={overview.onPick}
          className="absolute inset-0 z-10 rounded-[inherit] ring-white/80 hover:ring-[6px]"
        />
      )}
    </section>
  );
};

export default Window;
