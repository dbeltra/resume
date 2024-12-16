import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavTabs = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className=" bg-gray-900 text-xs col-start-2 col-span-2 flex lg:h-full h-8">
      <Link
        to="/"
        className={`
          border-r border-gray-700 h-full px-3 flex items-center
          ${isActive("/") ? "bg-gray-700" : "hover:bg-gray-800"}
        `}
      >
        <span className="">About.xml</span>
      </Link>
      <Link
        to="/experience"
        className={`
          border-r border-gray-700 h-full px-3 flex items-center
          ${isActive("/experience") ? "bg-gray-700" : "hover:bg-gray-800"}
        `}
      >
        <span className="">Experience.json</span>
      </Link>
      <Link
        to="/skills"
        className={`
          border-r border-gray-700 h-full px-3 flex items-center
          ${isActive("/skills") ? "bg-gray-700" : "hover:bg-gray-800"}
        `}
      >
        <span className="">Skills.py</span>
      </Link>
      <Link
        to="/contact"
        className={`
          border-r border-gray-700 h-full px-3 flex items-center
          ${isActive("/contact") ? "bg-gray-700" : "hover:bg-gray-800"}
        `}
      >
        <span className="">Contact.rs</span>
      </Link>
    </nav>
  );
};

export default NavTabs;
