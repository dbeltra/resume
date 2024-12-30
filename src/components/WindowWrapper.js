import React from "react";

export const WindowWrapper = ({
  dragRef,
  bgOpacity,
  fontFamily,
  isMobile,
  isMaximized,
  position,
  scale,
  isMinimized,
  handleMouseDown,
  children,
}) => {
  const getScaleClass = (scaleValue) => {
    const scaleMap = {
      75: "scale-75",
      90: "scale-90",
      100: "scale-100",
    };
    return scaleMap[scaleValue] || "scale-100";
  };

  return (
    <div
      ref={dragRef}
      style={{
        backgroundColor: `rgb(31 41 55 / ${bgOpacity})`,
        fontFamily: fontFamily,
        position: isMobile ? "relative" : "fixed",
        left: isMaximized ? "0" : `${position.x}px`,
        top: !isMinimized ? (isMaximized ? "0" : `${position.y}px`) : undefined,
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
        ${isMobile ? "h-max" : ""}
        ${isMinimized && !isMobile ? "grid-rows-[35px_0fr_25px] bottom-0" : "grid-rows-[35px_1fr_25px] h-[80vh]"}
        ${isMaximized ? "!h-screen" : ""}
      `}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
};
