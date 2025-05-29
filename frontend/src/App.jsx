import React from 'react'
import 'react-toastify/dist/ReactToastify.css'
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

import Cases from './pages/cases/Cases'
import Profile from './pages/profile/Profile'
import LawyerDetails from './pages/lawyer/LawyerDetails'
import Lawyers from './pages/lawyer/Lawyer'
import Editprofile from './pages/profile/Editprofile'
import LawyerDashboard from './pages/dashboard/Lawyerdashboard'
import ClientDashboard from './pages/dashboard/Clientdashboard'
import Consultation from './pages/consultation/Consultation'
import Appoinments from './pages/Appoinments/Appoinments'
import Myappoinments from './pages/Appoinments/Myappoinments'


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
          <Route path='/clientsignup' Component={Clientsignup} />
          <Route path='/lawyers' Component={Lawyers} />
          <Route path="/lawyersdet/:id" Component={LawyerDetails} />

          <Route path='/profile' Component={Profile} />
          <Route path='/editprofile' Component={Editprofile} />

          <Route path='/cases' Component={Cases} />
          <Route path="/lawyers/:id/consultation" Component={Consultation} />
          <Route path='/appoinments' Component={Appoinments}/>
          <Route path='/myappoinments' Component={Myappoinments}/>
          <Route path='/lawyerdashboard' Component={LawyerDashboard} />
          <Route path='/clientdashboard' Component={ClientDashboard} />

        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
