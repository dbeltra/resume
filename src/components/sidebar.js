import React from "react";
import { Link, useLocation } from "react-router-dom";
import ExpandableFolder from "./expandable-folder";
import { routesList } from "../routes";

const Sidebar = () => {
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
    <div className="row-span-2 px-4 py-2 lg:p-4">
      {/* Top Section */}
      <div className="flex items-center">
        <span className="bg-red-600 w-3 h-3 rounded-full mr-2"></span>
        <span className="bg-yellow-400 w-3 h-3 rounded-full mr-2"></span>
        <span className="bg-green-600 w-3 h-3 rounded-full mr-2"></span>
        <span>Resumé</span>
        <span className="lg:hidden pl-1">- David Beltrà</span>
      </div>

      {/* Navigation and Folders */}
      <div className="hidden lg:block">
        <div className="flex justify-between py-4">
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

        <div className="flex flex-col text-sm">
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
    </div>
  );
};

export default Sidebar;
