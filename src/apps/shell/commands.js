// Fake shell for the Terminal app. Output is plain English on purpose:
// it's a shell, shells speak English.
import { CODE, SOURCES } from "../../data";

export const HINT = "type `help` to see what you can try";

// `help`: a few per group, the rest are left to discover
export const HELP = [
  [
    "files",
    [
      ["ls", "list David's files"],
      ["cat <file>", "print one, e.g. cat Agents.md"],
      ["open <file|app>", "open CV.pdf, spotify, claude…"],
    ],
  ],
  [
    "about",
    [
      ["neofetch", "David at a glance"],
      ["git log", "career history"],
      ["claude", "ask an agent about David"],
    ],
  ],
  [
    "try it",
    [
      ["sudo say-hi", "say hello the fast way"],
      ["npm install david", "add him to your project"],
      ["rm -rf /", "go on, it's not your machine"],
    ],
  ],
];

// the Vim commands that actually get you out
export const VIM_EXITS = [
  ":q",
  ":q!",
  ":wq",
  ":wq!",
  ":x",
  ":qa",
  ":qa!",
  ":wqa",
];

// one fake-but-stable 7-char hash per string
const hash = (s) => {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
};

export const gitLog = () => {
  const jobs = JSON.parse(CODE.experience);
  return [
    ...jobs.map((j, i) => ({
      hash: hash(j.company + j.dates),
      head: i === 0,
      msg: `feat: ${j.title} @ ${j.company}`,
      meta: `${j.dates} · ${j.stack.join(", ")}`,
    })),
    {
      hash: hash("init"),
      msg: 'init: console.log("hello world")',
      meta: "2014",
    },
  ];
};

