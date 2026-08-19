import React from 'react'
import logo from '../assets/founderFit-logo.png'
import { Compass, Heart, MessageSquare, Users } from 'lucide-react'
import { useClerk,useUser,UserButton } from '@clerk/clerk-react'

function Navbar() {
  const { openSignIn } = useClerk()
  const { user } = useUser()

  const navItems = [
    { label: 'Discover', icon: Compass, active: true },
    { label: 'Matches', icon: Heart, active: false },
    { label: 'Messages', icon: MessageSquare, active: false, badge: true },
    { label: 'Network', icon: Users, active: false },
  ]

  return (
    <>
      <header className='sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100'>
        <div className='relative max-w-6xl mx-auto px-6 h-24 md:h-28 flex items-center justify-between'>
          <img
            className='h-16 md:h-20 w-auto object-contain shrink-0'
            src={logo}
            alt='FounderFit'
          />

          <ul className='hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-gray-600 font-medium'>
            <li className='cursor-pointer hover:text-primary transition-colors'>Home</li>
            <li className='cursor-pointer hover:text-primary transition-colors'>Matches</li>
            <li className='cursor-pointer hover:text-primary transition-colors'>Messages</li>
            <li className='cursor-pointer hover:text-primary transition-colors'>Network</li>
          </ul>

        {!user ? (
          <button
            onClick={openSignIn}
            className='bg-primary text-white px-4 py-1.5 sm:px-7 sm:py-2 rounded-full text-sm sm:text-base font-medium cursor-pointer shadow-lg shadow-primary/30 shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/40 hover:brightness-110 active:scale-95'
          >
            Login
          </button>
        ) : (
          <UserButton />
        )}
        </div>
      </header>

      <nav className='md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 py-2 px-6 flex justify-between items-center z-50'>
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex flex-col items-center justify-center gap-1 relative ${
              item.active ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className='relative'>
              <item.icon className='w-6 h-6' />
            </div>
            <span className='text-xs font-medium'>{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  )
}

export default Navbar
