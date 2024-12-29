import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import NavTabs from "./components/NavTabs";
import Footer from "./components/Footer";
import { RestoreMessage } from "./components/RestoreMessage";
import { WindowWrapper } from "./components/WindowWrapper";
import { WindowControls } from "./components/WindowControls";
import { useWindowPosition } from "./hooks/useWindowPosition";
import { useResponsive } from "./hooks/useResponsive";

const Layout = () => {
  // Window state
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isWindowClosed, setIsWindowClosed] = useState(false);

  // Content state
  const [lineCount, setLineCount] = useState(0);
  const [selectedLine, setSelectedLine] = useState(1);
  const [bgOpacity, setBgOpacity] = useState(0.7);
  const [scale, setScale] = useState(100);
  const [fontFamily, setFontFamily] = useState("Roboto");

  const { isMobile } = useResponsive();

  const {
    position,
    setPosition,
    previousPosition,
    setPreviousPosition,
    dragRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useWindowPosition(isMobile, isMaximized);

  const windowControls = WindowControls({
    isMinimized,
    setIsMinimized,
    isMaximized,
    setIsMaximized,
    setIsWindowClosed,
    isMobile,
    position,
    setPosition,
    previousPosition,
    setPreviousPosition,
  });

  useEffect(() => {
    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMobile, isMaximized, handleMouseMove, handleMouseUp]);

  if (isWindowClosed) {
    return <RestoreMessage onRestore={() => setIsWindowClosed(false)} />;
  }

  return (
    <div className="bg-center justify-center items-center lg:h-screen bg-page-bg bg-cover">
      <WindowWrapper
        dragRef={dragRef}
        bgOpacity={bgOpacity}
        fontFamily={fontFamily}
        isMobile={isMobile}
        isMaximized={isMaximized}
        position={position}
        scale={scale}
        isMinimized={isMinimized}
        handleMouseDown={handleMouseDown}
      >
        <Sidebar
          onMinimize={windowControls.handleMinimize}
          onMaximize={windowControls.handleMaximize}
          onClose={windowControls.handleClose}
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
      </WindowWrapper>
    </div>
  );
};

export default Layout;
