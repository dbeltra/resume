import React, { useState, useRef, useEffect } from "react";
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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const dragRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const updateMobileState = () => {
    const isNowMobile = window.innerWidth < 1024;
    setIsMobile(isNowMobile);

    if (isNowMobile) {
      setPosition({ x: 0, y: 0 }); // Move to the top-left corner
      setIsMinimized(false); // Ensure it’s not minimized
    }
  };

  useEffect(() => {
    updateMobileState();
    window.addEventListener("resize", updateMobileState);
    return () => window.removeEventListener("resize", updateMobileState);
  }, []);

  useEffect(() => {
    const centerWindow = () => {
      if (isMobile) return;
      if (dragRef.current) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const elementRect = dragRef.current.getBoundingClientRect();

        const centerX = (windowWidth - elementRect.width) / 2;
        const centerY = (windowHeight - elementRect.height) / 2;

        setPosition({ x: centerX, y: centerY });
      }
    };

    centerWindow();
    window.addEventListener("resize", centerWindow);
    return () => window.removeEventListener("resize", centerWindow);
  }, []);

  const getScaleClass = (scaleValue) => {
    const scaleMap = {
      75: "scale-75",
      90: "scale-90",
      100: "scale-100",
    };
    return scaleMap[scaleValue] || "scale-100";
  };

  const handleMouseDown = (e) => {
    if (isMobile) return; // Disable dragging on mobile
    const isDragArea = e.target.closest(".drag-area");
    if (!isDragArea) return;

    isDragging.current = true;
    const rect = dragRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    document.body.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || isMobile) return;

    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (isMobile) return;
    isDragging.current = false;
    document.body.style.cursor = "auto";
  };

  const handleMinimize = () => {
    if (isMobile) return; // Disable minimize on mobile
    setIsMinimized(!isMinimized);
  };

  useEffect(() => {
    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMobile]);

  return (
    <div className="bg-center justify-center items-center lg:h-screen bg-page-bg bg-cover">
      <div
        ref={dragRef}
        style={{
          backgroundColor: `rgb(31 41 55 / ${bgOpacity})`,
          fontFamily: fontFamily,
          position: isMobile ? "absolute" : "fixed",
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        className={`
          ${getScaleClass(scale)}
          origin-center 
          text-gray-200 
          w-full
          lg:w-[80vw] 
          lg:grid 
          lg:grid-cols-[250px_1fr_1fr] 
          lg:rounded-lg 
          lg:overflow-hidden
          transition-[grid-template-rows] 
          duration-200 
          ease-in-out
          ${isMobile ? "h-full" : ""}
          ${isMinimized && !isMobile ? "lg:grid-rows-[35px_0fr_25px]" : "lg:grid-rows-[35px_1fr_25px] lg:h-[80vh]"}
        `}
        onMouseDown={handleMouseDown}
      >
        <Sidebar onMinimize={handleMinimize} isMinimized={isMinimized} />
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
            isMinimized,
          }}
        />
        <Footer lineCount={lineCount} selectedLine={selectedLine} />
      </div>
    </div>
  );
};

export default Layout;
