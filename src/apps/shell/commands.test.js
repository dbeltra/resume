import { parse, gitLog } from "./commands";

test("parses the easter-egg commands", () => {
  expect(parse("  sudo   hire-me ").kind).toBe("sudo");
  expect(parse("rm -rf /").kind).toBe("rm");
  expect(parse("rm -fr /*").kind).toBe("rm");
  expect(parse("git log --oneline").kind).toBe("git");
  expect(parse("npm i david").kind).toBe("npm");
  expect(parse("clear").kind).toBe("clear");
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
