import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Change navbar style when scrolled past 100 pixels
      const scrolled = window.scrollY > 200;
      setIsScrolled(scrolled);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out
        ${isScrolled 
          ? 'bg-black bg-opacity-90' 
          : 'bg-transparent'}
        py-4
      `}
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <div className="text-2xl font-bold">
          David Beltrà
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <a 
            href="#about" 
            className="hover:text-gray-300 transition-colors"
          >
            About
          </a>
          <a 
            href="#experience" 
            className="hover:text-gray-300 transition-colors"
          >
            Experience
          </a>
          <a 
            href="#skills" 
            className="hover:text-gray-300 transition-colors"
          >
            Skills
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
