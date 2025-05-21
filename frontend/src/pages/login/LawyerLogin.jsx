import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LawyerLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        toast.success('Login successful!', { theme: 'dark' });
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Login failed', { theme: 'dark' });
      }
    } catch (err) {
      toast.error('Server error. Please try again.', { theme: 'dark' });
    }
  };

  return (
    <div className="bg-gray-800/70 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-700/50 relative overflow-hidden">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Lawyer Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-300 mb-1">
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
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-300 mb-1">
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
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-medium"
        >
        Login
        </button>
         <p className="text-center text-sm text-gray-300 mt-4">
              Not signed up yet?{' '}
              <a
                href="/signup"
                className="text-blue-600 hover:text-blue-700 underline font-medium transition-colors"
              >
                Sign Up
              </a>
            </p>
      </form>
    </div>
  )
}

export default LawyerLogin

