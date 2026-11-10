import { desktopReducer, initialState, currentPage } from "./desktopState";

const run = (actions, state = initialState()) =>
  actions.reduce(desktopReducer, state);

test("opening raises a window to the front, closing removes it", () => {
  let s = run([
    { type: "open", id: "code", tab: "agents" },
    { type: "open", id: "term" },
  ]);
  expect(s.order).toEqual(["browser", "code", "term"]);
  expect(s.tab).toBe("agents");

  s = run([{ type: "focus", id: "browser" }], s);
  expect(s.order).toEqual(["code", "term", "browser"]);

  s = run([{ type: "close", id: "term" }], s);
  expect(s.open.term).toBe(false);
  expect(s.order).toEqual(["code", "browser"]);
});

test("browser history: go, back, forward, and go truncates forward history", () => {
  let s = run([
    { type: "go", page: "experience" },
    { type: "go", page: "skills" },
    { type: "back" },
    { type: "back" },
    { type: "back" }, // no-op at the start
  ]);
  expect(currentPage(s)).toBe("about");

  s = run([{ type: "forward" }], s);
  expect(currentPage(s)).toBe("experience");

  s = run([{ type: "go", page: "contact" }, { type: "forward" }], s);
  expect(s.hist).toEqual(["about", "experience", "contact"]);
  expect(currentPage(s)).toBe("contact");
});

test("go reopens a closed browser without duplicating history", () => {
  const s = run([
    { type: "close", id: "browser" },
    { type: "go", page: "about" },
  ]);
  expect(s.open.browser).toBe(true);
  expect(s.order).toEqual(["browser"]);
  expect(s.hist).toEqual(["about"]);
});

test("minimize hides a window and sends it back; reopening restores it", () => {
  let s = run([
    { type: "open", id: "term" },
    { type: "minimize", id: "term" },
  ]);
  expect(s.min.term).toBe(true);
  expect(s.order).toEqual(["term", "browser"]); // browser is focused now

  s = run([{ type: "open", id: "term" }], s);
  expect(s.min.term).toBe(false);
  expect(s.order).toEqual(["browser", "term"]);
});

test("new windows cascade one step per window already showing", () => {
  let s = run([
    { type: "open", id: "term" },
    { type: "open", id: "code" },
  ]);
  expect(s.slot).toMatchObject({ browser: 0, term: 1, code: 2 });

  // refocusing an open window keeps its slot
  s = run([{ type: "open", id: "term" }], s);
  expect(s.slot.term).toBe(1);

  // a minimized window doesn't count; a closed+reopened one gets a new slot
  s = run(
    [
      { type: "minimize", id: "code" },
      { type: "close", id: "term" },
      { type: "open", id: "term" },
    ],
    s,
  );
  expect(s.slot.term).toBe(1);
});
