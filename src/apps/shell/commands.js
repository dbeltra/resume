// Fake shell for the Terminal app. Output is plain English on purpose:
// it's a shell, shells speak English.
import { CODE } from "../../data";

export const HINT =
  "try: sudo hire-me · git log · npm install david · rm -rf /";

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

export const NPM_STEPS = [
  "resolving dependencies: coffee@^4.0.0, curiosity@latest",
  "fetching 12 years of experience",
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
  if (cmd === "help") return { kind: "text", lines: [HINT] };
  if (/^sudo hire[- ]me$/.test(cmd)) return { kind: "sudo" };
  if (cmd.startsWith("sudo "))
    return {
      kind: "text",
      lines: [
        "david is not in the sudoers file. This incident will be reported.",
        HINT,
      ],
    };
  if (/^rm -(rf|fr) \/\*?$/.test(cmd)) return { kind: "rm" };
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
