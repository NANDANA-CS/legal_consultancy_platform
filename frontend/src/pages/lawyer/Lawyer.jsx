import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';

const Lawyers = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [lawyers, setLawyers] = useState([]);
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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
        setFilteredLawyers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching lawyers:', err);
        toast.error('Failed to fetch lawyers', { theme: 'dark' });
        setLoading(false);
      }
    };

    fetchLawyers();
  }, [isAuthenticated, getAccessTokenSilently, navigate]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search')?.toLowerCase() || '';
    const filtered = lawyers.filter(
      (lawyer) =>
        (lawyer.name?.toLowerCase() || '').includes(searchQuery) ||
        (lawyer.currentWorkplace?.toLowerCase() || '').includes(searchQuery) ||
        (lawyer.barCouncilState?.toLowerCase() || '').includes(searchQuery)
    );
    setFilteredLawyers(filtered);
  }, [location.search, lawyers]);

  const handleLawyerClick = (lawyerId) => {
    navigate(`/lawyersdet/${lawyerId}`);
  };

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
      <ToastContainer />
      <div className="bg-gray-800 text-white min-h-screen pt-24 px-4 sm:px-6 lg:px-8 mt-30">
        <h2 className="text-5xl font-bold text-center mb-22 text-gray-300">Consult Our Expert Lawyers</h2>
        {filteredLawyers.length === 0 ? (
          <p className="text-center text-gray-300">No lawyers found matching your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-8xl mx-auto">
            {filteredLawyers.map((lawyer) => (
              <div
                key={lawyer._id}
                className="bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-2xl transition cursor-pointer"
                onClick={() => handleLawyerClick(lawyer._id)}
              >
                <img
                  src={lawyer.profilePic ? `http://localhost:3000/images/${lawyer.profilePic}` : '/images/default-profile.png'}
                  alt={lawyer.name}
                  className="h-34 w-34 rounded-full object-cover mx-auto mb-4"
                />
                  <h3 className="text-4xl font-semibold text-white ">{lawyer.name}</h3>
                <div className='display flex justify-between'>
                  <div>
                  <p className="text-gray-300 ">email: {lawyer.email}</p>
                  <p className="text-gray-300 ">Phone: {lawyer.phoneNumber}</p>
                  
                </div>
                </div>
                <button
                  onClick={() =>navigate('/lawyerdetails') 
                  
                  }
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium"
                >
                 View Details
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