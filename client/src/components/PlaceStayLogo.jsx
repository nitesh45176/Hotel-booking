import React, { useState, useEffect } from 'react';

const PlaceStayLogo = ({ isLandingPage = false, className = "" }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    if (isLandingPage) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isLandingPage]);

  // Determine if logo should be white (only on landing page when not scrolled)
  const shouldBeWhite = isLandingPage && !isScrolled;
  const textColor = shouldBeWhite ? "#FFFFFF" : "#2D3748";
  const accentColor = shouldBeWhite ? "#FFFFFF" : "#C945FF";

  return (
    <svg 
      viewBox="0 0 200 60" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transition: 'all 0.3s ease' }}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FF6B9D', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#C945FF', stopOpacity: 1 }} />
        </linearGradient>
        
        <linearGradient id="whiteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 0.95 }} />
          <stop offset="100%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Logo Icon - Location Pin with House */}
      <g transform="translate(10, 10)">
        {/* Location pin shape */}
        <path 
          d="M 20 5 C 12 5 5 12 5 20 C 5 28 20 40 20 40 C 20 40 35 28 35 20 C 35 12 28 5 20 5 Z" 
          fill={shouldBeWhite ? "url(#whiteGradient)" : "url(#logoGradient)"}
          style={{ transition: 'fill 0.3s ease' }}
        />
        
        {/* Inner house icon */}
        <path 
          d="M 20 12 L 14 17 L 14 26 L 26 26 L 26 17 Z M 20 12 L 20 20" 
          fill={shouldBeWhite ? "#5B21B6" : "white"}
          stroke={shouldBeWhite ? "#5B21B6" : "white"}
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ transition: 'all 0.3s ease' }}
        />
        
        {/* Door */}
        <rect 
          x="18" 
          y="21" 
          width="4" 
          height="5" 
          fill={shouldBeWhite ? "url(#whiteGradient)" : "url(#logoGradient)"}
          rx="0.5"
          style={{ transition: 'fill 0.3s ease' }}
        />
      </g>
      
      {/* Text "PlaceStay" */}
      <text 
        x="55" 
        y="38" 
        fontFamily="'Poppins', 'Segoe UI', 'Arial', sans-serif" 
        fontSize="24" 
        fontWeight="700" 
        fill={textColor}
        style={{ transition: 'fill 0.3s ease' }}
      >
        Place
        <tspan 
          fill={accentColor}
          style={{ transition: 'fill 0.3s ease' }}
        >
          Stay
        </tspan>
      </text>
    </svg>
  );
};

export default PlaceStayLogo;