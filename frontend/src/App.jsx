import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import Home from './pages/home/Home'
import Footer from './components/footer/Footer'
import About from './pages/about/About'
import Contact from './pages/contacts/Contact'
import Term from './pages/terms/Term'

const App = () => {
  return (
    <>
      <BrowserRouter>
      
      <Routes>
        <Route path='/' Component={Home}/>
        <Route path='/about' Component={About}/>
        <Route path='/contact' Component={Contact}/>
        <Route path='/term' Component={Term}/>


      </Routes>  
      
      </BrowserRouter>
    </>
  )
}

export default App
