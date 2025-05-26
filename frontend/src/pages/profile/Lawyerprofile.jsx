import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';

const Lawyerprofile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-800 text-white">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-800 text-white">
        <p>No profile data available. Please log in.</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <Navbar />
      <div className="bg-gray-800 text-white min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-gray-900 p-8 mt-40 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">Lawyer Profile</h1>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-shrink-0">
              <img
                src={
                  userData.profilePic
                    ? `http://localhost:3000/images/${userData.profilePic}`
                    : '/images/default-profile.png'
                }
                alt="Profile"
                className="h-32 w-32 rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-4">{userData.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-300">
                    <strong>Email:</strong> {userData.email}
                  </p>
                  <p className="text-gray-300">
                    <strong>Phone Number:</strong> {userData.phoneNumber || 'N/A'}
                  </p>
                  <p className="text-gray-300">
                    <strong>Role:</strong> {userData.role}
                  </p>
                  {userData.role === 'lawyer' && (
                    <>
                      <p className="text-gray-300">
                        <strong>Bar Registration Number:</strong> {userData.barRegistrationNumber || 'N/A'}
                      </p>
                      <p className="text-gray-300">
                        <strong>Bar Council State:</strong> {userData.barCouncilState || 'N/A'}
                      </p>
                      <p className="text-gray-300">
                        <strong>Years of Experience:</strong> {userData.yearsOfExperience || 'N/A'}
                      </p>
                      <p className="text-gray-300">
                        <strong>Current Workplace:</strong> {userData.currentWorkplace || 'N/A'}
                      </p>
                      <p className="text-gray-300">
                        <strong>Expertise:</strong> {userData.expertise || 'Not specified'}
                      </p>
                    </>
                  )}
                </div>
                {userData.role === 'lawyer' && userData.availabilitySlots?.length > 0 && (
                  <div>
                    <p className="text-gray-300 font-semibold">Availability Slots:</p>
                    <ul className="list-disc list-inside text-gray-300">
                      {userData.availabilitySlots.map((slot, index) => (
                        <li key={index}>
                          {slot.day}: {slot.startTime} - {slot.endTime}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Lawyerprofile;