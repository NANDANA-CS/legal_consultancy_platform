import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import Home from './pages/home/Home'
import Footer from './components/footer/Footer'
import About from './pages/about/About'
import Contact from './pages/contacts/Contact'
import LawyerLogin from './pages/login/LawyerLogin'
import ClientLogin from './pages/login/ClientLogin'
import Login from './pages/login/Login'
import LawyerSignup from './pages/signup/Lawyersignup'
import Clientsignup from './pages/signup/Clientsignup'
import Lawyer from './pages/lawyer/Lawyer'
import Cases from './pages/cases/Cases'
import Lawyerprofile from './pages/profile/Lawyerprofile'


const App = () => {
  return (
    <>
      <BrowserRouter>

        <Routes>
          <Route path='/' Component={Home} />
          <Route path='/about' Component={About} />
          <Route path='/contact' Component={Contact} />
          <Route path='/lawyerlogin' Component={LawyerLogin} />
          <Route path='/ClientLogin' Component={ClientLogin} />
          <Route path='/login' Component={Login} />
          <Route path='/lawyersignup' Component={LawyerSignup} />
          <Route path='/clientsignup' Component={Clientsignup}/>
          <Route path='/lawyers' Component={Lawyer}/>
          <Route path='/profile' Component={Lawyerprofile}/>
          <Route path='/cases' Component={Cases}/>
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
