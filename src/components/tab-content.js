import { marked } from "marked";
import "highlight.js/styles/nnfx-dark.css";
import hljs from "highlight.js";
import { useEffect, useState } from "react";
import React from "react";
import { useOutletContext } from "react-router-dom";

const TabContent = ({ code, language, Title, Content }) => {
  const { setLineCount, setSelectedLine: setGlobalSelectedLine } =
    useOutletContext();
  const lineCount = code.split("\n").length;

  const [selectedLine, setSelectedLine] = useState(1); // Local state for the selected line

  const processCodeWithLineNumbers = (code, language) => {
    const highlighted = hljs.highlight(code, { language }).value;
    const lines = highlighted.split("\n");

    const processedLines = lines
      .map(
        (line, idx) =>
          `<div 
            class="code-line ${selectedLine === idx + 1 ? "highlighted" : ""}" 
            data-line="${idx + 1}">
            <span class="line-number code-font text-gray-400">${idx + 1}</span>
            <span class="line-code">${line}</span>
          </div>`,
      )
      .join("\n");

    return `<pre><code class="language-${language}">${processedLines}</code></pre>`;
  };

  const [processedCode, setProcessedCode] = useState("");

  useEffect(() => {
    setLineCount(lineCount);
    setProcessedCode(processCodeWithLineNumbers(code, language));
  }, [code, language, lineCount, setLineCount, selectedLine]);

  const handleLineClick = (lineNumber) => {
    setSelectedLine(lineNumber); // Update local state
    setGlobalSelectedLine(lineNumber); // Update global state for the footer
  };

  useEffect(() => {
    const codeLines = document.querySelectorAll(".code-line");

    const handleClick = (event) => {
      const lineNumber = parseInt(
        event.currentTarget.getAttribute("data-line"),
        10,
      );
      handleLineClick(lineNumber);
    };

    codeLines.forEach((line) => line.addEventListener("click", handleClick));

    return () => {
      codeLines.forEach((line) =>
        line.removeEventListener("click", handleClick),
      );
    };
  }, [processedCode]);

  return (
    <div className="col-start-2 col-span-2 row-start-2 flex flex-col-reverse lg:grid grid-rows-subgrid grid-cols-subgrid">
      <div className="bg-gray-600 code-font p-4 overflow-y-scroll">
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
