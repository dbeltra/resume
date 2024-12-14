import React, { useState } from "react";
import Sidebar from "./components/sidebar";
import NavTabs from "./components/nav-tabs";
import Footer from "./components/footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [lineCount, setLineCount] = useState(0);

  return (
    <div className="bg-center justify-center items-center h-screen bg-gray-800 lg:bg-page-bg bg-cover lg:flex">
      <div className=" bg-gray-800/80 text-gray-200 lg:h-[80vh] lg:w-[80vw] lg:grid lg:grid-cols-[250px_1fr_1fr] lg:grid-rows-[35px_1fr_20px] lg:rounded-lg lg:overflow-hidden">
        <Sidebar></Sidebar>
        <NavTabs></NavTabs>
        <Outlet context={{ setLineCount }} />
        <Footer lineCount={lineCount} />
      </div>
    </div>
  );
};

export default Layout;
