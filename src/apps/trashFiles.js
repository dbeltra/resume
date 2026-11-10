// Contents of the joke files in the Trash, shown in Quick Look.
// File contents stay in English: they're "files".
import FileIcon from "../assets/icons/apps/file.png";
import PdfIcon from "../assets/icons/apps/pdf.png";

export const TRASH_FILES = [
  {
    name: "TODO_final_FINAL_v3.txt",
    icon: FileIcon,
    body: `[x] learn Python
[x] learn Rust (the borrow checker won, then I did)
[x] ship React + FastAPI to production
[x] write tests before the bug report, not after
[ ] stop renaming files to _final
[ ] get hired by you`,
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
    icon: FileIcon,
    body: `# Tabs vs spaces

Decision: spaces. Two of them.
Enforced by .prettierrc, so nobody has to argue again.

Status: closed (won't fix)`,
  },
  {
    name: "passwords.txt",
    icon: FileIcon,
    body: `david123

…just kidding. Nice try.
Real secrets live in a password manager, not in the Trash.`,
  },
];
