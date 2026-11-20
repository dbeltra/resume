// Contents of the joke files in the Trash, shown in Quick Look.
// File contents stay in English: they're "files".
import MdIcon from "../assets/icons/apps/doc-md.svg";
import TxtIcon from "../assets/icons/apps/doc-txt.svg";
import PdfIcon from "../assets/icons/apps/doc-pdf.svg";

export const TRASH_FILES = [
  {
    name: "TODO_final_FINAL_v3.txt",
    icon: TxtIcon,
    body: `[x] learn Python
[x] learn Rust (the borrow checker won, then I did)
[x] ship React + FastAPI to production
[x] write tests before the bug report, not after
[ ] stop renaming files to _final
[ ] finish one side project`,
  },
  {
    name: "resume_2014.pdf",
    icon: PdfIcon,
    body: `DAVID BELTRÀ: WEB DEVELOPER (junior, very)

Skills
  • jQuery (expert)
  • Internet Explorer 8 compatibility
  • Microsoft Word
  • FTP straight to production

Objective
  Learn everything. (Still on it.)`,
  },
  {
    name: "tabs-vs-spaces.md",
    icon: MdIcon,
    body: `# Tabs vs spaces

Decision: spaces. Two of them.
Enforced by .prettierrc, so nobody has to argue again.

Status: closed (won't fix)`,
  },
  {
    name: "passwords.txt",
    icon: TxtIcon,
    body: `david123

…just kidding. Nice try.
Real secrets live in a password manager, not in the Trash.`,
  },
];
