import React, { useState, useEffect, useRef } from "react";
import TabContent from "../components/TabContent";

const ConsoleContent = () => {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const welcomeMessageShown = useRef(false);
  const inputRef = useRef(null);
  const textLineRef = useRef(null);

  const commands = ["about", "skills", "contact", "help", "clear"];

  const textLineContent = (
    <span className="font-black" aria-hidden="true">
      <span className="text-primary-500">david@ubuntu</span>
      <span className="text-white">:</span>
      <span className="text-primary-500">~</span>
      <span className="text-white mr-2">$</span>
    </span>
  );

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
          Welcome to my personal console!
          <br />* Type <span className="text-secondary-400">'help'</span> for a
          list of commands.
          <br />* Push tab for autocomplete.
          <br />
          <br />
        </>
      );
      setOutput([{ command: "", response: welcomeMessage }]);
      welcomeMessageShown.current = true;
    }
    inputRef.current?.focus();
  }, []);

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      const response = executeCommand(command);
      if (command.toLowerCase() !== "clear") {
        setOutput((prevOutput) => [...prevOutput, { command, response }]);
      }
      setCommand("");
    } else if (e.key === "Tab") {
      e.preventDefault();
      completeCommand();
    }
  };

  const executeCommand = (cmd) => {
    switch (cmd.toLowerCase()) {
      case "about":
        return (
          <>
            I'm a passionate frontend developer specializing in React and
            JavaScript!
          </>
        );
      case "skills":
        return <>React, JavaScript, CSS and more!</>;
      case "contact":
        return (
          <>
            You can reach me at{" "}
            <a
              className="text-secondary-400 hover:underline"
              href="mailto:dbeltra@gmail.com"
              target="_blank"
              aria-label="Send an email to dbeltra@gmail.com"
            >
              dbeltra@gmail.com
            </a>{" "}
            or on{" "}
            <a
              className="text-secondary-400 hover:underline"
              href="https://www.linkedin.com/in/dbeltra/"
              target="_blank"
              aria-label="Visit my LinkedIn profile"
            >
              LinkedIn
            </a>
            .
          </>
        );
      case "help":
        return (
          <>
            Commands:{" "}
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
            <span className="text-red-500">"{cmd}"</span> is not a recognized
            command. Type <span className="text-secondary-400">'help'</span> for
            a list of commands.
          </>
        );
    }
  };

  const updateSuggestions = (input) => {
    if (input.length > 0) {
      const matches = commands.filter((cmd) =>
        cmd.toLowerCase().startsWith(input.toLowerCase()),
      );
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const completeCommand = () => {
    if (suggestions.length > 0) {
      setCommand(suggestions[0]);
    }
  };

  useEffect(() => {
    updateSuggestions(command);
  }, [command]);

  const getTextLineWidth = () => {
    if (textLineRef.current) {
      return textLineRef.current.getBoundingClientRect().width;
    }
    return 0;
  };

  return (
    <div
      className="code-font text-sm h-full p-4 overflow-y-scroll relative"
      aria-label="Console Output"
    >
      <div ref={textLineRef} className="fixed top-0 left-0 visibility-hidden">
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
                <div>{entry.response}</div>
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
          placeholder="Type a command..."
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
