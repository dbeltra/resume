import React from "react";
import { Link } from "react-router-dom";

const NavTabs = () => {
  return (
    <nav className="flex bg-gray-900 text-xs rounded-tr-lg">
      <Link to="/" className="bg-gray-700 border-r border-gray-700 px-3 py-2">
        <i className="material-icons-outlined text-sm">html</i>About.html
      </Link>
      <Link to="/experience" className="border-r border-gray-700 px-3 py-2">
        <i className="material-icons-outlined text-sm mr-2">css</i>
        Experience.css
      </Link>
      <div className="border-r border-gray-700 px-3 py-2">
        <i className="material-icons-outlined text-sm mr-2">javascript</i>
        Education.js
      </div>
    </nav>
  );
};

export default NavTabs;
