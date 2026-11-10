// macOS-style "genie" minimize, approximated with the Web Animations API.
// The window outline (clip-path) funnels into the dock icon, bottom rows first,
// while the whole window slides down and squashes to the icon's height.
// ponytail: only the outline warps; the content inside is clipped, not bent.
// A true mesh warp needs WebGL; not worth it for a resume.

const ROWS = 14; // points per side of the funnel
const FRAMES = 20;

const clamp = (v) => Math.min(1, Math.max(0, v));
const smooth = (v) => v * v * (3 - 2 * v);
const lerp = (a, b, t) => a + (b - a) * t;

export function genieFrames(el, iconEl) {
  const r = el.getBoundingClientRect();
  const i = iconEl.getBoundingClientRect();
  const W = r.width;
  const H = r.height;
  const iconL = i.left - r.left;
  const iconR = i.right - r.left;
  const dy = i.top - r.top;
  const sy = i.height / H;
  const base =
    el.style.transform && el.style.transform !== "none"
      ? el.style.transform
      : "";

  return Array.from({ length: FRAMES + 1 }, (_, n) => {
    const p = n / FRAMES;
    // a margin at the start keeps the window shadow visible before the warp kicks in
    const m = 60 * (1 - clamp(p / 0.15));
    // horizontal squeeze: lower rows reach the icon width first
    const k = (s) => smooth(clamp(p * 1.5 - (1 - s) * 0.5));
    // vertical slide/squash lags behind the squeeze
    const v = smooth(clamp((p - 0.2) / 0.8));

    const left = [];
    const right = [];
    for (let j = 0; j <= ROWS; j++) {
      const s = j / ROWS;
      const y = lerp(-m, H + m, s);
      left.push(`${lerp(-m, iconL, k(s))}px ${y}px`);
      right.unshift(`${lerp(W + m, iconR, k(s))}px ${y}px`);
    }
    return {
      offset: p,
      transform: `${base} translateY(${dy * v}px) scaleY(${lerp(1, sy, v)})`,
      clipPath: `polygon(${left.concat(right).join(",")})`,
      opacity: p > 0.85 ? 1 - (p - 0.85) / 0.15 : 1,
    };
  });
}

export const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
