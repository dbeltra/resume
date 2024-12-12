import React from "react";
import { Link } from "react-router-dom";

const NavTabs = () => {
  return (
    <nav className=" bg-gray-900 text-xs col-start-2 col-span-2 flex">
      <Link
        to="/"
        className="bg-gray-700 border-r border-gray-700 h-full px-3 py-2"
      >
        <i className="material-icons-outlined text-sm p-1">html</i>
        About.xml
      </Link>
      <Link
        to="/experience"
        className="border-r border-gray-700 h-full px-3 py-2"
      >
        <i className="material-icons-outlined text-sm mr-2 p-1">css</i>
        Experience.json
      </Link>
      <div className="border-r border-gray-700 px-3 h-full py-2">
        <i className="material-icons-outlined text-sm mr-2 p-1">javascript</i>
        Education.js
      </div>
    </nav>
  );
};

export default NavTabs;
