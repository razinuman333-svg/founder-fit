import Navbar from './componts/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import AddProfile from './pages/AddProfile'
import { Toaster } from "react-hot-toast";
import Network from './pages/Network'
import UserDetails from './pages/UserDetails'
import Matches from './pages/Matches'
import Message from './pages/Message'


function App() {
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
