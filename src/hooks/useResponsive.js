import { useState, useEffect } from "react";

export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const updateMobileState = () => {
    const isNowMobile = window.innerWidth < 1024;
    setIsMobile(isNowMobile);
    return isNowMobile;
  };

  useEffect(() => {
    updateMobileState();
    window.addEventListener("resize", updateMobileState);
    return () => window.removeEventListener("resize", updateMobileState);
  }, []);

  return { isMobile, updateMobileState };
};
