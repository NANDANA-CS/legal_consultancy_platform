import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../components/navbar/Navbar.jsx';
import Footer from '../../components/footer/Footer.jsx';

const LawyerDashboard = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [documents, setDocuments] = useState({});
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

        // Fetch documents for accepted consultations
        if (response.data.consultations) {
          const docsPromises = response.data.consultations
            .filter((consultation) => consultation.accept)
            .map((consultation) =>
              axios.get(`http://localhost:3000/api/documents/consultation/${consultation._id}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
            );
          const docsResponses = await Promise.all(docsPromises);
          const docsMap = {};
          response.data.consultations
            .filter((consultation) => consultation.accept)
            .forEach((consultation, index) => {
              docsMap[consultation._id] = docsResponses[index].data;
            });
          setDocuments(docsMap);
        }

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

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  if (!dashboardData || dashboardData.user.role !== 'lawyer') {
    console.log('Access denied:', { dashboardData, role: dashboardData?.user?.role });
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Access denied. Please log in as a lawyer.</p>
      </div>
    );
  }

  const { user, consultations } = dashboardData;

  return (
    <>
      <ToastContainer />
      <Navbar />
      <div className="bg-gray-900 text-white min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-100 tracking-tight">
          Lawyer Dashboard
        </h1>
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800 to-gray-850 p-10 rounded-2xl shadow-2xl min-h-[600px] transition-transform duration-300 hover:scale-[1.01]">
          <h3 className="text-3xl font-semibold text-gray-100 mb-6">Welcome, {user.name}</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/profile')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300"
              >
                View Profile
              </button>
              <button
                onClick={() => navigate('/cases')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300"
              >
                View Cases
              </button>
              <button
                onClick={() => navigate('/appointments')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300"
              >
                Pending Appointments
              </button>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-200 mb-4">Your Consultations</h3>
              {consultations && consultations.length > 0 ? (
                <ul className="space-y-4">
                  {consultations.map((consultation) => (
                    <li key={consultation._id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              consultation.clientId?.profilePic
                                ? `http://localhost:3000/images/${consultation.clientId.profilePic}`
                                : '/images/default-profile.png'
                            }
                            alt={consultation.clientId?.name || 'Client'}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-lg font-medium text-gray-100">
                              {consultation.clientId?.name || 'Unknown Client'} -{' '}
                              {new Date(consultation.dateTime).toLocaleString()}
                            </p>
                            <p className="text-gray-400">Status: {consultation.status}</p>
                            <p className="text-gray-400">
                              Acceptance: {consultation.accept ? 'Accepted' : 'Pending'}
                            </p>
                            {consultation.notes && (
                              <p className="text-gray-500 text-sm">{consultation.notes}</p>
                            )}
                            <p className="text-gray-400">
                              <a
                                href={consultation.meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-blue-400"
                              >
                                Meeting Link
                              </a>
                            </p>
                          </div>
                        </div>
                        {consultation.accept && documents[consultation._id]?.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-200 mb-2">Client Documents</h4>
                            <ul className="space-y-2">
                              {documents[consultation._id].map((doc) => (
                                <li key={doc._id} className="bg-gray-700 p-2 rounded-lg">
                                  <a
                                    href={`http://localhost:3000${doc.filepath}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300 hover:text-blue-400 text-sm"
                                  >
                                    {doc.filename}
                                  </a>
                                  <p className="text-gray-500 text-xs">
                                    Uploaded: {new Date(doc.uploadedAt).toLocaleString()}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-center">No consultations scheduled.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LawyerDashboard;