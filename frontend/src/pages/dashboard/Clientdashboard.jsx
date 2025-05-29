import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../components/navbar/Navbar.jsx';
import Footer from '../../components/footer/Footer.jsx';

const ClientDashboard = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});

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

        // Fetch documents for each consultation
        if (response.data.consultations) {
          const docsPromises = response.data.consultations.map((consultation) =>
            axios.get(`http://localhost:3000/api/documents/consultation/${consultation._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          );
          const docsResponses = await Promise.all(docsPromises);
          const docsMap = {};
          docsResponses.forEach((res, index) => {
            docsMap[response.data.consultations[index]._id] = res.data;
          });
          setDocuments(docsMap);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error.response?.data || error.message);
        toast.error(error.response?.data?.message || 'Failed to fetch dashboard data', { theme: 'dark' });
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, getAccessTokenSilently, navigate]);

  const handleFileChange = (consultationId, event) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [consultationId]: event.target.files[0],
    }));
  };

  const handleUpload = async (consultationId, lawyerId) => {
    const file = selectedFiles[consultationId];
    if (!file) {
      toast.error('Please select a file to upload', { theme: 'dark' });
      return;
    }

    // Validate file size (e.g., max 5MB) and type
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (file.size > maxSize) {
      toast.error('File size exceeds 5MB limit', { theme: 'dark' });
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF, JPEG, or PNG files are allowed', { theme: 'dark' });
      return;
    }

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

      const formData = new FormData();
      formData.append('file', file);
      formData.append('consultationId', consultationId);
      formData.append('lawyerId', lawyerId);

      const response = await axios.post('http://localhost:3000/api/documents/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update documents state
      setDocuments((prev) => ({
        ...prev,
        [consultationId]: [...(prev[consultationId] || []), response.data],
      }));
      setSelectedFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[consultationId];
        return newFiles;
      });
      toast.success('Document uploaded successfully', { theme: 'dark' });
    } catch (error) {
      console.error('Error uploading document:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to upload document', { theme: 'dark' });
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  if (!dashboardData || dashboardData.user.role !== 'client') {
    console.log('Access denied:', { dashboardData, role: dashboardData?.user?.role });
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Access denied. Please log in as a client.</p>
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
          Client Dashboard
        </h1>
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800 to-gray-850 p-10 rounded-2xl shadow-xl min-h-[600px] transition-transform duration-300 hover:scale-[1.01]">
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
                onClick={() => navigate('/lawyers')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300"
              >
                Find Lawyers
              </button>
              <button
                onClick={() => navigate('/my-appointments')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300"
              >
                My Appointments
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
                              consultation.lawyerId?.profilePic
                                ? `http://localhost:3000/images/${consultation.lawyerId.profilePic}`
                                : '/images/default-profile.png'
                            }
                            alt={consultation.lawyerId?.name || 'Lawyer'}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-lg font-medium text-gray-100">
                              {consultation.lawyerId?.name || 'Unknown Lawyer'} -{' '}
                              {new Date(consultation.dateTime).toLocaleString()}
                            </p>
                            <p className="text-gray-400">Status: {consultation.status}</p>
                            <p className="text-gray-400">
                              Acceptance: {consultation.accept ? 'Accepted' : 'Pending'}
                            </p>
                            {consultation.notes && (
                              <p className="text-gray-500 text-sm">{consultation.notes}</p>
                            )}
                          </div>
                        </div>
                        {consultation.accept && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-200">Upload Document</h4>
                            <div className="flex gap-2">
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(consultation._id, e)}
                                className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
                              />
                              <button
                                onClick={() => handleUpload(consultation._id, consultation.lawyerId)}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300 text-sm"
                              >
                                Upload
                              </button>
                            </div>
                            {documents[consultation._id]?.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-200 mt-4">Uploaded Documents</h4>
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

export default ClientDashboard;