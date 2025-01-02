import React, { useState, useEffect, useRef } from "react";
import TabContent from "../components/TabContent";

const ConsoleContent = () => {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState([]);
  const welcomeMessageShown = useRef(false); // Use useRef to track the welcome message status

  // Only add the welcome message once
  useEffect(() => {
    if (!welcomeMessageShown.current) {
      const welcomeMessage =
        "Welcome to my personal console! Type 'help' for a list of commands.";
      setOutput((prevOutput) => [
        ...prevOutput,
        { command: "", response: welcomeMessage },
      ]);
      welcomeMessageShown.current = true; // Mark as shown
    }
  }, []);

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      let response = executeCommand(command);
      setOutput((prevOutput) => [...prevOutput, { command, response }]);
      setCommand(""); // Clear input after entering command
    }
  };

  const executeCommand = (cmd) => {
    switch (cmd.toLowerCase()) {
      case "about":
        return "I'm a passionate frontend developer specializing in React and JavaScript!";
      case "skills":
        return "React, JavaScript, CSS, HTML, Node.js, Git, TypeScript, and more!";
      case "contact":
        return "You can reach me at my-email@example.com or on LinkedIn.";
      case "help":
        return "Commands: about, skills, contact, help";
      default:
        return `"${cmd}" is not a recognized command. Type 'help' for a list of commands.`;
    }
  };

  const textLine = (
    <span className="font-bold">
      <span className="text-primary-500">david@ubuntu</span>
      <span className="text-white">:</span>
      <span className="text-primary-500">~</span>
      <span className="text-white mr-2">$</span>
    </span>
  );

  return (
    <div className="code-font text-sm bg-black/10 h-full p-4 overflow-y-scroll">
      <div>
        {/* Displaying the welcome message without the prefix */}
        {output.map((entry, index) => (
          <div key={index}>
            {/* If it's the first entry, don't show the prefix for the welcome message */}
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
      <div className="flex items-center">
        <span>{textLine}</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleCommand}
          className="flex-1 bg-transparent border-none outline-none"
          placeholder="Type a command..."
        />
      </div>
    </div>
  );
};

const Console = () => {
  return <TabContent Content={ConsoleContent} />;
};

export default Console;
