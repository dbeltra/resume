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
    <div className="flex relative h-full overflow-hidden">
      <div className="flex w-1/2">
        <div className="code-font hidden md:block p-4 text-gray-400">
          {lineNumbers.map((lineNumber) => (
            <div key={lineNumber}>{lineNumber}</div>
          ))}
        </div>
        <div className="code-font p-4 hidden md:block">
          <div dangerouslySetInnerHTML={{ __html: marked(code) }} />
        </div>
      </div>
      <div className="bg-gray-700 w-1/2 p-4 md:absolute md:right-0 md:top-0 md:h-[calc(100%-1.25rem)]">
        <div className="border-b">{Title}</div>
        <div className="p-2">
          <Content />
        </div>
      </div>
    </div>
  );
};

export default TabContent;
