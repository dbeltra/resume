import React from "react";
import ExpandableFolder from "./expandable-folder";

const Sidebar = () => {
  return (
    <div className="row-span-2 px-4 py-2 lg:p-4">
      <div className="flex items-center">
        <span className="bg-red-600 w-3 h-3 rounded-full mr-2"></span>
        <span className="bg-yellow-400 w-3 h-3 rounded-full mr-2"></span>
        <span className="bg-green-600 w-3 h-3 rounded-full mr-3"></span>
        <span>Resumé </span>
        <span className="lg:hidden pl-1">- David Beltrà</span>
      </div>
      <div className="hidden lg:block">
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
          <ExpandableFolder
            key={"git"}
            title=".git"
            links={[{ to: "", label: "index", icon: "description" }]}
          />
          <ExpandableFolder
            key={"public"}
            title="public"
            links={[
              { to: "", label: "index.html", icon: "description" },
              { to: "", label: "favicon.ico", icon: "description" },
              { to: "", label: "manifest.json", icon: "description" },
              { to: "", label: "robots.txt", icon: "description" },
            ]}
          />
          <ExpandableFolder
            key={"src"}
            expanded={true}
            title="src"
            links={[
              { to: "/", label: "About.xml", icon: "description" },
              {
                to: "/experience",
                label: "Experience.json",
                icon: "description",
              },
              { to: "/skills", label: "Skills.py", icon: "description" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
