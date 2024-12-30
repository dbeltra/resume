import { useState, useRef, useEffect } from "react";

export const useWindowPosition = (isMobile, isMaximized) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [previousPosition, setPreviousPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

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
  }, [isMaximized, isMobile]);

  const addNoSelectClass = () => {
    document.body.classList.add("no-select");
  };

  const removeNoSelectClass = () => {
    document.body.classList.remove("no-select");
  };

  const handleMouseDown = (e) => {
    if (isMobile || isMaximized) return;
    const isDragArea = e.target.closest(".drag-area");
    if (!isDragArea) return;

    e.preventDefault();

    isDragging.current = true;
    const rect = dragRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    document.body.style.cursor = "grabbing";
    addNoSelectClass();
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || isMobile || isMaximized) return;

    e.preventDefault();
    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (isMobile) return;
    isDragging.current = false;
    document.body.style.cursor = "auto";
    removeNoSelectClass();
  };

  useEffect(() => {
    return () => {
      removeNoSelectClass();
    };
  }, []);

  return {
    position,
    setPosition,
    previousPosition,
    setPreviousPosition,
    dragRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
