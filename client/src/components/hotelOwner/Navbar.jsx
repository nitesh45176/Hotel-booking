import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import PlaceStayLogo from '../PlaceStayLogo'

const Navbar = () => {
  return (
    <div className='flex items-center justify-between p-6 border-b border-gray-600'>
       <Link to='/'>
         <PlaceStayLogo className='h-9 invert opacity-80'/>
       </Link>

       {/* <UserButton/> */}
    </div>
  )
}

export default Navbar
