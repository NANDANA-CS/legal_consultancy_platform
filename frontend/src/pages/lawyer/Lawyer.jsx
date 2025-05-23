import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';

const Lawyers = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLawyers = async () => {
      if (!isAuthenticated && !localStorage.getItem('token')) {
        toast.error('Please log in to view lawyers', { theme: 'dark' });
        navigate('/login');
        return;
      }

      try {
        const token = isAuthenticated ? await getAccessTokenSilently() : localStorage.getItem('token');
        const userResponse = await axios.get('http://localhost:3000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userResponse.data.role !== 'client') {
          toast.error('Only clients can view lawyer details', { theme: 'dark' });
          navigate('/');
          return;
        }

        const response = await axios.get('http://localhost:3000/api/lawyers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLawyers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching lawyers:', err);
        toast.error('Failed to fetch lawyers', { theme: 'dark' });
        setLoading(false);
      }
    };

    fetchLawyers();
  }, [isAuthenticated, getAccessTokenSilently, navigate]);

  if (loading) {
    return (
      <div className="bg-gray-800 text-white min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-800 text-white min-h-screen pt-24 px-4 sm:px-6 lg:px-8 mt-30">
        <h2 className="text-3xl font-bold text-center mb-12">Consult Our Expert Lawyers</h2>
        {lawyers.length === 0 ? (
          <p className="text-center text-gray-300">No lawyers found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {lawyers.map((lawyer) => (
              <div
                key={lawyer._id}
                className="bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-2xl transition"
              >
                <img
                  src={lawyer.profilePic ? `http://localhost:3000/images/${lawyer.profilePic}` : '/images/default-profile.png'}
                  alt={lawyer.name}
                  className="h-24 w-24 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-center text-white">{lawyer.name}</h3>
                <p className="text-gray-300 text-center">{lawyer.email}</p>
                <p className="text-gray-300 text-center">Phone: {lawyer.phoneNumber}</p>
                <p className="text-gray-300 text-center">Bar Reg: {lawyer.barRegistrationNumber}</p>
                <p className="text-gray-300 text-center">State: {lawyer.barCouncilState}</p>
                <p className="text-gray-300 text-center">Experience: {lawyer.yearsOfExperience} years</p>
                <p className="text-gray-300 text-center">Workplace: {lawyer.currentWorkplace}</p>
                <button
                  onClick={() => toast.info('Consultation booking coming soon!', { theme: 'dark' })}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium"
                >
                  Book Consultation
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Lawyers;