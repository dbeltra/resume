import React, { useState } from "react";
import Sidebar from "./components/sidebar";
import NavTabs from "./components/nav-tabs";
import Footer from "./components/footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [lineCount, setLineCount] = useState(0);
  const [selectedLine, setSelectedLine] = useState(1);
  const [bgOpacity, setBgOpacity] = useState(0.7);
  const [scale, setScale] = useState(100);
  const [fontFamily, setFontFamily] = useState("Roboto");

  // Map scale percentage to Tailwind scale classes
  const getScaleClass = (scaleValue) => {
    const scaleMap = {
      75: "scale-75",
      90: "scale-90",
      100: "scale-100",
    };
    return scaleMap[scaleValue] || "scale-100";
  };

  return (
    <div className="bg-center justify-center items-center h-screen bg-gray-800 lg:bg-page-bg bg-cover lg:flex">
      <div
        style={{
          backgroundColor: `rgb(31 41 55 / ${bgOpacity})`,
          fontFamily: fontFamily,
        }}
        className={`${getScaleClass(scale)} origin-center text-gray-200 lg:h-[80vh] lg:w-[80vw] lg:grid lg:grid-cols-[250px_1fr_1fr] lg:grid-rows-[35px_1fr_25px] lg:rounded-lg lg:overflow-hidden`}
      >
        <Sidebar />
        <NavTabs />
        <Outlet
          context={{
            lineCount,
            setLineCount,
            selectedLine,
            setSelectedLine,
            bgOpacity,
            setBgOpacity,
            scale,
            setScale,
            fontFamily,
            setFontFamily,
          }}
        />
        <Footer lineCount={lineCount} selectedLine={selectedLine} />
      </div>
    </div>
  );
};

export default Layout;
