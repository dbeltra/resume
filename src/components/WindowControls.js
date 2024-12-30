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
