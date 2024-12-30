import React from "react";

export const WindowControls = ({
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
}) => {
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

  return { handleMinimize, handleMaximize, handleClose };
};

const WindowControlButton = ({ color, onClick, disabled, icon }) => (
  <span
    className={`
      w-3 h-3 rounded-full mr-2 relative
      ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : `bg-${color} hover:opacity-80 ${onClick ? "cursor-pointer" : ""}`
      }
    `}
    onClick={disabled ? undefined : onClick}
  >
    <span
      className="material-symbols-outlined text-xs absolute -top-[0.15rem] left-0
     text-gray-800 opacity-0 group-hover:opacity-100"
    >
      {icon}
    </span>
  </span>
);

export default WindowControlButton;
