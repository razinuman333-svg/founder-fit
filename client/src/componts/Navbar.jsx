import React from 'react'
import logo from '../assets/founderFit-logo.png' 
import { Compass, Heart, MessageSquare, Users } from 'lucide-react';
import {useClerk} from '@clerk/clerk-react'

function Navbar() {


  const {openSignIn} = useClerk()


  const navItems = [
    { label: 'Discover', icon: Compass, active: true },
    { label: 'Matches', icon: Heart, active: false },
    { label: 'Messages', icon: MessageSquare, active: false, badge: true },
    { label: 'Network', icon: Users, active: false },
  ];
  return (
    <>
    <div className='fixed top-0  z-50 w-full flex items-center justify-between px-12 md:px-9 lg:px-12 '>
      <img className='w-auto h-32' src={logo}/>


      <ul className='hidden md:flex text-gray-600 gap-5 '>
        <li>Home</li>
        <li>Matches</li>
        <li>Messages</li>
        <li>Network</li>
      </ul>


      <button onClick={openSignIn} className='bg-primary px-4 py-1 sm:px-7 sm:py-2 bg-primary
       rounded-full font-medium cursor-pointer'>login</button>

    </div>






<nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 py-2 px-6 flex justify-between items-center z-50">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex flex-col items-center justify-center space-y-1 relative ${
              item.active ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className="relative">
              <item.icon className="w-6 h-6" />
              {/* Optional notification badge */}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </nav>


</>



  )
}

export default Navbar
