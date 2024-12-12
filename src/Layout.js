import React from "react";
import Sidebar from "./components/sidebar";
import NavTabs from "./components/nav-tabs";
import Footer from "./components/footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="bg-center flex justify-center items-center h-screen bg-gray-800 bg-page-bg bg-cover">
      <div className=" bg-gray-800/80 text-gray-200 h-[80vh] w-[80vw] grid grid-cols-[250px_1fr_1fr] grid-rows-[35px_1fr_20px] rounded-lg overflow-hidden">
        <Sidebar></Sidebar>
        <NavTabs></NavTabs>
        <Outlet></Outlet>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default Layout;
