import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const ExpandableFolder = ({ expanded = false, title, links }) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(expanded);

  const isActive = (path) => location.pathname === path;

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <div>
      <div
        className="flex items-center justify-start gap-3 p-1 cursor-pointer"
        onClick={toggleExpand}
      >
        <i
          className={`material-symbols-outlined transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}
        >
          chevron_right
        </i>
        <i
          className={
            isExpanded ? "material-symbols-outlined" : "material-symbols-filled"
          }
        >
          folder
        </i>{" "}
        {title}
      </div>
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ maxHeight: isExpanded ? "500px" : "0" }} // Fallback for unsupported tailwind
      >
        <div className="ml-9">
          {links.map(({ to, label, icon }) => (
            <Link
              key={label}
              to={to}
              className={`flex items-center justify-start gap-3 p-1 ${
                isActive(to) ? "bg-black/15" : "hover:bg-black/10"
              }`}
            >
              <i className={`material-symbols-outlined`}>{icon}</i> {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpandableFolder;
