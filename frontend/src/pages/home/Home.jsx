import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/footer/Footer';
import Navbar from '../../components/navbar/Navbar';

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          name: decoded.name || decoded.email || 'User',
          role: decoded.role || 'client',
        });
      } catch (err) {
        console.error('Invalid JWT token', err);
        localStorage.removeItem('token');
      }
    }
  }, [])

  return (
    <>
    <Navbar/>
    <div className="bg-gray-800 text-white min-h-screen mt-40">

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto text-center">
          <img
            src="/images/logo.png"
            alt="LegaLead Logo"
            className="h-46 mx-auto mb-4"
          />
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Online Lawyer Consultation Platform 
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-8">
            {user
              ? `Hello, ${user.name}! Connect with expert lawyers for your legal needs.`
              : 'Connect with expert lawyers, book consultations, and track your cases seamlessly.'}
          </p>
          <div className="flex justify-center space-x-4">
            <Link
             onClick={()=>alert("Feature Coming Soon!")}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md text-lg font-medium"
            >
              Chat with Lawyers
            </Link>
            {user ? (
              <Link
                to="/dashboard"
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-md text-lg font-medium"
              >
                {user.role === 'lawyer'
                  ? 'Lawyer Dashboard'
                  : user.role === 'admin'
                  ? 'Admin Dashboard'
                  : 'Client Dashboard'}
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-gray-700 hover:bg-gray-800 px-6 py-3 rounded-md text-lg font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose LegaLead?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Find Expert Lawyers</h3>
              <p className="text-gray-300">
                Browse profiles of qualified lawyers specializing in various legal fields.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Book Consultations</h3>
              <p className="text-gray-300">
                Schedule video or in-person consultations with ease.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Track Your Cases</h3>
              <p className="text-gray-300">
                Monitor case progress and securely share documents with your lawyer.
              </p>
            </div>
          </div>
        </div>
      </section>

     <Footer/>
    
    </div>
    
    
    </>
  );
};

export default Home;