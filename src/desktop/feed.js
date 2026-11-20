import { useEffect, useState } from "react";

// Reads a feed scripts/sync.mjs wrote to public/feeds/. Missing file (fresh
// clone, never synced) reads as an empty list, not an error.
export const useFeed = (name) => {
  const [state, setState] = useState({ items: null, failed: false });
  useEffect(() => {
    let alive = true;
    fetch(`${process.env.PUBLIC_URL}/feeds/${name}.json`)
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => alive && setState({ items: d.items || [], failed: false }))
      .catch(() => alive && setState({ items: null, failed: true }));
    return () => {
      alive = false;
    };
  }, [name]);
  return state;
};

export const feedSrc = (src) => `${process.env.PUBLIC_URL}/${src}`;
