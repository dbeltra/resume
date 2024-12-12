import { marked } from "marked";
import "highlight.js/styles/nnfx-dark.css";
import hljs from "highlight.js";
import { useEffect } from "react";
import React from "react";

const TabContent = ({ code, Title, Content }) => {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  const lineNumbers = Array.from(
    { length: code.split("\n").length },
    (_, i) => i + 1,
  );

  return (
    <div className="col-start-2 col-span-2 row-start-2 grid grid-rows-subgrid grid-cols-subgrid">
      <div className="bg-gray-600 grid grid-cols-[20px_1fr] overflow-x-hidden overflow-y-scroll">
        <div className="code-font text-gray-400 px-2 py-4">
          {lineNumbers.map((lineNumber) => (
            <div key={lineNumber}>{lineNumber}</div>
          ))}
        </div>
        <div className="code-font p-4">
          <div dangerouslySetInnerHTML={{ __html: marked(code) }} />
        </div>
      </div>

      <div className="bg-gray-700 p-4 overflow-y-scroll">
        <div className="border-b">{Title}</div>
        <div className="p-2">
          <Content />
        </div>
      </div>
    </div>
  );
};

export default TabContent;
