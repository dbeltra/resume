/* eslint-disable */
// ponytail: copied verbatim from sprint-dashboard/dashboard/public/js/clawd.js (toastArt left out); keep in sync by hand.
// Clawd at work, drawn on a canvas while a turn runs (the chat view's typing row): once, 4s thinking (dots, then a "?")
// and pulling out a laptop; then he types on it until the turn ends. The story and timing come from the playground's
// clawd-think-type.html; Clawd himself is the avatar's (clawd/clawd.svg) on its 16-cell grid: a 12×8 body, arms two
// cells out one row above the bottom, tall eyes, four legs. So the canvas, at the avatar's cell size, matches it.
// The frame comes from when the turn started, so a redraw of the chat carries on instead of starting over.
// ponytail: the playground's "Done!" bubble is left out: unreadable at this size, and it would read as "finished" while Claude works.

const C = { body: '#d77757', eye: '#1d1b1a', dot: '#BBBBBB',
  shell: '#5A5F6B', lid: '#7A8090', key: '#C9CED8', keyDark: '#9AA0AC', shine: '#FFFFFF', glass: '#9FC9E8', sea: '#3D7FD6', mark: '#ECE8E4', screen: '#2B3A55', code1: '#7FE0A8', code2: '#8CC8FF' };
const OX = 0, OY = 7, QX = OX + 1;   // Clawd's top-left; the 3/4 view sits a cell right, as his body is narrower
const W = 24, H = 17, CELL = 2;      // the canvas in cells: a row for the "?", Clawd in the avatar's 16×16 box, the laptop to his right
const FPS = 30, THINK = 4, TYPE = 5;
const LW = 9;                        // laptop width; its lid is one shorter

const box = (w, h, on) => Array.from({ length: h }, (_, r) => Array.from({ length: w }, (_, c) => +on(r, c)));
const ARMS = r => r === 5 || r === 6;
const FRONT = box(16, 10, (r, c) => r < 8 ? (c >= 2 && c <= 13) || ARMS(r) : [3, 5, 10, 12].includes(c));
// 3/4 view, facing right: a narrower body, the back arm only; the front claw is drawn apart so it can type
const QUARTER = box(12, 10, (r, c) => r < 8 ? (c >= 2 && c <= 11) || (ARMS(r) && c < 2) : [3, 5, 8, 10].includes(c));
const QUARTER_TYPING = box(12, 10, (r, c) => QUARTER[r][c] && c >= 2); // the back arm has gone to the keys too
const EYES = { forward: [0, 0], look_right: [1, 0], look_left: [-1, 0], look_down: [0, 1], look_up: [0, -1] }; // blink: none
const QEYES = { forward: [[7, 2], [10, 2]], look_down: [[7, 3], [10, 3]] };
const QUESTION = [[1,1,1], [0,0,1], [0,1,0], [0,0,0], [0,1,0]];
const TAPS = [1,0,1,1,0,1,0,0,1,0,1,1], WANDER = ['look_left', 'look_right'];

const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeInOut = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));

// The scene for what the session is doing now (the sprint-bridge mod's tool, terminals.js): a tool without one types,
// no tool at all (Claude writing or thinking between tools) thinks, a prompt waiting on you is 'ask'. A session without the
// mod types, as before.
export const SCENES = { Read: 'search', Grep: 'search', Glob: 'search', ToolSearch: 'search', Bash: 'run', WebFetch: 'web', WebSearch: 'web',
  Agent: 'agents', Task: 'agents', SendMessage: 'agents', ListAgents: 'agents', TaskStop: 'agents', ScheduleWakeup: 'sleep' };
// a tool's scene: by name; a browser's MCP tools (mcp__Claude_Browser__navigate, …) on the web; Jira and documents, whether
// an MCP server's (Atlassian, Notion, Docs) or a twg command in the shell (bin: its program, from the mod), at the clipboard
export const sceneFor = (tool, bin) => {
  const server = String(tool).match(/^mcp__(.+?)__/)?.[1] || '';
  if (tool === 'Bash' && bin === 'twg' || /atlassian|jira|confluence|notion|docs/i.test(server)) return 'tickets';
  return SCENES[tool] || (/browser|chrome|playwright/i.test(server) ? 'web' : undefined);
};
// a lens, 7×7: its rim (clockwise from the top) and its glass
// a Z, 4×4: 3×3 has no room for its slant and reads as an I
const Z = [[0, 0], [1, 0], [2, 0], [3, 0], [2, 1], [1, 2], [0, 3], [1, 3], [2, 3], [3, 3]];
const RING = [[2, 0], [3, 0], [4, 0], [5, 1], [6, 2], [6, 3], [6, 4], [5, 5], [4, 6], [3, 6], [2, 6], [1, 5], [0, 4], [0, 3], [0, 2], [1, 1]];
const GLASS = [[2, 1], [3, 1], [4, 1], ...[2, 3, 4].flatMap(r => [1, 2, 3, 4, 5].map(c => [c, r])), [2, 5], [3, 5], [4, 5]];

