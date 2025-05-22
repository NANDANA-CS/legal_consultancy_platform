import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Footer from '../../components/footer/Footer';
import LawyerLogin from './LawyerLogin';
import ClientLogin from './ClientLogin';
import Nav from '../../components/navbar/Nav';

const Login = () => {
  const [activeSection, setActiveSection] = useState('client')

  const toggleSection = (section) => {
    setActiveSection(section);
  };

  return (
    <>
      <ToastContainer />
      <Nav />
      <div className="bg-gray-800 text-white min-h-screen pt-24 mt-20">

        <section className="py-16 px-4 sm:px-6 lg:px-8 ">
          <div className="max-w-5xl mx-auto text-center">
            
            <h1 className="text-3xl font-bold mb-4">Login to LegaLead</h1>
            
          </div>
        </section>

 
        <section className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-8">
              <button
                onClick={() => toggleSection('lawyer')}
                className={`px-6 py-2 text-lg font-medium rounded-l-md ${
                  activeSection === 'lawyer'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Lawyer Login
              </button>
              <button
                onClick={() => toggleSection('client')}
                className={`px-6 py-2 text-lg font-medium rounded-r-md ${
                  activeSection === 'client'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Client Login
              </button>
            </div>

  
            <div className="space-y-4 mb-20">
              {activeSection === 'lawyer' && <LawyerLogin />}
              {activeSection === 'client' && <ClientLogin />}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}

export default Login