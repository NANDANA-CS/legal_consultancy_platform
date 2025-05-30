import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../components/navbar/Navbar.jsx';
import Footer from '../../components/footer/Footer.jsx';

const CaseDetails = () => {
  const { caseId } = useParams();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCaseAndClientData = async () => {
      try {
        let authToken;
        if (isAuthenticated) {
          authToken = await getAccessTokenSilently({
            audience: 'https://dev-dwidrngxdwz2oh0g.us.auth0.com/api/v2/',
            scope: 'read:current_user',
          });
        } else {
          authToken = localStorage.getItem('token');
        }

        if (!authToken) {
          toast.error('No authentication token found. Please log in.', { theme: 'dark' });
          navigate('/login');
          return;
        }

        setToken(authToken);

        // Fetch case details
        console.log('Fetching case with ID:', caseId);
        const caseResponse = await axios.get(`http://localhost:3000/api/cases/${caseId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        console.log('Case data:', caseResponse.data);
        setCaseData(caseResponse.data);

        // Fetch client details
        console.log('Fetching client with ID:', caseResponse.data.clientId);
        const clientResponse = await axios.get(`http://localhost:3000/api/user/${caseResponse.data.clientId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        console.log('Client data:', clientResponse.data);
        setClientData(clientResponse.data);

        // Fetch document details
        console.log('Fetching documents for case ID:', caseId);
        const docsResponse = await axios.get(`http://localhost:3000/api/documents/consultation/${caseResponse.data.consultationId}?caseId=${caseId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        console.log('Documents:', docsResponse.data);
        setDocuments(docsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
        const errorMsg = error.response?.data?.message || 'Failed to fetch case details';
        toast.error(errorMsg, { theme: 'dark' });
        if (error.response?.status === 404) {
          if (error.response.config.url.includes('/api/cases/')) {
            toast.error('Case not found. Please verify the case exists.', { theme: 'dark' });
          } else if (error.response.config.url.includes('/api/user/')) {
            toast.error('Client not found. The associated client may have been deleted.', { theme: 'dark' });
          } else if (error.response.config.url.includes('/api/documents/')) {
            toast.error('No documents found for this case.', { theme: 'dark' });
            setDocuments([]);
          }
        }
        setLoading(false);
      }
    };

    fetchCaseAndClientData();
  }, [caseId, isAuthenticated, getAccessTokenSilently, navigate]);

  const handleDownload = async (filepath) => {
    try {
      const filename = filepath.split('/').pop();
      console.log(`[Frontend] Downloading file: ${filename}`);
      const response = await axios.get(`http://localhost:3000/api/documents/download/${filename}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const mimeType = response.headers['content-type'];
      console.log(`[Frontend] Received MIME type: ${mimeType}`);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: mimeType }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('File downloaded successfully', { theme: 'dark' });
    } catch (error) {
      console.error(`[Frontend] Error downloading file:`, error);
      let errorMessage = 'Failed to download file';
      if (error.response?.data) {
        try {
          const text = await error.response.data.text();
          const parsed = JSON.parse(text);
          errorMessage = parsed.message || errorMessage;
          console.log(`[Frontend] Server error message: ${errorMessage}`);
        } catch (e) {
          console.error(`[Frontend] Error parsing response: ${e.message}`);
          errorMessage = 'Error parsing server response';
        }
      } else {
        errorMessage = error.message || errorMessage;
      }
      toast.error(errorMessage, { theme: 'dark' });
    }
  };

  const handleViewDocument = async (filepath) => {
    try {
      const filename = filepath.split('/').pop();
      console.log(`[Frontend] Viewing file: ${filename}`);
      const response = await axios.get(`http://localhost:3000/api/documents/download/${filename}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const mimeType = response.headers['content-type'];
      if (mimeType !== 'application/pdf') {
        toast.error('Selected file is not a PDF', { theme: 'dark' });
        return;
      }

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setSelectedDocument(url);
      setIsModalOpen(true);
    } catch (error) {
      console.error(`[Frontend] Error viewing file:`, error);
      toast.error('Failed to load PDF document', { theme: 'dark' });
    }
  };

  const closeModal = () => {
    if (selectedDocument) {
      window.URL.revokeObjectURL(selectedDocument);
    }
    setSelectedDocument(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold animate-pulse">Loading case details...</p>
      </div>
    );
  }

  if (!caseData || !clientData) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Case or client not found.</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <Navbar />
      <div className="bg-gray-900 text-white min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-100 tracking-tight">
          Case Details
        </h1>
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-gray-800 to-gray-850 p-10 rounded-2xl shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Case Details */}
            <div className="space-y-8">
              <h2 className="text-3xl font-semibold text-gray-100">Case Information</h2>
              <div className="bg-gray-700 p-8 rounded-xl shadow-lg">
                <p className="text-gray-300 mb-4">
                  <span className="font-medium text-gray-100">Title:</span> {caseData.title}
                </p>
                <p className="text-gray-300 mb-4">
                  <span className="font-medium text-gray-100">Type:</span> {caseData.type}
                </p>
                <p className="text-gray-300 mb-4">
                  <span className="font-medium text-gray-100">Status:</span> {caseData.status}
                </p>
                <p className="text-gray-300 mb-4">
                  <span className="font-medium text-gray-100">Description:</span> {caseData.description}
                </p>
                <p className="text-gray-300 mb-4">
                  <span className="font-medium text-gray-100">Created:</span>{' '}
                  {new Date(caseData.createdAt).toLocaleString()}
                </p>
                {caseData.updates?.length > 0 && (
                  <div className="mt-6">
                    <p className="font-medium text-gray-100 mb-2">Updates:</p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      {caseData.updates.map((update, index) => (
                        <li key={index}>
                          {update.message} - {new Date(update.timestamp).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-6">
                  <p className="font-medium text-gray-100 mb-2">Documents:</p>
                  {documents.length > 0 ? (
                    <ul className="list-disc list-inside text-gray-300 space-y-3">
                      {documents.map((doc) => (
                        <li key={doc._id} className="flex items-center gap-4 hover:bg-gray-600 p-2 rounded-md transition-colors">
                          <button
                            onClick={() => handleViewDocument(doc.filepath)}
                            className="text-blue-400 hover:text-blue-500 font-medium truncate max-w-xs"
                            title={`View ${doc.filename}`}
                          >
                            {doc.filename}
                          </button>
                          <button
                            onClick={() => handleDownload(doc.filepath)}
                            className="text-blue-400 hover:text-blue-500"
                            title={`Download ${doc.filename}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 italic">No documents uploaded for this case.</p>
                  )}
                </div>
              </div>
            </div>
            {/* Client Details */}
            <div className="space-y-8">
              <h2 className="text-3xl font-semibold text-gray-100">Client Information</h2>
              <div className="bg-gray-700 p-8 rounded-xl shadow-lg flex items-center space-x-6">
                <img
                  src={
                    clientData.profilePic
                      ? `http://localhost:3000/images/${clientData.profilePic}`
                      : '/images/default-profile.png'
                  }
                  alt={clientData.name}
                  className="h-20 w-20 rounded-full object-cover border-2 border-gray-600"
                />
                <div>
                  <p className="text-gray-300 mb-2">
                    <span className="font-medium text-gray-100">Name:</span> {clientData.name}
                  </p>
                  <p className="text-gray-300 mb-2">
                    <span className="font-medium text-gray-100">Email:</span> {clientData.email}
                  </p>
                  {clientData.phoneNumber && (
                    <p className="text-gray-300 mb-2">
                      <span className="font-medium text-gray-100">Phone:</span> {clientData.phoneNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 text-center">
            <button
              onClick={() => navigate('/lawyer-dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-semibold transition-colors duration-300 shadow-md"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-11/12 max-w-5xl h-[90vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-100">Document Viewer</h2>
              <button
                onClick={closeModal}
                className="text-gray-300 hover:text-white transition-colors"
                title="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <iframe
              src={selectedDocument}
              className="w-full h-full rounded-lg border-2 border-gray-700"
              title="PDF Viewer"
            />
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default CaseDetails;