import { useEffect, useState } from "react";

// counts 0..count, one step every `ms`; onEnd fires once it gets there
const useTicker = (count, ms, onEnd) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= count) return void onEnd?.();
    const id = setTimeout(() => setN(n + 1), ms);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);
  return n;
};

export default useTicker;
