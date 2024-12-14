import React from "react";

const Footer = ({ lineCount = 20, selectedLine = 1 }) => {
  return (
    <div className="bg-gray-500 text-gray-300 text-xs row-start-3 col-span-3 flex gap-3 justify-end px-4">
      <span>
        Line {selectedLine}/{lineCount}
      </span>
      <span>Spaces: 2</span>
      <span>UTF-8</span>
    </div>
  );
};

export default Footer;
