import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation} from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import CharAvatar from "./CharAvatar";
import { LogOut } from "lucide-react";
import PlaceStayLogo from "./PlaceStayLogo";

const BookIcon = ()=> (
     <svg className="w-4 h-4 text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
    </svg>
)

const Navbar = () => {
  const ref = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const location = useLocation();
  const {user, navigate, isOwner, setShowHotelReg} = useAppContext();

  // ✅ Check if we're on home page
  const isHomePage = location.pathname === "/";

  // Create navLinks dynamically based on user login status
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/rooms" },
    ...(user ? [{ name: "My Bookings", path: "/my-bookings" }] : []),
    { name: "About", path: "/about" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== "/") {
        setIsScrolled(true);
      } else {
        setIsScrolled(window.scrollY > 10);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0  w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4"
          : "py-4 md:py-6"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <PlaceStayLogo 
          isLandingPage={isHomePage}  // ✅ Changed from true to isHomePage
          className="h-16 w-auto cursor-pointer"
        />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className={`group flex flex-col gap-0.5 ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
          >
            {link.name}
            <div
              className={`${
                isScrolled ? "bg-gray-700" : "bg-white"
              } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
            />
          </Link>
        ))}
        {user && (
          <button
            className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${
              isScrolled ? "text-black" : "text-white"
            } transition-all`} 
            onClick={() => isOwner ? navigate('/owner') : setShowHotelReg(true)}
          >
            {isOwner ? 'Dashboard' : 'List your hotel'}
          </button>
        )}
      </div>

      {/* Desktop Right */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <>
            <CharAvatar 
              fullName={user?.email}
              width="w-10"
              height="h-10"
              style="text-sm"
            />
            {/* ✅ Updated logout button with color change */}
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
              className={`flex items-center gap-2 cursor-pointer transition-colors duration-300 ${
                isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'
              }`}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </>
        ) : (
          <Link
            to='/login'
            className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500 cursor-pointer hover:bg-gray-900"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">
        <img
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          src={assets.menuIcon}
          alt=""
          className={`${isScrolled && "invert"} h-4`}
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={assets.closeIcon} alt="" className="h-6.5" />
        </button>

        {navLinks.map((link, i) => (
          <Link 
            key={i} 
            to={link.path} 
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-800 hover:text-gray-600 transition-colors"
          >
            {link.name}
          </Link>
        ))}

        {user && (
          <button
            className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer text-black transition-all"
            onClick={() => {
              isOwner ? navigate('/owner') : setShowHotelReg(true);
              setIsMenuOpen(false);
            }}
          >
            {isOwner ? 'Dashboard' : 'List your hotel'}
          </button>
        )}
        
        {!user && (
          <Link
            to='/login'
            className="bg-black text-white px-8 py-2.5 rounded-full ml-4 transition-all duration-500 cursor-pointer hover:bg-gray-900"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;