const YEARS = new Date().getFullYear() - 2014;
const FILES = [
  ...SOURCES.map((s) => ({ id: s.id, file: s.file, body: CODE[s.id] })),
  { file: "CV.pdf", pdf: true, size: 84213 },
];
const HIDDEN = [".", "..", ".git", ".secret_side_projects"];
// `cat about`, `cat ./About.xml` and `cat about.xml` all find About.xml
const findFile = (arg) => {
  const a = arg.replace(/^\.\//, "").toLowerCase();
  return a && FILES.find((f) => [f.file.toLowerCase(), f.id].includes(a));
};
// what `open` accepts besides files, mapped to the dock's app ids
const APPS = {
  safari: "browser",
  browser: "browser",
  chrome: "browser",
  code: "code",
  vscode: "code",
  spotify: "spotify",
  mail: "mail",
  claude: "claude",
  preview: "pdf",
  trash: "trash",
};

export const NPM_STEPS = [
  "resolving dependencies: coffee@^4.0.0, curiosity@latest",
  `fetching ${new Date().getFullYear() - 2014} years of experience`,
  "linking python, rust, javascript",
  "building react@18 frontend",
  "compiling fastapi backend",
  "running postinstall: git commit -m 'ready to ship'",
];

export const RM_LINES = [
  "removed '/usr/bin/coffee'",
  "removed '/System/Library/Fonts/ComicSans.ttf'",
  "removed '/home/david/node_modules' (4.2 GB)",
  "removed '/home/david/.secret_side_projects'",
  "removed '/etc/hosts'",
  "removed '/boot/vmlinuz'",
  "rm: cannot remove '/': Device or resource busy… just kidding",
];

// what a typed command turns into; the Terminal renders each kind
export const parse = (raw) => {
  const cmd = raw.trim().replace(/\s+/g, " ");
  if (!cmd) return null;
  if (cmd === "clear") return { kind: "clear" };
  if (cmd === "help" || cmd === "man") return { kind: "help" };
  if (cmd === "claude") return { kind: "claude" };
  const [name, ...args] = cmd.split(" ");
  const arg = args.join(" ");
  const text = (...lines) => ({ kind: "text", lines });
  const file = findFile(arg);
  switch (name) {
    case "ls": {
      const all = /(^| )-\w*a/.test(arg);
      const names = [...(all ? HIDDEN : []), ...FILES.map((f) => f.file)];
      if (!/(^| )-\w*l/.test(arg)) return text(names.join("  "));
      return text(
        `total ${names.length}`,
        ...names.map((n) => {
          const f = FILES.find((x) => x.file === n);
          const size = String(f?.size ?? f?.body.length ?? 4096).padStart(6);
          return `${f ? "-rw-r--r--" : "drwx------"}  david  staff ${size}  ${n}`;
        }),
      );
    }
    case "cat":
    case "less":
    case "more":
      if (!arg) return text(`usage: ${name} <file>   (try: ls)`);
      if (/^\.secret/.test(arg))
        return text(
          "a CLI that names variables for you (abandoned at `x2`)",
          "a Rust rewrite of this site (abandoned at hello world)",
          "a plan to finish the above (abandoned)",
        );
      if (file?.pdf)
        return text("%PDF-1.7 ��ÿ�ÿ binary soup…", "try: open CV.pdf");
      return file
        ? text(...file.body.split("\n"))
        : text(`${name}: ${arg}: No such file or directory`);
    case "open":
      if (!arg) return text("usage: open <file|app>   (try: open CV.pdf)");
      if (file)
        return file.pdf
          ? { kind: "open", app: "pdf" }
          : { kind: "open", app: "code", tab: file.id };
      if (APPS[arg.toLowerCase()])
        return { kind: "open", app: APPS[arg.toLowerCase()] };
      return text(`The file ${arg} does not exist.`);
    case "cd":
      if (!arg || arg === "~" || arg === ".") return text();
      if (arg.startsWith("..") || arg === "/")
        return text("cd: nice try, the resume ends here");
      return text(`cd: not a directory: ${arg}`);
    case "pwd":
      return text("/Users/david/resume");
    case "whoami":
      return text("guest");
    case "echo":
      return text(arg.replace(/^["']|["']$/g, ""));
    case "date":
      return text(new Date().toString());
    case "uptime":
      return text(
        `up ${YEARS} years (since 2014), 1 user, load average: coffee, coffee, coffee`,
      );
    case "neofetch":
    case "fastfetch":
      return { kind: "neofetch" };
    case "history":
      return { kind: "history" };
    case "exit":
    case "logout":
      return { kind: "exit" };
    case "man":
      return arg === "david"
        ? text(
            "DAVID(1)                 User Commands                 DAVID(1)",
            "NAME",
            "    david - full stack developer, Barcelona",
            "SYNOPSIS",
            "    sudo say-hi [--loud] [--with-coffee]",
            "DESCRIPTION",
            "    Builds React frontends and Python/Rust backends. Ships",
            "    small diffs, reads the MR before approving it.",
            "BUGS",
            "    Will refactor your build script if left unattended.",
          )
        : text(`No manual entry for ${arg || "nothing"}. Try: man david`);
    case "ping":
      return text(
        `PING ${arg || "david"}: 56 data bytes`,
        "64 bytes from dbeltra@gmail.com: icmp_seq=0 time=<24h",
        "64 bytes from dbeltra@gmail.com: icmp_seq=1 time=<24h",
        "--- 0% packet loss, replies usually same day ---",
      );
    case "make":
      return text(
        `make: *** No rule to make target '${arg || "all"}'.  Stop.`,
        "try: npm install david",
      );
    default:
  }
  if (/^sudo say[- ]hi$/.test(cmd)) return { kind: "sudo" };
  if (cmd.startsWith("sudo "))
    return {
      kind: "text",
      lines: [
        "david is not in the sudoers file. This incident will be reported.",
        HINT,
      ],
    };
  if (/^rm -(rf|fr) \/\*?$/.test(cmd)) return { kind: "rm" };
  if (/^(n?vim?|vi)( |$)/.test(cmd)) return { kind: "vim" };
  if (/^git log( --oneline)?$/.test(cmd)) return { kind: "git" };
  if (/^npm (i|install) david$/.test(cmd)) return { kind: "npm" };
  if (/^npm (i|install)/.test(cmd))
    return {
      kind: "text",
      lines: ["npm ERR! 404 Not Found. Did you mean: npm install david"],
    };
  return {
    kind: "text",
    lines: [`zsh: command not found: ${cmd.split(" ")[0]}`, HINT],
  };
};

// Claude mode: which scripted run a typed question maps to (null = no idea)
const TOPICS = {
  frontend: /front|react|\bui\b|css|web|design/,
  backend: /back|api|python|rust|django|server/,
  agents: /agent|\bai\b|\bia\b|claude|llm|mcp/,
  whoami: /who|about|yourself|qui[eé]n|qui ets|david|hello|hi\b|hola/,
};
export const isExit = (raw) => /^\/?(exit|quit)$/.test(raw.trim());
export const ask = (raw) => {
  const q = raw.toLowerCase();
  return Object.keys(TOPICS).find((id) => TOPICS[id].test(q)) || null;
};

// Tab completion, zsh style. One match fills it in; several fill in what
// they share and come back as `options` to list under the prompt.
const COMMANDS = [
  "cat",
  "cd",
  "claude",
  "clear",
  "date",
  "echo",
  "exit",
  "git",
  "help",
  "history",
  "less",
  "ls",
  "make",
  "man",
  "more",
  "neofetch",
  "npm",
  "open",
  "ping",
  "pwd",
  "rm",
  "sudo",
  "uptime",
  "vim",
  "whoami",
];
const NAMES = FILES.map((f) => f.file);
const ARGS = {
  cat: [...NAMES, ".secret_side_projects"],
  less: NAMES,
  more: NAMES,
  vim: NAMES,
  open: [...NAMES, ...Object.keys(APPS)],
  man: ["david"],
  git: ["log"],
  npm: ["install david"],
  sudo: ["say-hi"],
  make: ["coffee"],
  ping: ["david"],
};
export const complete = (raw) => {
  const space = raw.indexOf(" ");
  const head = space < 0 ? "" : raw.slice(0, space + 1);
  const word = space < 0 ? raw : raw.slice(space + 1);
  const pool = space < 0 ? COMMANDS : ARGS[raw.slice(0, space)] || [];
  const hits = pool.filter((w) =>
    w.toLowerCase().startsWith(word.toLowerCase()),
  );
  if (!hits.length) return { value: raw, options: [] };
  if (hits.length === 1) return { value: `${head}${hits[0]} `, options: [] };
  let common = hits[0];
  for (const h of hits)
    while (!h.toLowerCase().startsWith(common.toLowerCase()))
      common = common.slice(0, -1);
  const value = head + (common.length > word.length ? common : word);
  return { value, options: value === raw ? hits : [] };
};
