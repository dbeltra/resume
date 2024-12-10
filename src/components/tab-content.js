import { marked } from "marked";
import hljs from "highlight.js";
import { useEffect } from "react";
import React from "react";

const TabContent = ({ code, Title, Content }) => {
  console.log(Content);
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  const lineNumbers = Array.from(
    { length: code.split("\n").length },
    (_, i) => i + 1,
  );

  return (
    <div className="flex flex-grow">
      <div className="flex">
        <div className="code-font hidden md:block p-4 text-gray-400">
          {lineNumbers.map((lineNumber) => (
            <div key={lineNumber}>{lineNumber}</div>
          ))}
        </div>
        <div className="code-font p-4 hidden md:block">
          <div dangerouslySetInnerHTML={{ __html: marked(code) }} />
        </div>
      </div>
      <div className="bg-gray-700 p-4">
        <div className="border-b">{Title}</div>
        <div className="p-2">
          <Content />
        </div>
      </div>
    </div>
  );
};

export default TabContent;
