import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoginButton from './LoginButton';
import Nav from '../../components/navbar/Nav';
import Footer from '../../components/footer/Footer';

const ClientLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/clientlogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        toast.success('Login successful!', { theme: 'dark' });
        navigate('/');
      } else {
        toast.error(data.message || 'Login failed', { theme: 'dark' });
      }
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Server error. Please try again.', { theme: 'dark' });
    }
  };

  return (
    <>
     
     
        <div className="w-full max-w-5xl bg-gray-800/80 backdrop-blur-lg p-8 rounded-xl shadow-xl border border-gray-700/30">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Client Login</h2>
          <LoginButton />
          <div className="flex items-center my-4 mt-10">
            <hr className="flex-grow border-gray-600" />
            <p className="mx-4 text-sm text-gray-500">OR</p>
            <hr className="flex-grow border-gray-600" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
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
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-medium"
            >
              Login as Client
            </button>
            <p className="text-center text-sm text-gray-300 mt-4">
              Not signed up yet?{' '}
              <a
                href="/clientsignup"
                className="text-blue-600 hover:text-blue-700 underline font-medium transition-colors"
              >
                Sign Up
              </a>
            </p>
          </form>
        </div>

     
    </>
  );
};

export default ClientLogin;