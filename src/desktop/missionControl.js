// Mission Control: tile the open windows into a grid. Pure, so it's testable.
// rects: [{ id, left, top, width, height }] in screen px. Returns
// { [id]: { dx, dy, s } }: translate the window by dx/dy, then scale by s.
export function tile(rects, vw, vh, { top = 60, bottom = 110, pad = 32 } = {}) {
  const n = rects.length;
  if (!n) return {};
  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);
  const cw = (vw - pad * 2) / cols;
  const ch = (vh - top - bottom) / rows;
  return Object.fromEntries(
    rects.map((r, k) => {
      const col = k % cols;
      const row = Math.floor(k / cols);
      // last row centred when it isn't full
      const inRow = row === rows - 1 ? n - row * cols : cols;
      const x0 = pad + ((cols - inRow) * cw) / 2;
      const cx = x0 + cw * (col + 0.5);
      const cy = top + ch * (row + 0.5);
      const s = Math.min((cw * 0.85) / r.width, (ch * 0.85) / r.height, 1);
      return [
        r.id,
        {
          dx: cx - (r.left + r.width / 2),
          dy: cy - (r.top + r.height / 2),
          s,
        },
      ];
    }),
  );
}
