import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./components/sidebar";
import NavTabs from "./components/nav-tabs";
import Footer from "./components/footer";
import { Outlet } from "react-router-dom";
import Button from "./components/button";
import ImgOops from "./assets/images/oops.webp";

const RestoreMessage = ({ onRestore }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-page-bg bg-cover bg-center">
    <div
      style={{
        backgroundColor: `rgb(31 41 55 / 50)`,
      }}
      className=" p-8 rounded-lg shadow-lg text-center"
    >
      <h2 className="text-xl text-gray-200 mb-4">
        Don't worry, everything is under control!
      </h2>
      <img
        className="mb-4"
        alt="Jack from Lost saying: We have to go back!"
        src={ImgOops}
      ></img>
      <Button onClick={onRestore} text="Restore window"></Button>
    </div>
  </div>
);

const Layout = () => {
  const [lineCount, setLineCount] = useState(0);
  const [selectedLine, setSelectedLine] = useState(1);
  const [bgOpacity, setBgOpacity] = useState(0.7);
  const [scale, setScale] = useState(100);
  const [fontFamily, setFontFamily] = useState("Roboto");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [previousPosition, setPreviousPosition] = useState({ x: 0, y: 0 });
  const [isWindowClosed, setIsWindowClosed] = useState(false);
  const dragRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const updateMobileState = () => {
    const isNowMobile = window.innerWidth < 1024;
    setIsMobile(isNowMobile);

    if (isNowMobile) {
      setPosition({ x: 0, y: 0 });
      setIsMinimized(false);
      setIsMaximized(false);
    }
  };

  useEffect(() => {
    updateMobileState();
    window.addEventListener("resize", updateMobileState);
    return () => window.removeEventListener("resize", updateMobileState);
  }, []);

  useEffect(() => {
    const centerWindow = () => {
      if (isMobile || isMaximized) return;
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
  }, [isMaximized]);

  const getScaleClass = (scaleValue) => {
    const scaleMap = {
      75: "scale-75",
      90: "scale-90",
      100: "scale-100",
    };
    return scaleMap[scaleValue] || "scale-100";
  };

  const handleMouseDown = (e) => {
    if (isMobile || isMaximized) return;
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
    if (!isDragging.current || isMobile || isMaximized) return;

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
    if (isMobile) return;
    setIsMinimized(!isMinimized);
  };

  const handleMaximize = () => {
    if (isMobile) return;

    if (!isMaximized) {
      setPreviousPosition(position);
      setPosition({ x: 0, y: 0 });
      setIsMaximized(true);
      setIsMinimized(false);
    } else {
      setPosition(previousPosition);
      setIsMaximized(false);
    }
  };

  const handleClose = () => {
    if (isMobile) return;
    setIsWindowClosed(true);
  };

  const handleRestore = () => {
    setIsWindowClosed(false);
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
  }, [isMobile, isMaximized]);

  if (isWindowClosed) {
    return <RestoreMessage onRestore={handleRestore} />;
  }

  return (
    <div className="bg-center justify-center items-center lg:h-screen bg-page-bg bg-cover">
      <div
        ref={dragRef}
        style={{
          backgroundColor: `rgb(31 41 55 / ${bgOpacity})`,
          fontFamily: fontFamily,
          position: isMobile ? "absolute" : "fixed",
          left: isMaximized ? "0" : `${position.x}px`,
          top: isMaximized ? "0" : `${position.y}px`,
          width: isMaximized ? "100%" : undefined,
          height: isMaximized ? "100%" : undefined,
        }}
        className={`
          z-10
          ${getScaleClass(scale)}
          origin-center 
          text-gray-200 
          w-full
          ${!isMaximized && "lg:w-[80vw]"}
          lg:grid 
          lg:grid-cols-[250px_1fr_1fr] 
          ${!isMaximized && "lg:rounded-lg"}
          lg:overflow-hidden
          ${isMobile ? "h-full" : ""}
          ${isMinimized && !isMobile ? "lg:grid-rows-[35px_0fr_25px]" : "lg:grid-rows-[35px_1fr_25px] lg:h-[80vh]"}
          ${isMaximized ? "!h-screen" : ""}
        `}
        onMouseDown={handleMouseDown}
      >
        <Sidebar
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onClose={handleClose}
          isMinimized={isMinimized}
          isMaximized={isMaximized}
        />
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
            isMaximized,
          }}
        />
        <Footer lineCount={lineCount} selectedLine={selectedLine} />
      </div>
    </div>
  );
};

export default Layout;
