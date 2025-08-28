import React, { useState, useEffect } from 'react';

const PlaceStayLogo = ({ isLandingPage = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // Change color after scrolling 50px
    };

    // Only add scroll listener on landing page
    if (isLandingPage) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isLandingPage]);

  // Determine if logo should be white (only on landing page when not scrolled)
  const shouldBeWhite = isLandingPage && !isScrolled;

  return (
    <div 
      className="inline-flex items-center gap-4 cursor-pointer transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Icon Container */}
      <div className="relative">
        <div className={`w-12 h-12 ${shouldBeWhite
          ? 'bg-gradient-to-br from-orange-500 to-pink-500' 
          : 'bg-gradient-to-br from-gray-700 to-black'
        } rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${isHovered ? 'rotate-12 scale-110' : ''}`}>
          {/* Location Pin with Animation */}
          <div className="relative">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              className={`text-white transition-all duration-300 ${isHovered ? 'scale-125' : ''}`}
            >
              <path 
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
                fill="currentColor"
                className="animate-pulse"
              />
              <circle cx="12" cy="9" r="2.5" fill="white" />
            </svg>
            
            {/* Ripple Effect */}
            <div className={`absolute -top-1 -left-1 w-6 h-6 border-2 border-white rounded-full transition-all duration-1000 ${isHovered ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`}></div>
          </div>
        </div>
        
        {/* Floating Dots Animation */}
        <div className="absolute -top-1 -right-1">
          <div className={`w-3 h-3 ${shouldBeWhite ? 'bg-yellow-400' : 'bg-gray-500'} rounded-full transition-all duration-700 ${isHovered ? 'translate-y-2 opacity-0' : ''}`}></div>
        </div>
        <div className="absolute -bottom-1 -left-1">
          <div className={`w-2 h-2 ${shouldBeWhite ? 'bg-orange-300' : 'bg-gray-600'} rounded-full transition-all duration-500 delay-100 ${isHovered ? '-translate-y-2 opacity-0' : ''}`}></div>
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <div className={`text-3xl font-bold transition-colors duration-300 ${shouldBeWhite ? 'text-white' : 'text-black'}`}>
          Place
          <span className={`inline-block transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
            Stay
          </span>
        </div>
        
        {/* Animated Underline */}
        <div className={`h-0.5 transition-all duration-300 ${
          shouldBeWhite
            ? 'bg-gradient-to-r from-orange-400 to-pink-400' 
            : 'bg-gradient-to-r from-gray-600 to-black'
        } ${isHovered ? 'w-full' : 'w-0'}`}></div>
      </div>
    </div>
  );
};

export default PlaceStayLogo;