import React, { useState } from "react";

const Footer = ({ lineCount = 20, selectedLine = 1 }) => {
  const [spin, setSpin] = useState(false);

  const handleClick = () => {
    setSpin(true);
    setTimeout(() => setSpin(false), 2000); // Reset spin after animation completes (3 spins x 0.3s)
  };

  return (
    <div className="bg-gray-500 text-gray-300 text-xs row-start-3 col-span-3 flex justify-between gap-3 px-4">
      <span className="flex items-center">
        <span
          className="flex content-center flex-wrap h-full hover:bg-gray-600 transition-colors cursor-pointer px-2"
          onClick={handleClick}
        >
          <i className={`material-symbols-outlined footer-icon rotate-180`}>
            graph_1
          </i>
          <span className="mr-1">main</span>
          <i
            className={`material-symbols-outlined footer-icon ${spin ? "spin-animation" : ""}`}
          >
            sync
          </i>
        </span>
        <span className="flex items-center gap-1 mx-1">
          <i className="material-symbols-outlined footer-icon">cancel</i>0
          <i className="material-symbols-outlined footer-icon">warning</i>0
        </span>
      </span>

      <span className="flex gap-3  content-center flex-wrap">
        <span>
          Line {selectedLine}/{lineCount}
        </span>
        <span>Spaces: 2</span>
        <span>UTF-8</span>
      </span>
    </div>
  );
};

export default Footer;
