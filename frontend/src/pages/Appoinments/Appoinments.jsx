import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../components/navbar/Navbar.jsx';
import Footer from '../../components/footer/Footer.jsx';

const Appointments = () => {
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
        toast.success('Successfully fetched dashboard data', { theme: 'dark' });
      } catch (error) {
        console.error('Error fetching dashboard data:', error.response?.data || error.message);
        toast.error(error.response?.data?.message || 'Failed to fetch dashboard data', { theme: 'dark' });
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, getAccessTokenSilently, navigate]);

  const handleAccept = async (consultationId) => {
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
        `http://localhost:3000/api/consultations/${consultationId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove consultation from state
      setDashboardData((prev) => ({
        ...prev,
        consultations: prev.consultations.filter((c) => c._id !== consultationId),
      }));
      toast.success('Consultation accepted', { theme: 'dark' });
    } catch (error) {
      console.error('Error accepting consultation:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to accept consultation', { theme: 'dark' });
    }
  };

  const handleDecline = async (consultationId) => {
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
        `http://localhost:3000/api/consultations/${consultationId}/decline`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove consultation from state
      setDashboardData((prev) => ({
        ...prev,
        consultations: prev.consultations.filter((c) => c._id !== consultationId),
      }));
      toast.success('Consultation declined', { theme: 'dark' });
    } catch (error) {
      console.error('Error declining consultation:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to decline consultation', { theme: 'dark' });
    }
  };

  if (loading) {
    return (
      <div class="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p class="text-xl font-semibold animate-pulse">Loading appointments...</p>
      </div>
    );
  }

  if (!dashboardData || dashboardData.user.role !== 'lawyer') {
    console.log('Access denied:', { dashboardData, role: dashboardData?.user?.role });
    return (
      <div class="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p class="text-xl font-semibold">Access denied. Please log in as a lawyer.</p>
      </div>
    );
  }

  const { user, consultations } = dashboardData;
  const pendingConsultations = consultations?.filter((c) => c.accept === false && c.status !== 'cancelled') || [];

  return (
    <>
      <ToastContainer />
      <Navbar />
      <div class="bg-gray-900 text-white min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-bold text-center mb-12 text-gray-100 tracking-tight">
          Pending Appointments
        </h1>
        <div class="max-w-4xl mx-auto bg-gradient-to-br from-gray-800 to-gray-850 p-10 rounded-2xl shadow-2xl min-h-[600px] transition-transform duration-300 hover:scale-[1.01]">
          <h3 class="text-3xl font-semibold text-gray-100 mb-6">Welcome, {user.name}</h3>
          <div class="space-y-6">
            <div class="flex gap-4">
              <button
                onClick={() => navigate('/profile')}
                class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300"
              >
                View Profile
              </button>
              <button
                onClick={() => navigate('/cases')}
                class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300"
              >
                View Cases
              </button>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-200 mb-4">Pending Consultations</h3>
              {pendingConsultations.length > 0 ? (
                <ul class="space-y-4">
                  {pendingConsultations.map((consultation) => (
                    <li key={consultation._id} class="bg-gray-800 p-4 rounded-lg shadow-md">
                      <div class="flex items-center gap-4">
                        <img
                          src={
                            consultation.clientId?.profilePic
                              ? `http://localhost:3000/images/${consultation.clientId.profilePic}`
                              : '/images/default-profile.png'
                          }
                          alt={consultation.clientId?.name || 'Client'}
                          class="h-12 w-12 rounded-full object-cover"
                        />
                        <div class="flex-1">
                          <p class="text-lg font-medium text-gray-100">
                            {consultation.clientId?.name || 'Unknown Client'} -{' '}
                            {new Date(consultation.dateTime).toLocaleString()}
                          </p>
                          <p class="text-gray-400">Status: {consultation.status}</p>
                          {consultation.notes && (
                            <p class="text-gray-500 text-sm">{consultation.notes}</p>
                          )}
                        </div>
                        <div class="flex gap-2">
                          <button
                            onClick={() => handleAccept(consultation._id)}
                            class="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-lg font-semibold transition-colors duration-300"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleDecline(consultation._id)}
                            class="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-lg font-semibold transition-colors duration-300"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p class="text-gray-400 text-center">No pending consultations.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Appointments;