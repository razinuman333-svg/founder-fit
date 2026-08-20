import React from 'react'
import Navbar from './componts/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import AddProfile from './pages/AddProfile'


function App() {
  return (
    <>
     <Navbar/>
     <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/add-profile' element={<AddProfile/>}/>
     </Routes>
    </>
  )
}

export default App
