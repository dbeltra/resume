import React from "react";

const Footer = ({ lineCount = 20, selectedLine = 1 }) => {
  return (
    <div className="bg-gray-500 text-gray-300 text-xs row-start-3 col-span-3 flex justify-between gap-3 px-4">
      <span className="flex content-center flex-wrap">
        <i className="material-symbols-outlined footer-icon rotate-180">
          graph_1
        </i>
        <span className="mr-2">main</span>
        <i className="material-symbols-outlined footer-icon">sync</i>
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
