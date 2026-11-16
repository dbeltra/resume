import React, { useEffect, useRef } from "react";

// a canvas drawn by one of clawd.js's loops; they stop once it unmounts
const Clawd = ({ draw, className }) => {
  const ref = useRef(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => draw(ref.current), []);
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ imageRendering: "pixelated" }}
    />
  );
};

export default Clawd;
