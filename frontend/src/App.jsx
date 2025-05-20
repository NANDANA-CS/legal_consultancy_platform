import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'

const App = () => {
  return (
    <>
      <BrowserRouter>
      <Routes>

        <Route path='/' Component={Navbar}/>


      </Routes>  
      </BrowserRouter>
    </>
  )
}

export default App
