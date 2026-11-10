import { tile } from "./missionControl";

test("tiles windows into non-overlapping cells that fit the screen", () => {
  const rects = ["a", "b", "c"].map((id) => ({
    id,
    left: 300,
    top: 200,
    width: 800,
    height: 500,
  }));
  const out = tile(rects, 1440, 900);
  const boxes = rects.map((r) => {
    const { dx, dy, s } = out[r.id];
    const cx = r.left + r.width / 2 + dx;
    const cy = r.top + r.height / 2 + dy;
    return {
      l: cx - (r.width * s) / 2,
      r: cx + (r.width * s) / 2,
      t: cy - (r.height * s) / 2,
      b: cy + (r.height * s) / 2,
    };
  });
  boxes.forEach((b) => {
    expect(b.l).toBeGreaterThanOrEqual(0);
    expect(b.r).toBeLessThanOrEqual(1440);
    expect(b.t).toBeGreaterThanOrEqual(60);
    expect(b.b).toBeLessThanOrEqual(900 - 110);
  });
  for (let i = 0; i < boxes.length; i++)
    for (let j = i + 1; j < boxes.length; j++) {
      const [p, q] = [boxes[i], boxes[j]];
      expect(p.r <= q.l || q.r <= p.l || p.b <= q.t || q.b <= p.t).toBe(true);
    }
});

test("never scales a window up", () => {
  const out = tile(
    [{ id: "a", left: 0, top: 0, width: 100, height: 80 }],
    1440,
    900,
  );
  expect(out.a.s).toBe(1);
});
