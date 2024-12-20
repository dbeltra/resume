import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../routes";

const NavTabs = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const fileRoutes = Object.values(ROUTES).filter((route) =>
    route.path.startsWith("/files/"),
  );

  return (
    <nav className="bg-gray-900 text-xs col-start-2 col-span-2 flex lg:h-full h-8">
      {fileRoutes.map((route) => (
        <Link
          key={route.path}
          to={route.path}
          className={`
            border-r border-gray-700 h-full px-3 flex items-center
            ${isActive(route.path) ? "bg-gray-700" : "hover:bg-gray-800"}
          `}
        >
          <span>{route.title}</span>
        </Link>
      ))}
    </nav>
  );
};

export default NavTabs;
