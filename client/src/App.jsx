import { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import Navbar from './componts/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import AddProfile from './pages/AddProfile'
import { Toaster } from "react-hot-toast";
import Network from './pages/Network'
import UserDetails from './pages/UserDetails'
import Matches from './pages/Matches'
import Message from './pages/Message'
import { useAuthStore } from './store/useAuthStore'
import { useChatStore } from './store/useChatStore'


function App() {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const checkAuth = useAuthStore((state) => state.checkAuth)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const clearChat = useChatStore((state) => state.clearChat)

  useEffect(() => {
    if (!isLoaded) return
    if (isSignedIn) checkAuth(getToken)
    else {
      clearAuth()
      clearChat()
    }
  }, [isLoaded, isSignedIn, getToken, checkAuth, clearAuth, clearChat])

  return (
    <>
     <Navbar/>
     <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/add-profile' element={<AddProfile/>}/>
      <Route path = '/network' element={<Network/>}/>
      <Route path='/user/:userId' element={<UserDetails/>}/>
      <Route path='/matches' element={<Matches/>}/>
      <Route path='/messages' element={<Message/>}/>
     </Routes>
    <Toaster/>
    </>
  )
}

export default App
