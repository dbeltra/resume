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
    <div className="bg-center flex justify-center items-center h-screen bg-gray-800 bg-page-bg bg-cover">
      <div className=" bg-gray-800/80 text-gray-200 h-[80vh] w-[80vw] grid grid-cols-[250px_1fr_1fr] grid-rows-[50px_1fr_20px] rounded-xl overflow-hidden">
        <Sidebar></Sidebar>
        <NavTabs></NavTabs>
        <Outlet></Outlet>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default Layout;
