// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useAuth0 } from '@auth0/auth0-react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import Navbar from '../../components/navbar/Navbar';
// import Footer from '../../components/footer/Footer';

// const LawyerDetails = () => {
//   const { id } = useParams();
//   const { isAuthenticated, getAccessTokenSilently } = useAuth0();
//   const [lawyer, setLawyer] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchLawyer = async () => {
//       if (!isAuthenticated && !localStorage.getItem('token')) {
//         toast.error('Please log in to view lawyer details', { theme: 'dark' });
//         navigate('/login');
//         return;
//       }

//       try {
//         const token = isAuthenticated ? await getAccessTokenSilently() : localStorage.getItem('token');
//         const response = await axios.get(`http://localhost:3000/api/lawyersdet/${id}`);
//         setLawyer(response.data);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching lawyer:', err);
//         toast.error('Failed to fetch lawyer details', { theme: 'dark' });
//         setLoading(false);
//       }
//     };

//     fetchLawyer();
//   }, [id, isAuthenticated, getAccessTokenSilently, navigate]);

//   if (loading) {
//     return (
//       <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
//         <p className="text-xl font-medium animate-pulse">Loading...</p>
//       </div>
//     );
//   }

//   if (!lawyer) {
//     return (
//       <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
//         <p className="text-xl font-medium">Lawyer not found.</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <ToastContainer />
//       <div className="bg-gray-900 text-white min-h-screen pt-24 px-4 sm:px-6 lg:px-8">



//         <div className='display flex gap-20'>
//           <div className="flex-shrink-0 flex justify-center md:justify-start mt-40">
//             <img
//               src={lawyer.profilePic ? `http://localhost:3000/images/${lawyer.profilePic}` : '/images/default-profile.png'}
//               alt={lawyer.name}
//               className="h-166 w-166 rounded-lg object-cover border-4 border-gray-600 shadow-lg transition-transform duration-300 hover:scale-105"
//             />
//           </div>
//           {/* Details Section */}
//           <div className="flex-1 space-y-8 mt-40">
//             <h3 className="text-7xl font-semibold text-white tracking-wide  pb-2">{lawyer.name}</h3>
//             <div className="space-y-4 text-lg">
//               <p className="text-gray-200 flex items-center gap-2">
//                 <span className="font-medium text-gray-100">Email:</span>
//                 <span className="truncate">{lawyer.email}</span>
//               </p>
//               <p className="text-gray-200 flex items-center gap-2">
//                 <span className="font-medium text-gray-100">Phone:</span>
//                 {lawyer.phoneNumber}
//               </p>
//               <p className="text-gray-200 flex items-center gap-2">
//                 <span className="font-medium text-gray-100">Bar Registration:</span>
//                 {lawyer.barRegistrationNumber}
//               </p>
//               <p className="text-gray-200 flex items-center gap-2">
//                 <span className="font-medium text-gray-100">State:</span>
//                 {lawyer.barCouncilState}
//               </p>
//               <p className="text-gray-200 flex items-center gap-2">
//                 <span className="font-medium text-gray-100">Experience:</span>
//                 {lawyer.yearsOfExperience} years
//               </p>
//               <p className="text-gray-200 flex items-center gap-2">
//                 <span className="font-medium text-gray-100">Workplace:</span>
//                 {lawyer.currentWorkplace}
//               </p>
//             </div>
//             <button
//               onClick={() => toast.info('Consultation booking coming soon!', { theme: 'dark' })}
//               className="w-100 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-lg font-semibold text-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
//             >
//               Book Consultation
//             </button>
//           </div>
//         </div>

//       </div>
//       <Footer />
//     </>
//   );
// };

// export default LawyerDetails;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';

const LawyerDetails = () => {
  const { id } = useParams();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLawyer = async () => {
      if (!isAuthenticated && !localStorage.getItem('token')) {
        toast.error('Please log in to view lawyer details', { theme: 'dark' });
        navigate('/login');
        return;
      }

      try {
        const token = isAuthenticated
          ? await getAccessTokenSilently()
          : localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:3000/api/lawyersdet/${id}`
        );
        setLawyer(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching lawyer:', err);
        toast.error('Failed to fetch lawyer details', { theme: 'dark' });
        setLoading(false);
      }
    };

    fetchLawyer();
  }, [id, isAuthenticated, getAccessTokenSilently, navigate]);

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p className="text-xl font-medium animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p className="text-xl font-medium">Lawyer not found.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />  
      <ToastContainer />
      <div className="bg-gray-900 text-white min-h-screen pt-24 px-4 sm:px-6 lg:px-8 mt-30">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 mt-10">
          <div className="flex-shrink-0 flex justify-center">
            <img
              src={
                lawyer.profilePic
                  ? `http://localhost:3000/images/${lawyer.profilePic}`
                  : '/images/default-profile.png'
              }
              alt={lawyer.name}
              className="w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-lg object-cover border-4 border-gray-600 shadow-lg transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="flex-1 space-y-6 mt-10 lg:mt-0 w-full">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-wide pb-2 text-center lg:text-left">
              {lawyer.name}
            </h3>
            <div className="space-y-4 text-lg px-2">
              <p className="text-gray-200 flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-medium text-gray-100">Email:</span>
                <span className="truncate">{lawyer.email}</span>
              </p>
              <p className="text-gray-200 flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-medium text-gray-100">Phone:</span>
                {lawyer.phoneNumber}
              </p>
              <p className="text-gray-200 flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-medium text-gray-100">Bar Registration:</span>
                {lawyer.barRegistrationNumber}
              </p>
              <p className="text-gray-200 flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-medium text-gray-100">State:</span>
                {lawyer.barCouncilState}
              </p>
              <p className="text-gray-200 flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-medium text-gray-100">Experience:</span>
                {lawyer.yearsOfExperience} years
              </p>
              <p className="text-gray-200 flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-medium text-gray-100">Workplace:</span>
                {lawyer.currentWorkplace}
              </p>
            </div>
            <div className="text-center lg:text-left">
              <button
                onClick={() =>navigate(`/lawyers/${id}/consultation`)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-6 rounded-lg font-semibold text-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LawyerDetails;
