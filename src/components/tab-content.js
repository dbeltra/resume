import { marked } from "marked";
import "highlight.js/styles/nnfx-dark.css";
import hljs from "highlight.js";
import { useEffect } from "react";
import React from "react";
import { useOutletContext } from "react-router-dom";

const TabContent = ({ code, language, Title, Content }) => {
  const { setLineCount } = useOutletContext();
  const lineCount = code.split("\n").length;

  const processCodeWithLineNumbers = (code, language) => {
    // Highlight the code with hljs
    const highlighted = hljs.highlight((code = code), {
      language: language,
    });

    const highlightedCode = highlighted.value;

    // Split the highlighted code into lines
    const lines = highlightedCode.split("\n");

    const processedLines = lines
      .map(
        (line, idx) =>
          `<div class="code-line" data-line="${idx + 1}"><span class="line-number code-font text-gray-400 pr-4">${idx + 1}</span><span class="line-code">${line}</span></div>`,
      )
      .join("\n");

    return `<pre><code class="language-${language}">${processedLines}</code></pre>`;
  };

  useEffect(() => {
    setLineCount(lineCount);
  }, [code, lineCount, setLineCount]);

  const processedCode = processCodeWithLineNumbers(code, language);

  return (
    <div className="col-start-2 col-span-2 row-start-2 flex flex-col-reverse lg:grid grid-rows-subgrid grid-cols-subgrid">
      <div className="bg-gray-600 code-font p-4  overflow-y-scroll">
        <div dangerouslySetInnerHTML={{ __html: processedCode }} />
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
