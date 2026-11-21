import { useRef, useState } from "react";

// Desktop icons you can drag anywhere, like Finder. Positions persist per
// browser (localStorage); an icon never dragged sits in the left column.
// A press that moves less than a few pixels is still a click.
const KEY = "iconPositions";
const SLOT = 90; // column spacing for icons that were never moved
const MOVE = 4; // px before a press becomes a drag

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {}; // storage blocked or junk: default column
  }
};
const save = (pos) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(pos));
  } catch {
    // storage blocked (private mode): positions just aren't remembered
  }
};

export const defaultSpot = (i) => ({ x: 20, y: 52 + i * SLOT });

// onDrop(id, x, y) runs when a drag ends, with the pointer's screen point
// (the Trash uses it); returning true leaves the icon where it started.
export function useIconDrag({ onHover, onDrop } = {}) {
  const [pos, setPos] = useState(load);
  const drag = useRef(null);

  const spot = (id, i) => pos[id] || defaultSpot(i);

  const bind = (id, i, act) => ({
    onPointerDown: (e) => {
      if (e.button !== 0) return;
      const start = spot(id, i);
      drag.current = { id, sx: e.clientX, sy: e.clientY, start, moved: false };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    onPointerMove: (e) => {
      const d = drag.current;
      if (!d || d.id !== id) return;
      const dx = e.clientX - d.sx;
      const dy = e.clientY - d.sy;
      if (!d.moved && Math.hypot(dx, dy) < MOVE) return;
      d.moved = true;
      const el = e.currentTarget;
      // keep it on screen and below the menu bar
      const x = Math.max(
        0,
        Math.min(window.innerWidth - el.offsetWidth, d.start.x + dx),
      );
      const y = Math.max(
        32,
        Math.min(window.innerHeight - el.offsetHeight, d.start.y + dy),
      );
      setPos((p) => ({ ...p, [id]: { x, y } }));
      onHover?.(id, e.clientX, e.clientY);
    },
    onPointerUp: (e) => {
      const d = drag.current;
      drag.current = null;
      if (!d || d.id !== id) return;
      if (!d.moved) return act();
      if (onDrop?.(id, e.clientX, e.clientY))
        setPos((p) => ({ ...p, [id]: d.start })); // e.g. dropped on the Trash
      else setPos((p) => (save(p), p));
    },
    onPointerCancel: () => (drag.current = null),
    // keyboard: Enter/Space still open it (pointer clicks go through pointerup)
    onClick: (e) => e.detail === 0 && act(),
  });

  // "Clean Up": every icon back to the column
  const reset = () => {
    setPos({});
    save({});
  };

  return { spot, bind, reset };
}
