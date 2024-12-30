import React from "react";
import { Link, useLocation } from "react-router-dom";
import ExpandableFolder from "./ExpandableFolder";
import { routesList } from "../routes";

const WindowControl = ({ color, onClick, disabled, icon }) => (
  <span
    className={`
      w-3 h-3 rounded-full mr-2 relative
      ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : `bg-${color} hover:opacity-80 ${onClick ? "cursor-pointer" : ""}`
      }
    `}
    onClick={disabled ? undefined : onClick}
  >
    <span
      className="material-symbols-outlined text-xs absolute -top-[0.15rem] left-0
     text-gray-800 opacity-0 group-hover:opacity-100"
    >
      {icon}
    </span>
  </span>
);

const Sidebar = ({
  onMinimize,
  onMaximize,
  onClose,
  isMinimized,
  isMaximized,
}) => {
  const { pathname } = useLocation();

  const navLinks = [
    { to: "/files", icon: "folder" },
    { to: "/search", icon: "search" },
    { to: "/widgets", icon: "widgets" },
    { to: "/settings", icon: "settings" },
  ];

  const folders = [
    {
      title: ".git",
      links: [{ to: "/files", label: "index", icon: "description" }],
    },
    {
      title: "public",
      links: [
        { to: "/files", label: "index.html", icon: "code" },
        { to: "/files", label: "favicon.ico", icon: "star" },
        { to: "/files", label: "manifest.json", icon: "data_object" },
        { to: "/files", label: "robots.txt", icon: "description" },
      ],
    },
    {
      title: "src",
      expanded: true,
      links: routesList.map((route) => ({
        to: route.path,
        label: route.title,
        icon: route.icon,
      })),
    },
  ];

  return (
    <div className="px-4 mt-2 lg:mt-0">
      {/* Top Section */}
      <div className="flex items-center drag-area h-full">
        <div className="flex items-center group">
          <WindowControl color="red-600" onClick={onClose} icon="close" />
          <WindowControl
            color="yellow-400"
            onClick={onMinimize}
            disabled={isMaximized}
            icon={isMaximized ? "" : "remove"}
          />
          <WindowControl
            color="green-600"
            onClick={onMaximize}
            icon={isMaximized ? "collapse_content" : "expand_content"}
          />
        </div>
        <span>Resumé</span>
        <span className="lg:hidden pl-1">- David Beltrà</span>
      </div>

      {/* Only show the rest of the sidebar if not minimized */}
      {!isMinimized && (
        <div className="mt-2 lg:mt-0">
          <div className="flex justify-between py-2 lg:py-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`material-symbols-filled ${
                  pathname.startsWith(link.to) ? "text-primary" : ""
                }`}
              >
                {link.icon}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex flex-col text-sm">
            <div className="flex items-center gap-3 p-1">
              <i className="material-symbols-filled">folder</i>
              <b>Resumé</b>
            </div>
            {folders.map(({ title, links, expanded }) => (
              <ExpandableFolder
                key={title}
                title={title}
                expanded={expanded}
                links={links}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
