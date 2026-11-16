import { parse, gitLog, ask, isExit } from "./commands";

test("parses the easter-egg commands", () => {
  expect(parse("  sudo   hire-me ").kind).toBe("sudo");
  expect(parse("rm -rf /").kind).toBe("rm");
  expect(parse("rm -fr /*").kind).toBe("rm");
  expect(parse("git log --oneline").kind).toBe("git");
  expect(parse("npm i david").kind).toBe("npm");
  expect(parse("clear").kind).toBe("clear");
  for (const v of ["vim", "vi", "nvim", "vim Agents.md"])
    expect(parse(v).kind).toBe("vim");
  expect(parse("vimtutor").kind).toBe("text");
  expect(parse("")).toBeNull();
  expect(parse("ls").lines[0]).toBe("zsh: command not found: ls");
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