// the globe: a 7×7 disc (each row's first and last column) and the land on a 12-column map that scrolls round it
const DISC = [[2, 4], [1, 5], [0, 6], [0, 6], [0, 6], [1, 5], [2, 4]];
const LAND = ['..##......#.', '.####...###.', '..###..####.', '...#...###..', '....##..#...', '....###.....', '.....#......'];

// scene: 'type' plays the story below (f: its frame); another scene draws its own loop at frame k
function draw(ctx, f, scene = 'type', k = 0) {
  const px = (x, y, col) => { ctx.fillStyle = col; ctx.fillRect(x * CELL, y * CELL, CELL, CELL); };
  const grid = (d, ox, oy, col, lean = 0) => d.forEach((row, r) => row.forEach((on, c) => on && px(ox + c + (r < 5 ? lean : 0), oy + r, col)));
  const eye = (x, y) => { px(x, y, C.eye); px(x, y + 1, C.eye); }; // two cells tall, as on the avatar
  const front = (oy, eyes) => {
    grid(FRONT, OX, oy, C.body);
    const e = EYES[eyes];
    if (e) { eye(OX + 4 + e[0], oy + 2 + e[1]); eye(OX + 11 + e[0], oy + 2 + e[1]); }
  };
  const claw = (c0, oy, armDY) => { // 2×2, on the arm's row; 1–2 lower reaches the keys
    for (let r = 5 + armDY; r < 7 + armDY; r++) for (let c = c0; c < c0 + 2; c++) px(QX + c, oy + r, C.body);
  };
  // back: null, or the back claw's armDY when it types beside the front one
  const quarter = (oy, eyes, armDY, lean, back) => {
    grid(back === null ? QUARTER : QUARTER_TYPING, QX, oy, C.body, lean);
    for (const [x, y] of QEYES[eyes] || []) eye(QX + x + lean, oy + y);
    claw(12, oy, armDY);
    if (back !== null) claw(15, oy, back);
  };
  const laptop = (lx, ly, angle, typing) => { // side view: hinge on the right, the lid opens 0° → 100°
    for (let c = 0; c < LW; c++) { px(lx + c, ly, c === LW - 1 ? C.shell : c % 2 ? C.key : C.keyDark); px(lx + c, ly + 1, C.shell); }
    const a = angle * Math.PI / 180, pts = [];
    for (let i = 0; i < LW; i++) pts.push({ x: lx + LW - 1 - Math.round(i * Math.cos(a)), y: ly - Math.round(i * Math.sin(a)) });
    if (angle > 60) {
      const codes = [C.screen, C.code1, C.screen, C.code2, C.code1];
      for (let i = 1; i < LW - 2; i++) px(pts[i].x - 1, pts[i].y, typing ? codes[(i * 3 + Math.floor(f / 4)) % codes.length] : C.screen);
    }
    pts.forEach((p, i) => px(p.x, p.y, i === LW - 2 ? C.shine : C.lid));
  };

  ctx.clearRect(0, 0, W * CELL, H * CELL);
  if (scene === 'search') { // reading and searching: a magnifying glass at his right eye, sliding left and right to scan
    const t = k / FPS, ox = OX + Math.round(2 + 2 * Math.sin(t * Math.PI / 1.4)); // one sweep each way in 1.4s
    const look = Math.cos(t * Math.PI / 1.4) >= 0 ? 1 : -1, blink = k % (FPS * 3) < 3; // eyes the way he moves; a blink every 3s
    grid(FRONT, ox, OY, C.body);
    if (!blink) eye(ox + 4 + look, OY + 2);
    // the lens over his right eye, out past his head (top and right); through the glass that eye shows big, 2 by 3
    const lx = ox + 8, ly = OY - 1;
    for (const [a, b] of GLASS) px(lx + a, ly + b, C.glass);
    if (!blink) for (const [a, b] of [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2]]) px(lx + 2 + (look > 0 ? 1 : 0) + a, ly + 2 + b, C.eye);
    for (const [a, b] of RING) px(lx + a, ly + b, C.lid);
    px(lx + 2, ly + 1, C.shine); px(lx + 1, ly + 2, C.shine); // a fixed shine on the glass, top left
    px(lx + 6, ly + 6, C.shell); px(lx + 7, ly + 7, C.shell); // the handle, down into his claw
    return;
  }
  if (scene === 'tickets') { // Jira and documents: he holds up a ticket and reads it, it flips away, the next comes off the stack
    const card = (x, y, w) => { // a ticket: a blue band on top, white below with two lines of text; w narrows as it turns
      for (let c = 0; c < w; c++) for (let r = 0; r < 5; r++) px(x + c, y + r, r === 0 ? C.sea : C.mark);
      if (w > 3) { for (let c = 1; c < w - 1; c++) px(x + c, y + 2, C.keyDark); for (let c = 1; c < w - 2; c++) px(x + c, y + 3, C.keyDark); }
    };
    for (const r of [7, 8, 9]) for (let c = 0; c < 6; c++) px(18 + c, OY + r, c === 0 ? C.sea : r === 7 ? C.mark : C.key); // the stack beside him
    const t = (k % Math.round(FPS * 2.4)) / (FPS * 2.4);
    let hx = 15, hy = OY + 3; // his claw: on the ticket's lower-left corner while he reads it
    if (t < 0.55) card(16, OY, 6); // reading it
    else if (t < 0.75) { const p = (t - 0.55) / 0.2, w = Math.max(1, Math.round(6 - p * 6)); card(16 + Math.floor((6 - w) / 2), OY - Math.round(p * 2), w); // flips away
      hy = OY + 3 + Math.round(p * 3); } // and his arm already goes down for the next
    else { const p = (t - 0.75) / 0.25, cx = 16 + Math.round((1 - p) * 2), cy = OY + Math.round((1 - p) * 6); card(cx, cy, 6); hx = cx - 1; hy = Math.min(cy + 3, OY + 7); } // up off the stack, in his claw
    front(OY, k % (FPS * 3) < 3 ? 'blink' : 'look_right');
    for (let y = Math.min(hy, OY + 5); y <= OY + 6; y++) px(15, y, C.body); // the arm, from his side up to the claw
    for (let c = 0; c < 2; c++) for (let r = 0; r < 2; r++) px(hx + c, hy + r, C.body); // the claw, holding it
    return;
  }
  if (scene === 'sleep') { // a check-back pending: eyes shut, Zs rising from his head
    grid(FRONT, OX, OY, C.body);
    ctx.fillStyle = C.eye; // shut: a thin line each, three cells wide and half a cell tall, centred on where his eyes are
    for (const x of [OX + 3, OX + 10]) ctx.fillRect(x * CELL, (OY + 3) * CELL, 3 * CELL, CELL / 2);
    const rise = FPS * 3; // each z floats up for 3s; two of them, 1.5s apart, so they never touch
    for (let i = 0; i < 2; i++) {
      const t = ((k + i * FPS * 1.5) % rise) / rise;
      if (t > 0.9) continue; // gone just before the top
      const x = OX + 13 + Math.round(t * 6), y = OY - 3 - Math.round(t * 4); // up and to the right, inside the canvas
      for (const [a, b] of Z) px(x + a, y + b, C.mark);
    }
    return;
  }
  if (scene === 'ask') { // a question or permission prompt waits on you: every 1.5s a "!" pops over him and he shakes
    const m = k % Math.round(FPS * 1.5), sh = m < 12 ? [0, 1, 0, 1, 0][Math.floor(m / 2.4)] : 0, pop = m < 5 ? 1 : 0; // shakes to the right of his place and back: still, he lines up with the avatars, and never crosses the canvas's left edge
    grid(FRONT, OX + sh, OY, C.body);
    if (k % (FPS * 3) >= 3) { eye(OX + sh + 4, OY + 2); eye(OX + sh + 11, OY + 2); } // on you; a blink every 3s
    for (let r = 0; r < 3; r++) px(OX + sh + 7, OY - 6 + r - pop, C.mark), px(OX + sh + 8, OY - 6 + r - pop, C.mark); // the "!", 2 wide
    px(OX + sh + 7, OY - 2 - pop, C.mark); px(OX + sh + 8, OY - 2 - pop, C.mark);
    return;
  }
  if (scene === 'agents') { // subagents: little Clawds hop off to the right, one after another, and he watches them go
    front(OY, k % (FPS * 3) < 3 ? 'blink' : 'look_right');
    const trip = FPS * 1.5, t = (k % trip) / trip; // one at a time: three hops out of the picture, then the next
    const x = 16 + Math.round(t * 9), y = OY + 6 - Math.round(2 * Math.abs(Math.sin(t * Math.PI * 3)));
    for (let c = 0; c < 5; c++) for (let r = 0; r < 3; r++) px(x + c, y + r, C.body); // a 5×3 body
    px(x + 1, y + 1, C.eye); px(x + 3, y + 1, C.eye); px(x + 1, y + 3, C.body); px(x + 3, y + 3, C.body); // eyes, legs
    return;
  }
  if (scene === 'web') { // on the web: he holds a globe beside him, its land turning past, his eyes on it
    const gx = 16, gy = OY + 1, turn = Math.floor(k / 4); // a column every 4 frames
    DISC.forEach(([a, b], r) => { for (let c = a; c <= b; c++) px(gx + c, gy + r, LAND[r][(c + turn) % 12] === '#' ? C.code1 : C.sea); });
    px(gx + 2, gy + 1, C.shine); // a fixed shine, top left
    return front(OY, k % (FPS * 3) < 3 ? 'blink' : 'look_right');
  }
  if (scene === 'run') { // a shell command: he watches a screen beside him, output scrolling up and a cursor blinking
    const long = k > FPS * 20; // a long run (tests, a build): bored, he blinks more, looks away and hops now and then
    const mx = 17, my = OY + 1, mh = 9; // the screen: a 7×9 frame standing on the ground, no stand
    for (let c = 0; c < 7; c++) for (let r = 0; r < mh; r++) px(mx + c, my + r, c === 0 || c === 6 || r === 0 || r === mh - 1 ? C.shell : C.screen);
    const line = Math.floor(k / 6); // a new line every 0.2s, the older ones moving up
    for (let r = 0; r < 5; r++) { const n = line + r; for (let c = 0; c < 1 + (n * 7) % 5; c++) px(mx + 1 + c, my + 1 + r, n % 3 ? C.code1 : C.code2); }
    if (Math.floor(k / 12) % 2) px(mx + 1, my + 6, C.shine); // the cursor
    // turned to the screen (3/4 view); bored, every other 3s he turns to the front, and hops every 5s
    const blink = k % (FPS * (long ? 2 : 3)) < 3, away = long && Math.floor(k / (FPS * 3)) % 2, oy = OY - (long && k % (FPS * 5) < 6 ? 1 : 0);
    return away ? front(oy, blink ? 'blink' : 'forward') : quarter(oy, blink ? 'blink' : 'forward', 0, 0, null);
  }
  const split = FPS * THINK;
  if (f < split) { // thinking: dots fill in while the eyes wander, then a "?" with a bop
    const t = f / split;
    let eyes = 'forward', oy = OY, dots = 0, question = false;
    if (t < 0.08) eyes = t > 0.05 && t < 0.06 ? 'blink' : 'forward';
    else if (t < 0.55) { const k = Math.floor((t - 0.08) / 0.08); dots = k % 3 + 1; eyes = WANDER[Math.floor(k / 3) % 2]; }
    else if (t < 0.88) {
      const p = seg(t, 0.55, 0.62);
      oy = OY - (p < 1 ? Math.round(Math.sin(p * Math.PI)) : 0);
      dots = 3; question = true; eyes = t > 0.75 && t < 0.765 ? 'blink' : 'look_up';
    }
    // a free row between the dots and his head, so the bop never touches them
    for (let i = 0; i < dots; i++) px(OX + 5 + i * 2, OY - 3, C.dot);
    if (question) grid(QUESTION, OX + 13, OY - 7, C.dot);
    return front(oy, eyes);
  }
  const t = (f - split) / (FPS * TYPE); // typing
  const HELD = OY + 5, DOWN = OY + 8, AT = QX + 12; // the laptop carried at arm height, on the ground, under the claw
  let pose = 'quarter', eyes = 'forward', armDY = 0, oy = OY, lean = 0, lap = null, typing = false, back = null;
  if (t < 0.07) { pose = 'front'; eyes = t > 0.045 && t < 0.055 ? 'blink' : 'forward'; }
  else if (t < 0.13) { pose = seg(t, 0.07, 0.13) < 0.5 ? 'front' : 'quarter'; eyes = pose === 'front' ? 'look_right' : 'forward'; }
  else if (t < 0.20) { lap = { x: QX + Math.round(lerp(3, 13, easeOut(seg(t, 0.13, 0.20)))), y: HELD, angle: 0 }; eyes = 'look_down'; }
  else if (t < 0.27) {
    const p = easeInOut(seg(t, 0.20, 0.27));
    lap = { x: Math.round(lerp(QX + 13, AT, p)), y: Math.round(lerp(HELD, DOWN, p)), angle: 0 }; armDY = Math.round(lerp(0, 2, p)); eyes = 'look_down';
  } else if (t < 0.34) { lap = { x: AT, y: DOWN, angle: 100 * easeOut(seg(t, 0.27, 0.34)) }; armDY = 1; }
  else { // typing: animate() loops this part, 0.34–0.64
    lap = { x: AT, y: DOWN, angle: 100 }; typing = true;
    if (t > 0.47 && t < 0.53) { armDY = back = 0; eyes = t > 0.49 && t < 0.505 ? 'blink' : 'forward'; }
    else { // two hands, out of step
      lean = 1; eyes = t > 0.40 && t < 0.41 ? 'blink' : 'forward';
      armDY = TAPS[Math.floor(f / 2) % TAPS.length] ? 2 : 1;
      back = TAPS[(Math.floor(f / 2) + 5) % TAPS.length] ? 2 : 1;
    }
  }
  if (lap) laptop(lap.x, lap.y, lap.angle, typing); // first, so Clawd's body hides it while he pulls it out
  if (pose === 'front') front(oy, eyes); else quarter(oy, eyes, armDY, lean, back);
}

