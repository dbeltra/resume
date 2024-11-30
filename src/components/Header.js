import React from 'react';
import backgroundImage from '../assets/header-background.jpg';

const Header = () => {
    return (
      <header className="w-full h-screen relative flex items-center justify-center">
        {/* Background image that covers entire header https://unsplash.com/photos/a-black-and-white-photo-of-wavy-lines-Z6HQ0EhoD6g */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{
            backgroundImage: `url(${backgroundImage})`,
            filter: 'brightness(0.4)'
          }}
        ></div>
        
        <div className="relative z-10 text-left text-gray-100 w-screen">
            <div className="p-9">
                <div className="text-left animate-reveal">
                    <span className="header-small">I'm a </span>
                    <span className="header-big animate-underline"><span data-text="FULL-STACK">FULL-STACK</span></span>
                </div>
                <div className="text-right animate-reveal">
                    <span className="header-big animate-underline animate-underline-inverse"><span data-text="SOFTWARE">SOFTWARE</span> </span>
                </div>
                <div className="text-left animate-reveal">
                    <span className="header-big animate-underline"><span data-text="DEVELOPER">DEVELOPER</span></span>
                </div>
            </div>
        </div>
      </header>
    );
  };

export default Header
