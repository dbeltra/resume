import "highlight.js/styles/nnfx-dark.css";
import hljs from "highlight.js";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useOutletContext } from "react-router-dom";

const TabContent = ({ code, language, Title, Content }) => {
  const {
    setLineCount,
    setSelectedLine: setGlobalSelectedLine,
    isMinimized,
  } = useOutletContext();

  const lineCount = useMemo(() => (code ? code.split("\n").length : 0), [code]);

  const [selectedLine, setSelectedLine] = useState(1); // Local state for the selected line

  const processCodeWithLineNumbers = useCallback(
    (code, language, selectedLine) => {
      if (!code) return "";
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
    },
    [],
  );

  const [processedCode, setProcessedCode] = useState("");

  useEffect(() => {
    if (code) {
      setLineCount(lineCount);
      setProcessedCode(
        processCodeWithLineNumbers(code, language, selectedLine),
      );
    }
  }, [
    code,
    language,
    lineCount,
    setLineCount,
    selectedLine,
    processCodeWithLineNumbers,
  ]);

  const handleLineClick = useCallback(
    (lineNumber) => {
      setSelectedLine(lineNumber); // Update local state
      setGlobalSelectedLine(lineNumber); // Update global state for the footer
    },
    [setGlobalSelectedLine],
  );

  useEffect(() => {
    if (!code) return;
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
  }, [processedCode, handleLineClick, code]);

  return (
    <div
      className={`col-start-2 col-span-2 row-start-2 
      grid-rows-subgrid grid-cols-subgrid w-full
      min-h-screen
      ${code ? "flex-col-reverse" : "flex-col"}
      ${isMinimized ? "hidden" : "flex lg:grid"}
      `}
    >
      {code && (
        <div className="bg-black/10 code-font p-4 overflow-y-scroll">
          <div dangerouslySetInnerHTML={{ __html: processedCode }} />
        </div>
      )}

      <div className={`p-4 overflow-y-scroll ${!code ? "col-span-2" : ""}`}>
        {Title && <div className="border-b mb-4">{Title}</div>}
        <Content />
      </div>
    </div>
  );
};

export default TabContent;
