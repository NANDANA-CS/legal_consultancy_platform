import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/footer/Footer';
import Navbar from '../../components/navbar/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';


const Home = () => {
  const [usera, setUsera] = useState(null);
  const navigate = useNavigate();

  const { loginWithRedirect, user, isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();

    // ClientLogin.jsx (useEffect snippet)
useEffect(() => {
  const saveUserData = async () => {
    if (isLoading) return;
    if (!isAuthenticated || !user) return;
    if (localStorage.getItem('token')) {
      navigate('/');
      return;
    }

    try {
      const token = await getAccessTokenSilently({
        audience: "https://dev-dwidrngxdwz2oh0g.us.auth0.com/api/v2/",
        scope: 'read:current_user openid profile email',
      });
      console.log('Access token parts:', token.split('.').length);

      if (token.split('.').length !== 3) {
        throw new Error('Invalid token: Not a JWT');
      }

      const userData = {
        auth0Id: user.sub,
        name: user.name || user.email || 'Unknown User',
        email: user.email || '',
        picture: user.picture || '',
      };

      const response = await axios.post(
        'http://localhost:3000/api/authsignup',
        userData,
        {
          headers: {
            Authorization: `Bearer ${token.trim()}`,
            'Content-Type': 'application/json',
          },
        },
      );

      localStorage.setItem('token', response.data.token);
      toast.success('Login successful!', { theme: 'dark' });
      navigate('/');
    } catch (err) {
      console.error('Error in saveUserData:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to save user data', { theme: 'dark' });
    }
  };

  saveUserData();
}, [isAuthenticated, user, isLoading, getAccessTokenSilently, navigate]);
  const handleChatClick = () => {
    toast.info('Chat feature coming soon!', {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'dark',
    });
  };

  return (
    <>
      <ToastContainer />
      <Navbar />
      <div className="bg-gray-800 text-white min-h-screen pt-24 mt-10">
        <div className="w-full h-300 bg-[url('/images/hoe.jpg')] bg-no-repeat bg-contain relative">
          <div className='absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
            <h1 className="text-7xl sm:text-6xl font-bold mb-6 text-white">
              Online Legal Consultancy Platform
            </h1>
            <p className="text-lg text-center  sm:text-2xl text-gray-300 mb-1 text-black">
              {usera
                ? `Hello, ${usera.name}! Connect with expert lawyers for your legal needs.`
                : 'Connect with expert lawyers, book consultations, and track your cases seamlessly.'}
            </p>
          </div>
        </div>


        <section className="py-20 px-4 sm:px-6 lg:px-8 ">

          <div className="max-w-5xl mx-auto text-center">


            <div className="bg-gray-900 p-10 w-full h-full rounded-xl shadow-lg hover:shadow-2xl transition">
              <h2 className="text-3xl font-semibold text-left text-white mb-4">What Are Lawyer Services?</h2>
              <p className="text-xl font-semibold text-left mb-4">
                Our Online lawyer consultation services offer a range of legal consultation services that cater to different needs. For instance, if you're dealing with issues related to a Business Contract, Power Of Attorney, or Website Development, you can find top lawyers with relevant legal expertise.
              </p>
              <ul className="text-gray-300 text-left text-xl space-y-3 mb-10">
                <li><strong>Legal Consultation:</strong> Get expert legal advice tailored to your situation.</li>
                <li><strong>Document Drafting:</strong> Contracts, agreements, wills – professionally handled.</li>
                <li><strong>Litigation:</strong> Civil and criminal representation for your legal battles.</li>
                <li><strong>Corporate Law:</strong> Business setup, compliance, contracts – all covered.</li>
                <li><strong>Family Law:</strong> Divorce, custody, adoption support with sensitivity.</li>
                <li><strong>Estate Planning:</strong> Wills, trusts, and probate assistance.</li>
                <li><strong>Criminal Defence:</strong> Strong representation for criminal charges.</li>
                <li><strong>Immigration:</strong> Visa help, green cards, deportation defence.</li>
                <li><strong>Employment Law:</strong> Workplace rights, disputes, and contracts handled.</li>
              </ul>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={handleChatClick}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md text-lg font-medium transition"
                >
                  Chat with Lawyers
                </button>

              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-12">Why Choose LegaLead?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
                <h3 className="text-xl font-semibold mb-3 text-white">Find Expert Lawyers</h3>
                <p className="text-gray-300">
                  Browse profiles of qualified lawyers specializing in various legal fields.
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
                <h3 className="text-xl font-semibold mb-3 text-white">Book Consultations</h3>
                <p className="text-gray-300">
                  Schedule video or in-person consultations with ease.
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
                <h3 className="text-xl font-semibold mb-3 text-white">Track Your Cases</h3>
                <p className="text-gray-300">
                  Monitor case progress and securely share documents with your lawyer.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default Home