import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import TabContent from "../components/TabContent";

const ConsoleContent = () => {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const welcomeMessageShown = useRef(false);
  const inputRef = useRef(null);
  const textLineRef = useRef(null);
  const consoleRef = useRef(null);

  const { t } = useTranslation();

  const commands = useMemo(
    () => ["about", "skills", "contact", "help", "clear"],
    [],
  );

  const consoleWelcomeMessage = t("consoleWelcomeMessage", {
    returnObjects: true,
    helpCommand: "<span class=\"text-secondary-400\">'help'</span>",
  });

  console.log(consoleWelcomeMessage);

  const textLineContent = (
    <span className="font-black" aria-hidden="true">
      <span className="text-primary-500">david@ubuntu</span>
      <span className="text-white">:</span>
      <span className="text-primary-500">~</span>
      <span className="text-white mr-2">$</span>
    </span>
  );

  const updateSuggestions = useCallback(
    (input) => {
      if (input.length > 0) {
        const matches = commands.filter((cmd) =>
          cmd.toLowerCase().startsWith(input.toLowerCase()),
        );
        setSuggestions(matches);
      } else {
        setSuggestions([]);
      }
    },
    [commands],
  );

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    if (!welcomeMessageShown.current) {
      const welcomeMessage = (
        <>
          <div className="-mb-1">
            ▗▄▄▄{"  "}▗▄▖ ▗▖{"  "}▗▖▗▄▄▄▖▗▄▄▄{" "}
          </div>
          <div className="-mb-1">
            ▐▌{"  "}█▐▌ ▐▌▐▌{"  "}▐▌{"  "}█{"  "}▐▌{"  "}█
          </div>
          <div className="-mb-1">
            ▐▌{"  "}█▐▛▀▜▌▐▌{"  "}▐▌{"  "}█{"  "}▐▌{"  "}█
          </div>
          <div className="-mb-1">▐▙▄▄▀▐▌ ▐▌ ▝▚▞▘ ▗▄█▄▖▐▙▄▄▀</div>
          <br />
          {consoleWelcomeMessage.map((line, index) => {
            return (
              <div
                key={index}
                dangerouslySetInnerHTML={{
                  __html: line,
                }}
              />
            );
          })}
          <br />
        </>
      );

      setOutput([{ command: "", response: welcomeMessage }]);
      welcomeMessageShown.current = true;
    }
    inputRef.current?.focus();
  }, [consoleWelcomeMessage]); // Add consoleWelcomeMessage to dependencies

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      if (command.trim()) {
        const response = executeCommand(command);
        if (command.toLowerCase() !== "clear") {
          setOutput((prevOutput) => [...prevOutput, { command, response }]);
        }
        setCommandHistory((prevHistory) => [...prevHistory, command]);
      } else {
        setOutput((prevOutput) => [
          ...prevOutput,
          { command: " ", response: null },
        ]);
      }
      setCommand("");
      setHistoryIndex(null);
    } else if (e.key === "Tab") {
      e.preventDefault();
      completeCommand();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      navigateHistory(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      navigateHistory(1);
    }
  };

  const navigateHistory = (direction) => {
    if (commandHistory.length === 0) return;

    const newIndex =
      historyIndex === null
        ? commandHistory.length - 1
        : Math.min(
            Math.max(historyIndex + direction, 0),
            commandHistory.length - 1,
          );

    if (newIndex !== historyIndex) {
      setHistoryIndex(newIndex);
      setCommand(commandHistory[newIndex]);
    } else if (direction === 1 && historyIndex === commandHistory.length - 1) {
      setHistoryIndex(null);
      setCommand("");
    }
  };

  const executeCommand = (cmd) => {
    switch (cmd.toLowerCase()) {
      case "about":
        return <>{t("aboutDescription", { joinArrays: " " })}</>;
      case "skills":
        return (
          <span
            dangerouslySetInnerHTML={{
              __html: t("skillsDescription", { joinArrays: " " }),
            }}
          ></span>
        );
      case "contact":
        return (
          <>
            {t("contactDescription", { joinArrays: " " })}
            <a
              className="text-secondary-400 hover:underline"
              href="mailto:dbeltra@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("contactEmail")}
            >
              dbeltra@gmail.com
            </a>{" "}
            |{" "}
            <a
              className="text-secondary-400 hover:underline"
              href="https://www.linkedin.com/in/dbeltra/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("contactLinkedin")}
            >
              LinkedIn
            </a>
          </>
        );
      case "help":
        return (
          <>
            {t("consoleHelp")}
            :
            <br />
            {commands.map((command, index) => (
              <span className="text-secondary-400" key={index}>
                {command}
                {index < commands.length - 1 && ", "}
              </span>
            ))}
          </>
        );
      case "clear":
        setOutput([]);
        return null;
      default:
        return (
          <>
            <span className="text-red-500">"{cmd}"</span>{" "}
            <span
              dangerouslySetInnerHTML={{
                __html: t("consoleUnrecognizedCommand", {
                  helpCommand:
                    "<span class=\"text-secondary-400\">'help'</span>",
                }),
              }}
            />
          </>
        );
    }
  };

  const completeCommand = () => {
    if (suggestions.length > 0) {
      setCommand(suggestions[0]);
    }
  };

  useEffect(() => {
    updateSuggestions(command);
  }, [command, updateSuggestions]); // Add updateSuggestions to dependencies

  const getTextLineWidth = () => {
    if (textLineRef.current) {
      return textLineRef.current.getBoundingClientRect().width;
    }
    return 0;
  };

  return (
    <div
      ref={consoleRef}
      className="code-font text-sm h-full p-4 overflow-y-scroll relative bg-black/10"
      aria-label="Console Output"
    >
      <div ref={textLineRef} className="fixed top-0 left-0 invisible">
        {textLineContent}
      </div>

      <div>
        {output.map((entry, index) => (
          <div key={index} className="mt-1">
            {entry.command === "" ? (
              <div>{entry.response}</div>
            ) : (
              <div>
                {textLineContent}
                <span>{entry.command}</span>
                {entry.response && <div>{entry.response}</div>}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="relative flex items-center mt-1">
        {textLineContent}
        <input
          type="text"
          ref={inputRef}
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleCommand}
          className="flex-1 bg-transparent border-none outline-none"
          placeholder={t("consoleInputPlaceholder")}
          aria-label="Console input field"
        />

        {suggestions.length > 0 && (
          <div
            className="text-gray-400 absolute z-10 top-0"
            style={{
              left: `${getTextLineWidth()}px`,
            }}
            aria-label="Command suggestions"
          >
            {suggestions.map((suggestion, index) => (
              <div key={index}>{suggestion}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Console = () => {
  return <TabContent Content={ConsoleContent} />;
};

export default Console;
