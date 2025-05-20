import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/footer/Footer';
import Navbar from '../../components/navbar/Navbar';


const About = () => {
  const [user, setUser] = useState(null);

 

  return (
    <>
    <Navbar/>
      <div className="bg-gray-900 text-white mt-40">
   
      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">OUR MISSION</h2>
          <p className="text-lg text-gray-300 text-center mb-12">
            At LegaLead, we aim to make legal services accessible, secure, and efficient. Our platform connects clients with
            top-tier lawyers, streamlines consultation bookings, and provides tools for secure document sharing and case tracking.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">For Clients</h3>
              <p className="text-gray-300">
                Find expert lawyers, book consultations, and track your cases with ease. Our secure platform ensures your documents
                and communications are protected.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">For Lawyers</h3>
              <p className="text-gray-300">
                Manage your profile, schedule consultations, and collaborate with clients efficiently. LegaLead empowers you to focus
                on delivering exceptional legal services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why LegaLead?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Expert Connections</h3>
              <p className="text-gray-300">
                Access a network of qualified lawyers specializing in various legal fields.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Secure Platform</h3>
              <p className="text-gray-300">
                Share documents and communicate with confidence using our encrypted systems.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">User-Friendly Tools</h3>
              <p className="text-gray-300">
                Intuitive dashboards for clients and lawyers to manage cases and bookings effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>
     
    </div>
    <Footer/>
    </>
  
  );
};

export default About;