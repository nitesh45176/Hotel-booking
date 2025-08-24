import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='flex items-center justify-between p-6 border-b border-gray-600'>
       <Link to='/'>
         <img src={assets.logo} alt="logo" className='h-9 invert opacity-80'/>
       </Link>

       {/* <UserButton/> */}
    </div>
  )
}

export default Navbar
