import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="row-span-2 p-4">
      <div className="flex items-center">
        <span className="bg-red-600 w-3 h-3 rounded-full mr-2"></span>
        <span className="bg-yellow-400 w-3 h-3 rounded-full mr-2"></span>
        <span className="bg-green-600 w-3 h-3 rounded-full mr-3"></span>
        <span>Resumé</span>
      </div>
      <div className="flex justify-between py-4">
        <i className="material-icons text-primary">folder</i>
        <i className="material-icons">search</i>
        <i className="material-icons">widgets</i>
        <i className="material-icons">settings</i>
      </div>
      <div className="flex flex-col text-sm">
        <div className="flex items-center justify-start gap-3 p-1">
          <i className="material-icons-outlined">folder</i>
          <b>Resumeé</b>
        </div>
        <div className="flex items-center justify-start gap-3 p-1">
          <i className="material-icons">chevron_right</i>
          <i className="material-icons">folder</i> .github
        </div>
        <div className="flex items-center justify-start gap-3 p-1">
          <i className="material-icons">chevron_right</i>
          <i className="material-icons">folder</i> node_modules
        </div>
        <div className="flex items-center justify-start gap-3 p-1">
          <i className="material-icons rotate-90">chevron_right</i>
          <i className="material-icons-outlined">folder</i> src
        </div>
        <Link
          to="/"
          className={`flex items-center justify-start gap-3 p-1 ${isActive("/") ? "bg-gray-500" : "hover:bg-gray-600"}`}
        >
          <i className="material-icons opacity-0">chevron_right</i>
          <i className="material-icons-outlined">description</i> About.html
        </Link>
        <Link
          to="/experience"
          className={`flex items-center justify-start gap-3 p-1 ${isActive("/experience") ? "bg-gray-500" : "hover:bg-gray-600"}`}
        >
          <i className="material-icons opacity-0">chevron_right</i>
          <i className="material-icons-outlined">description</i> Experience.css
        </Link>
        <Link
          to="/skills"
          className={`flex items-center justify-start gap-3 p-1 ${isActive("/skills") ? "bg-gray-500" : "hover:bg-gray-600"}`}
        >
          <i className="material-icons opacity-0">chevron_right</i>
          <i className="material-icons-outlined">description</i> Skills.py
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
