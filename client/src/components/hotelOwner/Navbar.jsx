import React from 'react'
import { Link } from 'react-router-dom'
import PlaceStayLogo from '../PlaceStayLogo'


const Navbar = () => {
    const isHomePage = location.pathname === "/";
  return (
    <div className='flex items-center justify-between p-6 border-b border-gray-600'>
       <Link to='/'>
         <PlaceStayLogo 
          isLandingPage={isHomePage}  // ✅ Changed from true to isHomePage
          className="h-16 w-auto cursor-pointer"
        />
       </Link>

       {/* <UserButton/> */}
    </div>
  )
}

export default Navbar
