// macOS / Windhawk-style "genie": the window bends into a funnel and pours
// into its dock icon, content included. No WebGL: the window is cloned into
// horizontal strips and each strip gets a perspective (matrix3d) transform
// that maps it onto one slice of the funnel, so the strips join into a
// smooth warped mesh.
// ponytail: clones are static snapshots (iframes go blank) for the ~0.5s run.

const STRIPS = 24;
const DURATION = 520;

const clamp = (v) => Math.min(1, Math.max(0, v));
const smooth = (v) => v * v * (3 - 2 * v);
const lerp = (a, b, t) => a + (b - a) * t;

// matrix3d mapping the local band (0..w, y0..y1) onto quad q = [tl, tr, br, bl]
export function bandMatrix(w, y0, y1, q) {
  const [[x0, Y0], [x1, Y1], [x2, Y2], [x3, Y3]] = q;
  const dx1 = x1 - x2,
    dx2 = x3 - x2,
    dx3 = x0 - x1 + x2 - x3;
  const dy1 = Y1 - Y2,
    dy2 = Y3 - Y2,
    dy3 = Y0 - Y1 + Y2 - Y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den;
  const h = (dx1 * dy3 - dx3 * dy1) / den;
  const a = x1 - x0 + g * x1,
    b = x3 - x0 + h * x3;
  const d = Y1 - Y0 + g * Y1,
    e = Y3 - Y0 + h * Y3;
  const hb = y1 - y0;
  // unit square -> quad, composed with band -> unit square
  const m = [
    a / w,
    d / w,
    0,
    g / w,
    b / hb,
    e / hb,
    0,
    h / hb,
    0,
    0,
    1,
    0,
    x0 - (b * y0) / hb,
    Y0 - (e * y0) / hb,
    0,
    1 - (h * y0) / hb,
  ];
  return `matrix3d(${m.join(",")})`;
}

// Screen-space outline of window row s (0 top .. 1 bottom) at progress p.
function row(r, i, s, p) {
  // bottom rows set off first, the top edge follows
  const t = smooth(clamp((p - 0.35 * (1 - s)) / 0.65));
  const y = lerp(r.top + s * r.height, i.top + s * i.height, t);
  // funnel: full width at the window's top, icon width at the icon
  const bend = smooth(clamp(p / 0.3));
  const f = bend * smooth(clamp((y - r.top) / Math.max(i.top - r.top, 1)));
  return { y, l: lerp(r.left, i.left, f), r: lerp(r.right, i.right, f) };
}

// Plays the genie from p = `from` to 1 (into the icon) or 0 (out of it).
// Returns { p, cancel }. The real window stays invisible (opacity 0) while
// the strips play, and is only shown again when it ends at p = 0.
export function genie(el, iconEl, { reverse = false, from, onDone } = {}) {
  const r = el.getBoundingClientRect();
  const i = iconEl.getBoundingClientRect();
  const W = r.width,
    H = r.height;

  const layer = document.createElement("div");
  layer.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:9999";
  layer.className = "genie-layer"; // index.css: no animation or blur inside
  el.parentNode.appendChild(layer);
  const o = layer.getBoundingClientRect(); // offset if an ancestor is transformed

  const strips = Array.from({ length: STRIPS }, (_, j) => {
    const y0 = (j / STRIPS) * H;
    const y1 = ((j + 1) / STRIPS) * H;
    const wrap = document.createElement("div");
    // +1px overlap hides seams between strips
    wrap.style.cssText =
      `position:absolute;left:0;top:0;width:${W}px;height:${H}px;` +
      `transform-origin:0 0;clip-path:inset(${y0}px 0 ${Math.max(H - y1 - 1, 0)}px 0)`;
    const c = el.cloneNode(true);
    c.style.cssText += `;position:absolute;left:0;top:0;margin:0;transform:none;transition:none;width:${W}px;height:${H}px;visibility:visible;opacity:1`;
    c.querySelectorAll("iframe, embed, object").forEach((f) => {
      f.replaceWith(
        Object.assign(document.createElement("div"), {
          style: `width:${f.offsetWidth}px;height:${f.offsetHeight}px`,
        }),
      );
    });
    wrap.appendChild(c);
    layer.appendChild(wrap);
    return { wrap, y0, y1 };
  });

  const draw = (p) => {
    for (const { wrap, y0, y1 } of strips) {
      const a = row(r, i, y0 / H, p);
      const b = row(r, i, y1 / H, p);
      const by = Math.max(b.y, a.y + 0.01); // never fully flat
      wrap.style.transform = bandMatrix(W, y0, y1, [
        [a.l - o.left, a.y - o.top],
        [a.r - o.left, a.y - o.top],
        [b.r - o.left, by - o.top],
        [b.l - o.left, by - o.top],
      ]);
    }
    layer.style.opacity = p > 0.9 ? (1 - p) / 0.1 : 1;
  };

  const start0 = from ?? (reverse ? 1 : 0);
  const end = reverse ? 0 : 1;
  const ms = Math.abs(end - start0) * DURATION;
  const handle = {
    p: start0,
    cancel: () => {
      cancelAnimationFrame(raf);
      layer.remove();
    },
  };
  el.style.opacity = "0";
  draw(start0);
  let t0;
  let raf = requestAnimationFrame(function tick(now) {
    t0 ??= now;
    const k = ms ? clamp((now - t0) / ms) : 1;
    handle.p = lerp(start0, end, k);
    draw(handle.p);
    if (k < 1) return (raf = requestAnimationFrame(tick));
    layer.remove();
    if (end === 0) el.style.opacity = "";
    onDone?.();
  });
  return handle;
}

export const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
