import { parse, gitLog, ask, isExit, HELP, complete } from "./commands";

test("parses the easter-egg commands", () => {
  expect(parse("  sudo   say-hi ").kind).toBe("sudo");
  expect(parse("rm -rf /").kind).toBe("rm");
  expect(parse("rm -fr /*").kind).toBe("rm");
  expect(parse("git log --oneline").kind).toBe("git");
  expect(parse("npm i david").kind).toBe("npm");
  expect(parse("clear").kind).toBe("clear");
  for (const v of ["vim", "vi", "nvim", "vim Agents.md"])
    expect(parse(v).kind).toBe("vim");
  expect(parse("vimtutor").kind).toBe("text");
  expect(parse("")).toBeNull();
  expect(parse("lsd").lines[0]).toBe("zsh: command not found: lsd");
});

test("git log starts at HEAD with the current job and ends at init", () => {
  const log = gitLog();
  expect(log[0].head).toBe(true);
  expect(log[0].msg).toContain("011h");
  expect(log[log.length - 1].msg).toContain("init");
  expect(new Set(log.map((c) => c.hash)).size).toBe(log.length);
});

test("claude mode: enter, route questions, exit", () => {
  expect(parse("claude").kind).toBe("claude");
  expect(ask("show me your frontend work")).toBe("frontend");
  expect(ask("any Rust?")).toBe("backend");
  expect(ask("how do you use agents?")).toBe("agents");
  expect(ask("who are you?")).toBe("whoami");
  expect(ask("¿quién eres?")).toBe("whoami");
  expect(ask("best pizza in town")).toBeNull();
  expect(isExit("/exit")).toBe(true);
  expect(isExit("exit")).toBe(true);
  expect(isExit("exit now")).toBe(false);
});

test("file commands read the site's own files", () => {
  expect(parse("ls").lines[0]).toContain("Agents.md");
  expect(parse("ls").lines[0]).not.toContain(".secret");
  expect(parse("ls -la").lines.join()).toContain(".secret_side_projects");
  expect(parse("cat about").lines.join("\n")).toContain("David Beltrà");
  expect(parse("cat ./agents.md").kind).toBe("text");
  expect(parse("cat nope.txt").lines[0]).toMatch(/No such file/);
  expect(parse("open CV.pdf")).toEqual({ kind: "open", app: "pdf" });
  expect(parse("open Experience.json")).toEqual({
    kind: "open",
    app: "code",
    tab: "experience",
  });
  expect(parse("open spotify")).toEqual({ kind: "open", app: "spotify" });
  expect(parse("cd").lines).toEqual([]);
  expect(parse("history").kind).toBe("history");
  expect(parse("exit").kind).toBe("exit");
});

test("help lists only commands that work", () => {
  expect(parse("help").kind).toBe("help");
  for (const [, rows] of HELP)
    for (const [c] of rows) {
      const out = parse(c.replace(/ <.*>$/, " Agents.md"));
      expect(out.lines?.[0] ?? "").not.toMatch(/command not found/);
    }
});

test("tab completes commands, files and apps", () => {
  expect(complete("neo").value).toBe("neofetch ");
  expect(complete("cat ag").value).toBe("cat Agents.md ");
  expect(complete("open sp").value).toBe("open spotify ");
  expect(complete("sudo s").value).toBe("sudo say-hi ");
  // several matches: fill in the shared part, then list them
  expect(complete("c")).toEqual({
    value: "c",
    options: ["cat", "cd", "claude", "clear"],
  });
  expect(complete("cl")).toEqual({ value: "cl", options: ["claude", "clear"] });
  expect(complete("open C")).toEqual({
    value: "open C",
    options: ["Contact.rs", "CV.pdf", "chrome", "code", "claude"],
  });
  expect(complete("he").value).toBe("help ");
  expect(complete("xyz")).toEqual({ value: "xyz", options: [] });
  expect(complete("pwd x")).toEqual({ value: "pwd x", options: [] });
});
