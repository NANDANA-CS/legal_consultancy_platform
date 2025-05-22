import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Footer from '../../components/footer/Footer';
import Nav from '../../components/navbar/Nav';

const LawyerSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    barRegistrationNumber: '',
    barCouncilState: '',
    yearsOfExperience: '',
    currentWorkplace: '',
    role: 'lawyer', 
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


    if (!profilePic) {
      toast.error('Please upload a profile picture.', { theme: 'dark' });
      return;
    }
    const requiredFields = [
      'name',
      'email',
      'password',
      'phoneNumber',
      'barRegistrationNumber',
      'barCouncilState',
      'yearsOfExperience',
      'currentWorkplace',
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill out the ${field} field.`, { theme: 'dark' });
        return;
      }
    }
    if (isNaN(formData.yearsOfExperience) || formData.yearsOfExperience < 0) {
      toast.error('Years of experience must be a valid number.', { theme: 'dark' });
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    data.append('profilePic', profilePic);


    for (let [key, value] of data.entries()) {
      console.log(`FormData: ${key} = ${value}`);
    }

    try {
      const response = await fetch('http://localhost:3000/api/lawyersignup', {
        method: 'POST',
        body: data,
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('token', result.token);
        toast.success('Signup successful! Please log in.', { theme: 'dark' });
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
        <div className="w-full max-w-5xl bg-gray-800/80 backdrop-blur-xl p-8 rounded-xl shadow-xl border border-gray-700/30">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Lawyer Signup</h2>
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            <div>
              <label htmlFor="profilePic" className="block text-sm font-medium text-gray-300 mb-2">
                Profile Picture
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="profilePic"
                  name="profilePic"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setProfilePic)}
                  required
                  aria-required="true"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="Enter your password"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label htmlFor="barRegistrationNumber" className="block text-sm font-medium text-gray-300 mb-2">
                  Bar Registration Number
                </label>
                <input
                  type="text"
                  id="barRegistrationNumber"
                  name="barRegistrationNumber"
                  value={formData.barRegistrationNumber}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="Enter bar registration number"
                />
              </div>
              <div>
                <label htmlFor="barCouncilState" className="block text-sm font-medium text-gray-300 mb-2">
                  Bar Council/State
                </label>
                <input
                  type="text"
                  id="barCouncilState"
                  name="barCouncilState"
                  value={formData.barCouncilState}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="Enter bar council/state"
                />
              </div>
              <div>
                <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-300 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  min="0"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="Enter years of experience"
                />
              </div>
              <div>
                <label htmlFor="currentWorkplace" className="block text-sm font-medium text-gray-300 mb-2">
                  Current Workplace
                </label>
                <input
                  type="text"
                  id="currentWorkplace"
                  name="currentWorkplace"
                  value={formData.currentWorkplace}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="Enter current workplace"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white p-3 rounded-lg font-medium text-lg transition-all shadow-md"
            >
              Sign Up
            </button>
            <p className="text-center text-sm text-gray-400 mt-6">
              Already have an account?{' '}
              <a
                href="/login"
                className="text-cyan-500 hover:text-cyan-600 font-medium underline transition-colors"
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default LawyerSignup

