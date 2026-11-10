import { search } from "./search";

const items = [
  { label: "Experience", keywords: "jobs work" },
  { label: "Rust", keywords: "skill" },
  { label: "Trust me", keywords: "" },
  { label: "Català", keywords: "language" },
  { label: "Rust and React developer @ Planck Security", keywords: "2024" },
];

test("exact, then prefix, then substring matches", () => {
  expect(search(items, "rust").map((i) => i.label)).toEqual([
    "Rust",
    "Rust and React developer @ Planck Security",
    "Trust me",
  ]);
});

test("ignores case and accents, matches keywords, needs every word", () => {
  expect(search(items, "CATALA")[0].label).toBe("Català");
  expect(search(items, "jobs")[0].label).toBe("Experience");
  expect(search(items, "rust planck")).toHaveLength(1);
  expect(search(items, "   ")).toEqual([]);
  expect(search(items, "zzz")).toEqual([]);
});
