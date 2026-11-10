// Spotlight search: case- and accent-insensitive, every word must match.
// An exact label match ranks first, then labels starting with the query, then label matches,
// then keyword-only matches. Stable within each rank.
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function search(items, query, limit = 8) {
  const words = norm(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const scored = [];
  items.forEach((it, i) => {
    const label = norm(it.label);
    const hay = `${label} ${norm(it.keywords || "")}`;
    if (!words.every((w) => hay.includes(w))) return;
    const rank =
      label === words.join(" ")
        ? -1
        : label.startsWith(words[0])
          ? 0
          : words.every((w) => label.includes(w))
            ? 1
            : 2;
    scored.push({ it, rank, i });
  });
  return scored
    .sort((a, b) => a.rank - b.rank || a.i - b.i)
    .slice(0, limit)
    .map((s) => s.it);
}
