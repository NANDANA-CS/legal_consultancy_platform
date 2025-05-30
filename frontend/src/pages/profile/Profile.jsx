import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let token;
        if (isAuthenticated) {
          token = await getAccessTokenSilently({
            audience: 'https://dev-dwidrngxdwz2oh0g.us.auth0.com/api/v2/',
            scope: 'read:current_user openid profile email',
          });
        } else {
          token = localStorage.getItem('token');
        }

        if (!token) {
          toast.error('No authentication token found. Please log in.', {
            theme: 'dark',
          });
          return;
        }

        const response = await axios.get('http://localhost:3000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response)
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        toast.error(err.response?.data?.message || 'Failed to fetch profile data', {
          theme: 'dark',
        });
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, getAccessTokenSilently]);

  const handleEditProfile = () => {
  navigate('/editprofile')
   
  };

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p className="text-xl font-medium animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p className="text-xl font-medium">No profile data available. Please log in.</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <Navbar />
      <div className="bg-gray-900 text-white min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-100 mt-40">Your Profile</h1>
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-gray-800 to-gray-850 p-10 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-12 min-h-[600px] transition-transform duration-300 hover:scale-[1.01] mt-10">
      
          <div className="flex-shrink-0 flex justify-center md:justify-start">
            <img
              src={
                userData.profilePic
                  ? `http://localhost:3000/images/${userData.profilePic}`
                  : '/images/default-profile.png'
              }
              alt="Profile"
              className="h-96 w-96 rounded-lg object-cover border-4 border-gray-600 shadow-lg transition-transform duration-300 hover:scale-105"
            />
          </div>
          {/* Details Section */}
          <div className="flex-1 space-y-8">
            <h2 className="text-3xl font-semibold text-white tracking-wide border-b border-gray-700 pb-2">{userData.name}</h2>
            <div className="space-y-4 text-lg">
              <p className="text-gray-200 flex items-center gap-2">
                <span className="font-medium text-gray-100">Email:</span>
                <span className="truncate">{userData.email}</span>
              </p>
              <p className="text-gray-200 flex items-center gap-2">
                <span className="font-medium text-gray-100">Phone Number:</span>
                {userData.phoneNumber || 'N/A'}
              </p>
              <p className="text-gray-200 flex items-center gap-2">
                <span className="font-medium text-gray-100">Role:</span>
                {userData.role}
              </p>
              {userData.role === 'lawyer' && (
                <>
                  <p className="text-gray-200 flex items-center gap-2">
                    <span className="font-medium text-gray-100">Bar Registration Number:</span>
                    {userData.barRegistrationNumber || 'N/A'}
                  </p>
                  <p className="text-gray-200 flex items-center gap-2">
                    <span className="font-medium text-gray-100">Bar Council State:</span>
                    {userData.barCouncilState || 'N/A'}
                  </p>
                  <p className="text-gray-200 flex items-center gap-2">
                    <span className="font-medium text-gray-100">Years of Experience:</span>
                    {userData.yearsOfExperience || 'N/A'}
                  </p>
                  <p className="text-gray-200 flex items-center gap-2">
                    <span className="font-medium text-gray-100">Current Workplace:</span>
                    {userData.currentWorkplace || 'N/A'}
                  </p>
                  <p className="text-gray-200 flex items-center gap-2">
                    <span className="font-medium text-gray-100">Expertise:</span>
                    {userData.expertise || 'Not specified'}
                  </p>
                </>
              )}
              {userData.role === 'lawyer' && userData.availabilitySlots?.length > 0 && (
                <div>
                  <p className="text-gray-100 font-medium mb-2">Availability Slots:</p>
                  <ul className="list-disc list-inside text-gray-200 space-y-2">
                    {userData.availabilitySlots.map((slot, index) => (
                      <li key={index}>
                        {slot.day}: {slot.startTime} - {slot.endTime}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleEditProfile}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-lg font-semibold text-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Edit Profile
              </button>
              {userData.role === 'lawyer' && (
                <button
                  onClick={() => toast.info('View bookings coming soon!', { theme: 'dark' })}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-lg font-semibold text-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  View Bookings
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile