// A burst of confetti from the top of the screen. Plain DOM + CSS keyframes
// (`confetti` in index.css); every piece removes itself when it lands.
import { prefersReducedMotion } from "./genie";

const COLORS = ["#a772a7", "#7094db", "#e0a46e", "#6fbf8a", "#e5534b", "#fff"];

export function confetti(count = 120) {
  if (prefersReducedMotion()) return;
  for (let n = 0; n < count; n++) {
    const p = document.createElement("i");
    const size = 6 + Math.random() * 6;
    p.style.cssText =
      `position:fixed;top:-20px;left:${Math.random() * 100}vw;z-index:10000;` +
      `width:${size}px;height:${size * 0.45}px;pointer-events:none;` +
      `background:${COLORS[n % COLORS.length]};border-radius:2px;` +
      `--drift:${(Math.random() - 0.5) * 300}px;--spin:${(Math.random() - 0.5) * 1440}deg;` +
      `animation:confetti ${1.8 + Math.random() * 1.6}s ${Math.random() * 0.4}s cubic-bezier(0.2,0.6,0.4,1) forwards`;
    p.addEventListener("animationend", () => p.remove());
    document.body.appendChild(p);
  }
}