// Runs on one canvas until it leaves the page (the next chat redraw makes a new one). Hidden tabs skip the drawing;
// with reduced motion, Clawd sits still on the first frame.
// since: when the turn started (ms), so thinking plays once and the typing loops for as long as the turn runs.
const INTRO = FPS * THINK + Math.round(0.34 * FPS * TYPE), LOOP = Math.round(0.30 * FPS * TYPE); // in frames
const THINKING = Math.round(0.08 * FPS * THINK), THOUGHT = Math.round(0.8 * FPS * THINK); // the thinking part of the opening
// scene(): the scene for what the session does now (SCENES), asked each frame. After the thinking, a change of scene
// starts the new one's loop at once; only typing as the first scene pulls the laptop out first.
export function animate(canvas, since = Date.now(), scene = () => 'type') {
  canvas.width = W * CELL; canvas.height = H * CELL;
  const ctx = canvas.getContext('2d');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return draw(ctx, 0);
  let last = '', cur = null, from = 0, first = true;
  const tick = () => {
    if (!canvas.isConnected) return;
    const now = Date.now(), n = Math.floor(Math.max(0, now - since) / 1000 * FPS);
    let f = n, s = 'type', k = 0;
    if (n >= FPS * THINK) {
      s = scene() || 'type';
      if (s !== cur) { first = cur === null; cur = s; from = now; }
      k = Math.floor((now - from) / 1000 * FPS);
      f = s === 'think' ? THINKING + k % THOUGHT // between tools: the opening's thinking, round and round (dots, then the "?")
        : s !== 'type' ? 0 : first ? (n < INTRO ? n : INTRO + (n - INTRO) % LOOP) : INTRO + k % LOOP;
    }
    const key = `${s}:${f}:${['type', 'think'].includes(s) ? 0 : k}`;
    if (key !== last && canvas.offsetParent) { last = key; draw(ctx, f, s === 'think' ? 'type' : s, k); }
    requestAnimationFrame(tick);
  };
  tick();
}

