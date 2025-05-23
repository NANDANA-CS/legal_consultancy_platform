import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Footer from '../../components/footer/Footer';
import Nav from '../../components/navbar/Nav';

const Clientsignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'client',
  });
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['name', 'email', 'password', 'phoneNumber'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill out the ${field} field.`, { theme: 'dark' });
        return;
      }
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (profilePic) {
      data.append('profilePic', profilePic);
    }

    for (let [key, value] of data.entries()) {
      console.log(`FormData: ${key} = ${value}`);
    }

    try {
      const response = await fetch('http://localhost:3000/api/clientsignup', {
        method: 'POST',
        body: data,
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('token', result.token);
        toast.success('Signup successful', { theme: 'dark' });
        navigate('/login');
      } else {
        toast.error(result.message || 'Signup failed', { theme: 'dark' });
      }
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Server error. Please try again.', { theme: 'dark' });
    }
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-40">
        <div className="w-full max-w-5xl bg-gray-800/80 backdrop-blur-lg p-8 rounded-xl shadow-xl border border-gray-700/30">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Client Signup</h2>
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
           <div>
              <label htmlFor="profilePic" className="block text-sm font-medium text-gray-300 mb-1">
                Profile Picture 
              </label>
              <input
                type="file"
                id="profilePic"
                name="profilePic"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setProfilePic)}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-600"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-600"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-600"
                placeholder="Enter your password"
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-600"
                placeholder="Enter your phone number"
              />
            </div>
           
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-medium"
            >
              Sign Up as Client
            </button>
            <p className="text-center text-sm text-gray-300 mt-4">
              Already have an account?{' '}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-700 underline font-medium transition-colors"
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Clientsignup;