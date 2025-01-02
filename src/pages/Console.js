import React, { useState, useEffect, useRef } from "react";
import TabContent from "../components/TabContent";

const ConsoleContent = () => {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState([]);
  const [suggestions, setSuggestions] = useState([]); // For storing command suggestions
  const welcomeMessageShown = useRef(false);

  const commands = ["about", "skills", "contact", "help"]; // List of valid commands
  const inputRef = useRef(null); // Reference to the input element
  const textLineRef = useRef(null); // Reference to the textLine element

  // Show welcome message once
  useEffect(() => {
    if (!welcomeMessageShown.current) {
      const welcomeMessage =
        "Welcome to my personal console!\nType 'help' for a list of commands, you can use tab for autocomplete.\n";
      setOutput((prevOutput) => [
        ...prevOutput,
        { command: "", response: welcomeMessage },
      ]);
      welcomeMessageShown.current = true;
    }

    // Set focus on the input field as soon as the component mounts
    inputRef.current?.focus();
  }, []);

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      let response = executeCommand(command);
      setOutput((prevOutput) => [...prevOutput, { command, response }]);
      setCommand(""); // Clear input after entering command
    } else if (e.key === "Tab") {
      e.preventDefault(); // Prevent default tab behavior (focus shift)
      completeCommand(); // Try to autocomplete the command
    }
  };

  const executeCommand = (cmd) => {
    switch (cmd.toLowerCase()) {
      case "about":
        return "I'm a passionate frontend developer specializing in React and JavaScript!";
      case "skills":
        return "React, JavaScript, CSS, HTML, Node.js, Git, TypeScript, and more!";
      case "contact":
        return "You can reach me at dbeltra@gmail.com or on LinkedIn.";
      case "help":
        return "Commands: about, skills, contact, help";
      default:
        return `"${cmd}" is not a recognized command. Type 'help' for a list of commands.`;
    }
  };

  // Update suggestions when the command input changes
  const updateSuggestions = (input) => {
    const matches = commands.filter((cmd) =>
      cmd.toLowerCase().startsWith(input.toLowerCase()),
    );
    setSuggestions(matches);
  };

  // Autocomplete the current command
  const completeCommand = () => {
    if (suggestions.length > 0) {
      setCommand(suggestions[0]); // Auto-complete with the first matching suggestion
    }
  };

  // Update suggestions on every change in the command input
  useEffect(() => {
    if (command.length > 0) {
      updateSuggestions(command);
    } else {
      setSuggestions([]); // Clear suggestions when input is empty
    }
  }, [command]);

  const textLine = (
    <span ref={textLineRef} className="font-black">
      <span className="text-primary-500">david@ubuntu</span>
      <span className="text-white">:</span>
      <span className="text-primary-500">~</span>
      <span className="text-white mr-2">$</span>
    </span>
  );

  // Function to get the width of the textLine
  const getTextLineWidth = () => {
    if (textLineRef.current) {
      return textLineRef.current.getBoundingClientRect().width;
    }
    return 0;
  };

  return (
    <div className="code-font text-sm bg-black/10 h-full p-4 overflow-y-scroll relative">
      <div>
        {/* Displaying previous commands and their output */}
        {output.map((entry, index) => (
          <div key={index} className="mt-1">
            {entry.command === "" && entry.response !== "" ? (
              <p>{entry.response}</p>
            ) : (
              <div>
                <span>{textLine}</span>
                <span>{entry.command}</span>
                <p>{entry.response}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input field for user commands */}
      <div className="relative flex items-center mt-1">
        <span>{textLine}</span>
        <input
          type="text"
          ref={inputRef} // Reference to the input element
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleCommand}
          className="flex-1 bg-transparent border-none outline-none"
          placeholder="Type a command..."
        />

        {/* Suggestions for the commands, only show when there's at least one character typed */}
        {command.length > 0 && suggestions.length > 0 && (
          <div
            className="text-gray-400 absolute z-10"
            style={{
              left: `${getTextLineWidth()}px`, // Use the dynamic width of textLine to offset suggestions
            }}
          >
            {/* Displaying the suggestions in gray */}
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
