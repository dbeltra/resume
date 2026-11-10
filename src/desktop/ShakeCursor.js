import React, { useEffect, useRef } from "react";

// macOS "shake to locate": wiggle the mouse fast and the pointer grows.
// Detection: 4+ horizontal direction changes within 500ms while moving fast.
// The big arrow is moved straight on the DOM, no React render per mousemove.
const ShakeCursor = () => {
  const big = useRef(null);
  useEffect(() => {
    let lastX = 0,
      dir = 0,
      flips = [],
      timer;
    const move = (e) => {
      const el = big.current;
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      if (Math.abs(dx) < 12) return; // only fast strokes count
      const d = Math.sign(dx);
      const now = performance.now();
      if (d !== dir) {
        dir = d;
        flips = flips.filter((t) => now - t < 500).concat(now);
      }
      if (flips.length >= 4) {
        el.dataset.on = "1";
        document.documentElement.style.cursor = "none";
        clearTimeout(timer);
        timer = setTimeout(() => {
          el.dataset.on = "";
          document.documentElement.style.cursor = "";
          flips = [];
        }, 700);
      }
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      clearTimeout(timer);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    <svg
      ref={big}
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="pointer-events-none fixed z-[10001] h-6 w-6 origin-top-left scale-0 opacity-0 transition-[transform,opacity] duration-200 ease-out data-[on='1']:scale-[5] data-[on='1']:opacity-100"
    >
      <path
        d="M3 2 L3 19 L7.5 14.8 L10.5 21.5 L13.4 20.2 L10.5 13.6 L16.5 13.6 Z"
        fill="#000"
        stroke="#fff"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ShakeCursor;
