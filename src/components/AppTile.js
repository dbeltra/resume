import React from "react";
import BrowserIcon from "../assets/icons/apps/browser.png";
import CodeIcon from "../assets/icons/apps/code.png";
import TerminalIcon from "../assets/icons/apps/terminal.png";
import AdobeIcon from "../assets/icons/apps/adobe.png";
import MailIcon from "../assets/icons/apps/mail.png";
import SpotifyIcon from "../assets/icons/apps/spotify.png"; // Spotify brand asset

// App icons: Flaticon, free licence with attribution (see the credit link).
// Every app sits on the same rounded-square tile, like macOS/iOS.
// `img` sizes the artwork inside the tile so they all look equally big
// (the source PNGs have different padding and shapes).
export const APPS = {
  browser: { icon: BrowserIcon, tile: "bg-white", img: "h-[84%] w-[84%]" },
  code: { icon: CodeIcon, tile: "", img: "h-[119%] w-[119%] max-w-none" }, // crop its 5px margin
  term: {
    icon: TerminalIcon,
    tile: "bg-black",
    img: "h-[105%] w-[105%] max-w-none",
  },
  spotify: { icon: SpotifyIcon, tile: "bg-black", img: "h-[72%] w-[72%]" },
  pdf: { icon: AdobeIcon, tile: "", img: "h-[102%] w-[102%] max-w-none" },
  mail: { icon: MailIcon, tile: "bg-white", img: "h-[76%] w-[76%]" },
};

// size: tailwind classes for the tile box, e.g. "h-12 w-12 rounded-[11px]"
const AppTile = ({ app, size, tile = "", icon, img = "h-[70%] w-[70%]" }) => {
  const a = APPS[app] || { icon, tile, img };
  return (
    <span
      className={`flex flex-none items-center justify-center overflow-hidden shadow-[0_2px_6px_rgba(0,0,0,0.25),inset_0_0_0_0.5px_rgba(0,0,0,0.12)] ${size} ${a.tile}`}
    >
      <img src={a.icon} alt="" className={`object-contain ${a.img}`} />
    </span>
  );
};

export default AppTile;
