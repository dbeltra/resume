import React from "react";
import "highlight.js/styles/nnfx-dark.css";
import Sidebar from "./components/sidebar";
import NavTabs from "./components/nav-tabs";
import Footer from "./components/footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const education = [
    {
      degree: "Multimedia Degree",
      mention: "Interactive Aplication development specialization.",
      school: "Universitat Oberta de Catalunya (UOC)",
    },
  ];

  const skills = {
    technical: [
      "Python",
      "Rust",
      "Javascript",
      "Django",
      "Backbone",
      "React",
      "Docker",
      "Github",
    ],
    soft: ["Communication", "Teamwork", "Problem Solving"],
  };

  return (
    <div className="bg-center flex justify-center items-center md:h-screen bg-gray-800 md:bg-page-bg bg-cover ">
      <div className="md:mx-20 xl:m-40 bg-gray-800/80 rounded-t-lg text-gray-200 flex relative flex-col lg:flex-row">
        <div className="w-full md:w-60 p-2 md:py-4 md:px-6">
          <Sidebar></Sidebar>
        </div>
        <div className=" bg-gray-800 rounded-tr-lg">
          <NavTabs></NavTabs>
          <Outlet></Outlet>
        </div>
        <div className="absolute -bottom-5 w-full ">
          <Footer></Footer>
        </div>
      </div>
    </div>
  );
};

export default Layout;
