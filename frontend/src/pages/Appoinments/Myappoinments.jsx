import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../components/navbar/Navbar.jsx';
import Footer from '../../components/footer/Footer.jsx';

const MyAppointments = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        let token;
        if (isAuthenticated) {
          token = await getAccessTokenSilently({
            audience: 'https://dev-dwidrngxdwz2oh0g.us.auth0.com/api/v2/',
            scope: 'read:current_user',
          });
        } else {
          token = localStorage.getItem('token');
        }

        if (!token) {
          toast.error('No authentication token found. Please log in.', { theme: 'dark' });
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:3000/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Dashboard data:', response.data);
        setDashboardData(response.data);
        setLoading(false);
        // toast.success('Successfully fetched dashboard data', { theme: 'dark' });
      } catch (error) {
        console.error('Error fetching dashboard data:', error.response?.data || error.message);
        toast.error(error.response?.data?.message || 'Failed to fetch dashboard data', { theme: 'dark' });
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, getAccessTokenSilently, navigate]);

  const handleCancel = async (consultationId) => {
    try {
      let token;
      if (isAuthenticated) {
        token = await getAccessTokenSilently({
          audience: 'https://dev-dwidrngxdwz2oh0g.us.auth0.com/api/v2/',
          scope: 'read:current_user',
        });
      } else {
        token = localStorage.getItem('token');
      }

      await axios.patch(
        `http://localhost:3000/api/consultations/${consultationId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDashboardData((prev) => ({
        ...prev,
        consultations: prev.consultations.filter((c) => c._id !== consultationId),
      }));
      toast.success('Consultation cancelled', { theme: 'dark' });
    } catch (error) {
      console.error('Error cancelling consultation:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to cancel consultation', { theme: 'dark' });
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p className="text-xl font-medium animate-pulse">Loading appointments...</p>
      </div>
    );
  }

  if (!dashboardData || dashboardData.user.role !== 'client') {
    console.log('Access denied:', { dashboardData, role: dashboardData?.user?.role });
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p className="text-xl font-medium">Access denied. Please log in as a client.</p>
      </div>
    );
  }

  const { user, consultations } = dashboardData;
  const pendingConsultations = consultations?.filter((c) => c.status !== 'cancelled' && !c.accept) || [];

  return (
    <>
      <ToastContainer />
      <Navbar />
      <div className="bg-gray-900 text-white min-h-screen pt-24 px-4 sm:px-6 lg:px-8 mt-30">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-100 tracking-tight">My Appointments</h1>
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800 to-gray-850 p-10 rounded-2xl shadow-2xl min-h-[600px] transition-transform duration-300 hover:scale-[1.01]">
          <h2 className="text-3xl font-semibold text-gray-100 mb-6">Welcome, {user.name}</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/profile')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors duration-300"
              >
                View Profile
              </button>
              <button
                onClick={() => navigate('/lawyers')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-colors duration-300"
              >
                Find Lawyers
              </button>
            </div>
            <div>
              <h3 className="text-2xl font-medium text-gray-100 mb-4">Your Pending Consultations</h3>
              {pendingConsultations.length > 0 ? (
                <ul className="space-y-4">
                  {pendingConsultations.map((consultation) => (
                    <li key={consultation._id} className="bg-gray-700 p-4 rounded-lg shadow">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            consultation.lawyerId?.profilePic
                              ? `http://localhost:3000/images/${consultation.lawyerId.profilePic}`
                              : '/images/default-profile.png'
                          }
                          alt={consultation.lawyerId?.name || 'Lawyer'}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-lg font-medium text-gray-100">
                            {consultation.lawyerId?.name || 'Unknown Lawyer'} -{' '}
                            {new Date(consultation.dateTime).toLocaleString()}
                          </p>
                          <p className="text-gray-400">Status: {consultation.status}</p>
                          <p className="text-gray-400">Acceptance: Pending</p>
                          {consultation.notes && (
                            <p className="text-gray-500 text-sm">{consultation.notes}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleCancel(consultation._id)}
                          className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-lg font-semibold transition-colors duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-center">No pending consultations scheduled.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyAppointments;