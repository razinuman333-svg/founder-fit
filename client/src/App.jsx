import Navbar from './componts/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import AddProfile from './pages/AddProfile'
import { ToastContainer } from 'react-toastify'


function App() {
  return (
    <>
     <Navbar/>
     <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/add-profile' element={<AddProfile/>}/>
     </Routes>
    <ToastContainer />
    </>
  )
}

export default App
