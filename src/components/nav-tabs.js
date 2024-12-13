import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavTabs = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className=" bg-gray-900 text-xs col-start-2 col-span-2 flex">
      <Link
        to="/"
        className={`
          border-r border-gray-700 h-full px-3 
          ${isActive("/") ? "bg-gray-700" : "hover:bg-gray-800"}
        `}
      >
        <i className="material-icons-outlined text-sm p-1">html</i>
        About.xml
      </Link>
      <Link
        to="/experience"
        className={`
          border-r border-gray-700 h-full px-3 
          ${isActive("/experience") ? "bg-gray-700" : "hover:bg-gray-800"}
        `}
      >
        <i className="material-icons-outlined text-sm p-1">html</i>
        Experience.json
      </Link>
      <Link
        to="/skills"
        className={`
          border-r border-gray-700 h-full px-3 
          ${isActive("/skills") ? "bg-gray-700" : "hover:bg-gray-800"}
        `}
      >
        <i className="material-icons-outlined text-sm mr-2 p-1">css</i>
        Skills.py
      </Link>
    </nav>
  );
};

export default NavTabs;