const SPARK = '#0091ff', ORANGE = '#d77757', INK = '#1d1b1a';
const SIZES = [0, 1, 2, 3, 2, 1]; // each twinkle step

// The new chat's Clawd (the hero), on the avatar's grid: he drops in, lands with a squash, waves with a wink and a
// sparkle, then idles: blinks, glances about, hops now and then. Hovering a start card turns his eyes to it, with a hop.
// since: when the hero first showed, so a chat redraw carries on instead of dropping him in again.
const HW = 22, HH = 14, HOY = 4, HC = 5; // canvas in cells: 3 rows to hop in, 4 columns for the sparkle; 5px a cell
// the waving arm, from the shoulder to a 2×2 claw above his head: straight up, then tipped out
const WAVE = [[[14, 4], [14, 3], [15, 2], [15, 1], [15, 0], [16, 0], [15, -1], [16, -1]],
              [[14, 4], [15, 4], [15, 3], [16, 3], [16, 2], [17, 2], [16, 1], [17, 1]]];
const LOOKS = [[-1, 1], [0, 1], [1, 1]]; // per start card, left to right
export function hello(canvas, since = Date.now()) {
  canvas.width = HW * HC; canvas.height = HH * HC;
  const ctx = canvas.getContext('2d'), starts = [...(canvas.closest('.hero')?.querySelectorAll('.starts button') || [])];
  let look = null, lookAt = 0;
  starts.forEach((b, i) => {
    b.addEventListener('pointerenter', () => { look = LOOKS[i] || [0, 1]; lookAt = Date.now(); });
    b.addEventListener('pointerleave', () => { look = null; });
  });
  const px = (x, y, col) => { ctx.fillStyle = col; ctx.fillRect(x * HC, y * HC, HC, HC); };
  const sparkle = (x, y, k) => { // 0 dark, 1 a dot, 2 a small plus, 3 a big one
    if (!k) return;
    px(x, y, SPARK);
    if (k > 1) for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) px(x + a, y + b, SPARK);
    if (k > 2) for (const [a, b] of [[2, 0], [-2, 0], [0, 2], [0, -2]]) px(x + a, y + b, SPARK);
  };
  const frame = ms => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let oy = HOY, squash = false, wave = -1, wink = false, eyes = [0, 0], blink = false, spark = 0;
    if (ms < 600) oy = Math.round(lerp(-10, HOY, seg(ms, 0, 600) ** 2)); // falls in
    else if (ms < 720) squash = true;                                     // lands
    else if (ms < 860) oy = HOY - 1;                                      // bounces back
    else if (ms < 2600) {                                                 // waves and winks
      wave = Math.floor((ms - 900) / 180) % 2;
      wink = ms > 1100 && ms < 2300;
      spark = SIZES[Math.floor((ms - 1000) / 90) % 9] || 0;
    } else {                                                              // idles, 7s a loop
      const t = (ms - 2600) % 7000;
      blink = (t > 1200 && t < 1320) || (t > 4000 && t < 4120) || (t > 6200 && t < 6320);
      eyes = t > 1600 && t < 2800 ? [-1, 0] : t > 2800 && t < 3900 ? [1, 0] : t > 5400 && t < 6000 ? [0, -1] : [0, 0];
      const hop = seg(t, 4700, 5100);
      if (hop > 0 && hop < 1) oy = HOY - Math.round(Math.sin(hop * Math.PI) * 2);
      if (t > 5100 && t < 5200) squash = true;
      spark = t > 4800 && t < 5500 ? SIZES[Math.floor((t - 4800) / 110) % 6] : 0;
    }
    if (look && ms > 860) { // a hovered card: eyes on it, and a little hop when he first sees it
      eyes = look; blink = false;
      const h = (Date.now() - lookAt) / 260;
      if (h < 1) oy = HOY - Math.round(Math.sin(h * Math.PI));
    }
    if (spark) sparkle(19, 2, Math.min(3, spark)); // first, so a waving claw sits over it
    // body: FRONT minus the waving arm; a squash drops it a row onto shorter legs
    const by = oy + (squash ? 1 : 0);
    FRONT.forEach((row, r) => row.forEach((on, c) => {
      if (!on || (wave >= 0 && c >= 14 && ARMS(r))) return;
      if (r >= 8) { if (!(squash && r === 8)) px(c, oy + r, ORANGE); } // squashed: the legs fold to one row
      else px(c, by + r, ORANGE);
    }));
    if (wave >= 0) for (const [c, r] of WAVE[wave]) px(c, by + r, ORANGE);
    const [ex, ey] = eyes;
    if (blink) { px(4, by + 3, INK); px(11, by + 3, INK); return; }
    px(4 + ex, by + 2 + ey, INK); px(4 + ex, by + 3 + ey, INK);
    if (wink) { px(10, by + 3, INK); px(11, by + 3, INK); px(12, by + 3, INK); }
    else { px(11 + ex, by + 2 + ey, INK); px(11 + ex, by + 3 + ey, INK); }
  };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return frame(1500); // still: waving, winking
  const tick = () => {
    if (!canvas.isConnected) return;
    if (canvas.offsetParent) frame(Date.now() - since);
    requestAnimationFrame(tick);
  };
  tick();
}
