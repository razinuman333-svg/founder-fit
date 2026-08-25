import logo from '../assets/founderFit-logo.png'
import { Compass, Heart, MessageSquare, Users,UserCircle } from 'lucide-react'
import { useClerk,useUser,UserButton } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

function Navbar() {


  const { openSignIn } = useClerk()
  const { user } = useUser()
  const navigate = useNavigate()



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
            <li className='cursor-pointer hover:text-primary transition-colors' onClick={() => navigate('/')}>
              Home
            </li>
            <li className='cursor-pointer hover:text-primary transition-colors' onClick={() => navigate('/matches')}>
              Matches
            </li>
            <li className='cursor-pointer hover:text-primary transition-colors' onClick={() => navigate('/messages')}>
              Messages
            </li>
            <li className='cursor-pointer hover:text-primary transition-colors' onClick={() => navigate('/network')}>
              Network
            </li>
          </ul>

        {!user ? (
          <button
            onClick={openSignIn}
            className='bg-primary text-white px-4 py-1.5 sm:px-7 sm:py-2 rounded-full text-sm sm:text-base font-medium cursor-pointer shadow-lg shadow-primary/30 shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/40 hover:brightness-110 active:scale-95'
          >
            Login
          </button>
        ) : (
          <UserButton >
            <UserButton.MenuItems>
                 <UserButton.Link href='/add-profile' label='Add Profile' labelIcon={<UserCircle width={15}/>}/>
            </UserButton.MenuItems>
            
          </UserButton>
        )}
        </div>
      </header>

      <nav className='md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 py-2 px-6 flex justify-between items-center z-50'>
        <button
          onClick={() => navigate('/')}
          className='flex flex-col items-center justify-center gap-1 relative text-blue-600'
        >
          <div className='relative'>
            <Compass className='w-6 h-6' />
          </div>
          <span className='text-xs font-medium'>Home</span>
        </button>

        <button
          onClick={() => navigate('/matches')}
          className='flex flex-col items-center justify-center gap-1 relative text-gray-400 hover:text-gray-600'
        >
          <div className='relative'>
            <Heart className='w-6 h-6' />
          </div>
          <span className='text-xs font-medium'>Matches</span>
        </button>

        <button
          onClick={() => navigate('/messages')}
          className='flex flex-col items-center justify-center gap-1 relative text-gray-400 hover:text-gray-600'
        >
          <div className='relative'>
            <MessageSquare className='w-6 h-6' />
          </div>
          <span className='text-xs font-medium'>Messages</span>
        </button>

        <button
          onClick={() => navigate('/network')}
          className='flex flex-col items-center justify-center gap-1 relative text-gray-400 hover:text-gray-600'
        >
          <div className='relative'>
            <Users className='w-6 h-6' />
          </div>
          <span className='text-xs font-medium'>Network</span>
        </button>
      </nav>
    </>
  )
}

export default Navbar
