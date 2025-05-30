// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation, useParams } from 'react-router-dom';
// import { useAuth0 } from '@auth0/auth0-react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Navbar from '../../components/navbar/Navbar.jsx';
// import Footer from '../../components/footer/Footer.jsx';

// const Case = () => {
//   const { isAuthenticated, getAccessTokenSilently } = useAuth0();
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const { consultationId, lawyerId } = useParams()
//   const [formData, setFormData] = useState({
//     title: '',
//     type: '',
//     description: '',
//   });
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!consultationId || !lawyerId) {
//       toast.error('Invalid consultation or lawyer data. Please try again.', { theme: 'dark' });
//       navigate('/clientdashboard');
//     }
//   }, [consultationId, lawyerId, navigate]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       const maxSize = 5 * 1024 * 1024; // 5MB
//       const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
//       if (selectedFile.size > maxSize) {
//         toast.error('File size exceeds 5MB limit', { theme: 'dark' });
//         return;
//       }
//       if (!allowedTypes.includes(selectedFile.type)) {
//         toast.error('Only PDF, JPEG, PNG, or JPG files are allowed', { theme: 'dark' });
//         return;
//       }
//       setFile(selectedFile);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       let token;
//       if (isAuthenticated) {
//         token = await getAccessTokenSilently({
//           audience: 'https://dev-dwidrngxdwz2oh0g.us.auth0.com/api/v2/',
//           scope: 'read:current_user',
//         });
//       } else {
//         token = localStorage.getItem('token');
//       }

//       if (!token) {
//         throw new Error('No authentication token found');
//       }

//       const data = new FormData();
//       data.append('title', formData.title);
//       data.append('type', formData.type);
//       data.append('description', formData.description);
//       data.append('consultationId', consultationId);
//       data.append('lawyerId', lawyerId);
//       if (file) {
//         data.append('file', file);
//       }

//       const response = await axios.post('http://localhost:3000/api/case', data, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//     //   toast.success('Case registered successfully', { theme: 'dark' });

//     } catch (error) {
//       console.error('Error registering case:', error.response?.data || error.message);
//       toast.error(error.response?.data?.message || 'Failed to register case', { theme: 'dark' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <ToastContainer />
//       <Navbar />
//       <div className="bg-gray-900 text-white min-h-screen pt-24 px-4 sm:px-6 lg:px-8 mt-30">
//         <h1 className="text-4xl font-bold text-center mb-12 text-gray-100 tracking-tight">
//           Register a New Case
//         </h1>
//         <div className="max-w-5xl mx-auto bg-gradient-to-br from-gray-800 to-gray-850 p-8 rounded-2xl shadow-xl">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="title" className="block text-sm font-medium text-gray-300">
//                 Case Title
//               </label>
//               <input
//                 type="text"
//                 id="title"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 required
//                 className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter case title"
//               />
//             </div>
//             <div>
//               <label htmlFor="type" className="block text-sm font-medium text-gray-300">
//                 Case Type
//               </label>
//               <input
//                 type="text"
//                 id="type"
//                 name="type"
//                 value={formData.type}
//                 onChange={handleInputChange}
//                 required
//                 className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter case type (e.g., Civil, Criminal)"
//               />
//             </div>
//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-300">
//                 Case Description
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 required
//                 rows="5"
//                 className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Describe the case details"
//               />
//             </div>
//             <div>
//               <label htmlFor="file" className="block text-sm font-medium text-gray-300">
//                 Upload Document or Image (Optional)
//               </label>
//               <input
//                 type="file"
//                 id="file"
//                 name="file"
//                 accept=".pdf,.jpg,.jpeg,.png"
//                 onChange={handleFileChange}
//                 className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
//               />
//               <p className="mt-1 text-xs text-gray-500">Max 5MB. PDF, JPEG, PNG, or JPG only.</p>
//             </div>
//             <div className="flex justify-end gap-4">
             
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//               >
//                 {loading ? 'Submitting...' : 'Register Case'}
//               </button>
//                <button
//                 type="button"
//                 onClick={() => navigate('/clientdashboard')}
//                 className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Case;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../components/navbar/Navbar.jsx';
import Footer from '../../components/footer/Footer.jsx';

const Case = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const { consultationId, lawyerId } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!consultationId || !lawyerId) {
      toast.error('Invalid consultation or lawyer data. Please try again.', { theme: 'dark' });
      navigate('/clientdashboard');
    }
  }, [consultationId, lawyerId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (selectedFile.size > maxSize) {
        toast.error('File size exceeds 5MB limit', { theme: 'dark' });
        return;
      }
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error('Only PDF, JPEG, PNG, or JPG files are allowed', { theme: 'dark' });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
        throw new Error('No authentication token found');
      }

      const data = new FormData();
      data.append('title', formData.title);
      data.append('type', formData.type);
      data.append('description', formData.description);
      data.append('consultationId', consultationId);
      data.append('lawyerId', lawyerId);
      if (file) {
        data.append('file', file);
      }

      const response = await axios.post('http://localhost:3000/api/cases', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Case registered successfully', { theme: 'dark' });
      navigate('/clientdashboard');
    } catch (error) {
      console.error('Error registering case:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to register case', { theme: 'dark' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <Navbar />
      <div className="bg-gray-900 text-white min-h-screen pt-24 px-4 sm:px-6 lg:px-8 mt-30">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-100 tracking-tight">
          Register a New Case
        </h1>
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-gray-800 to-gray-850 p-8 rounded-2xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                Case Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter case title"
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-300">
                Case Type
              </label>
              <input
                type="text"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter case type (e.g., Civil, Criminal)"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                Case Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="5"
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the case details"
              />
            </div>
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-300">
                Upload Document or Image (Optional)
              </label>
              <input
                type="file"
                id="file"
                name="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-300 file:mr-4 mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
              />
              <p className="mt-1 text-xs text-gray-500">Max 5MB. PDF, JPEG, PNG, or JPG only.</p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/clientdashboard')}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Submitting...' : 'Register Case'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Case;