// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth0 } from '@auth0/auth0-react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Navbar from '../../components/navbar/Navbar';
// import Footer from '../../components/footer/Footer';

// const Editprofile = () => {
//   const { isAuthenticated, getAccessTokenSilently } = useAuth0();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     phoneNumber: '',
//     role: '',
//     barRegistrationNumber: '',
//     barCouncilState: '',
//     yearsOfExperience: '',
//     currentWorkplace: '',
//     expertise: '',
//     availabilitySlots: [{ day: '', startTime: '', endTime: '' }],
//   });
//   const [profilePic, setProfilePic] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         let token;
//         if (isAuthenticated) {
//           token = await getAccessTokenSilently({
//             audience: 'https://dev-dwidrngxdwz2oh0g.us.auth0.com/api/v2/',
//             scope: 'read:current_user openid profile email',
//           });
//         } else {
//           token = localStorage.getItem('token');
//         }

//         if (!token) {
//           toast.error('No authentication token found. Please log in.', { theme: 'dark' });
//           navigate('/login');
//           return;
//         }

//         const response = await axios.get('http://localhost:3000/api/user', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const userData = response.data;
//         setFormData({
//           name: userData.name || '',
//           phoneNumber: userData.phoneNumber || '',
//           role: userData.role || '',
//           barRegistrationNumber: userData.barRegistrationNumber || '',
//           barCouncilState: userData.barCouncilState || '',
//           yearsOfExperience: userData.yearsOfExperience || '',
//           currentWorkplace: userData.currentWorkplace || '',
//           expertise: userData.expertise || '',
//           availabilitySlots: userData.availabilitySlots?.length > 0
//             ? userData.availabilitySlots
//             : [{ day: '', startTime: '', endTime: '' }],
//         });
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching user data:', err);
//         toast.error(err.response?.data?.message || 'Failed to fetch profile data', { theme: 'dark' });
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [isAuthenticated, getAccessTokenSilently, navigate]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.size > 5 * 1024 * 1024) {
//       toast.error('Image size must be less than 5MB', { theme: 'dark' });
//       return;
//     }
//     setProfilePic(file);
//   };

//   const handleSlotChange = (index, field, value) => {
//     const updatedSlots = [...formData.availabilitySlots];
//     updatedSlots[index] = { ...updatedSlots[index], [field]: value };
//     setFormData((prev) => ({ ...prev, availabilitySlots: updatedSlots }));
//   };

//   const addSlot = () => {
//     setFormData((prev) => ({
//       ...prev,
//       availabilitySlots: [...prev.availabilitySlots, { day: '', startTime: '', endTime: '' }],
//     }));
//   };

//   const removeSlot = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       availabilitySlots: prev.availabilitySlots.filter((_, i) => i !== index),
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     try {
//       let token;
//       if (isAuthenticated) {
//         token = await getAccessTokenSilently({
//           audience: 'https://dev-dwidrngxdwz2oh0g.us.auth0.com/api/v2/',
//           scope: 'read:current_user update:current_user',
//         });
//       } else {
//         token = localStorage.getItem('token');
//       }

//       if (!token) {
//         toast.error('No authentication token found. Please log in.', { theme: 'dark' });
//         setSubmitting(false);
//         return;
//       }

//       // Validate required fields
//       if (!formData.name) {
//         toast.error('Name is required', { theme: 'dark' });
//         setSubmitting(false);
//         return;
//       }

//       if (formData.role === 'lawyer') {
//         if (!formData.barRegistrationNumber) {
//           toast.error('Bar Registration Number is required for lawyers', { theme: 'dark' });
//           setSubmitting(false);
//           return;
//         }
//         if (!formData.barCouncilState) {
//           toast.error('Bar Council State is required for lawyers', { theme: 'dark' });
//           setSubmitting(false);
//           return;
//         }
//       }

//       // Clean up availability slots
//       const cleanedSlots = formData.availabilitySlots.filter(
//         (slot) => slot.day && slot.startTime && slot.endTime
//       );

//       // Upload profile picture if selected
//       let profilePicPath = formData.profilePic;
//       if (profilePic) {
//         const formDataFile = new FormData();
//         formDataFile.append('profilePic', profilePic);
//         const uploadResponse = await axios.post('http://localhost:3000/api/upload', formDataFile, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//         profilePicPath = uploadResponse.data.filePath;
//       }

//       // Update profile data
//       const updateData = {
//         ...formData,
//         availabilitySlots: cleanedSlots,
//         profilePic: profilePicPath || null,
//       };

//       const response = await axios.put(
//         'http://localhost:3000/api/user',
//         updateData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       toast.success('Profile updated successfully!', { theme: 'dark' });
//       setSubmitting(false);
//       navigate('/profile');
//     } catch (err) {
//       console.error('Error updating profile:', err);
//       toast.error(err.response?.data?.message || 'Failed to update profile', { theme: 'dark' });
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
//         <p className="text-xl font-medium animate-pulse">Loading profile...</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <ToastContainer />
//       <Navbar />
//       <div className="bg-gray-900 text-white min-h-screen pt-24 px-4 sm:px-6 lg:px-8 mt-40">
//         <h1 className="text-4xl font-bold text-center mb-12 tracking-tight text-gray-100">Edit Profile</h1>
//         <div className="max-w-6xl mx-auto bg-gradient-to-br from-gray-800 to-gray-850 p-10 rounded-2xl shadow-2xl min-h-[600px] transition-transform duration-300 hover:scale-[1.01]">
//           <form onSubmit={handleSubmit} className="space-y-8">
//             <div className="space-y-6">
//               <div>
//                 <label htmlFor="profilePic" className="block text-lg font-medium text-gray-100">
//                   Profile Picture
//                 </label>
//                 <input
//                   type="file"
//                   id="profilePic"
//                   name="profilePic"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="mt-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 {formData.profilePic && (
//                   <img
//                     src={`http://localhost:3000/images/${formData.profilePic}`}
//                     alt="Current Profile"
//                     className="mt-4 h-32 w-32 rounded-lg object-cover"
//                   />
//                 )}
//               </div>
//               <div>
//                 <label htmlFor="name" className="block text-lg font-medium text-gray-100">
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="mt-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="phoneNumber" className="block text-lg font-medium text-gray-100">
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   id="phoneNumber"
//                   name="phoneNumber"
//                   value={formData.phoneNumber}
//                   onChange={handleInputChange}
//                   className="mt-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               {formData.role === 'lawyer' && (
//                 <>
//                   <div>
//                     <label htmlFor="barRegistrationNumber" className="block text-lg font-medium text-gray-100">
//                       Bar Registration Number
//                     </label>
//                     <input
//                       type="text"
//                       id="barRegistrationNumber"
//                       name="barRegistrationNumber"
//                       value={formData.barRegistrationNumber}
//                       onChange={handleInputChange}
//                       className="mt-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="barCouncilState" className="block text-lg font-medium text-gray-100">
//                       Bar Council State
//                     </label>
//                     <input
//                       type="text"
//                       id="barCouncilState"
//                       name="barCouncilState"
//                       value={formData.barCouncilState}
//                       onChange={handleInputChange}
//                       className="mt-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="yearsOfExperience" className="block text-lg font-medium text-gray-100">
//                       Years of Experience
//                     </label>
//                     <input
//                       type="number"
//                       id="yearsOfExperience"
//                       name="yearsOfExperience"
//                       value={formData.yearsOfExperience}
//                       onChange={handleInputChange}
//                       className="mt-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       min="0"
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="currentWorkplace" className="block text-lg font-medium text-gray-100">
//                       Current Workplace
//                     </label>
//                     <input
//                       type="text"
//                       id="currentWorkplace"
//                       name="currentWorkplace"
//                       value={formData.currentWorkplace}
//                       onChange={handleInputChange}
//                       className="mt-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="expertise" className="block text-lg font-medium text-gray-100">
//                       Expertise
//                     </label>
//                     <input
//                       type="text"
//                       id="expertise"
//                       name="expertise"
//                       value={formData.expertise}
//                       onChange={handleInputChange}
//                       className="mt-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <p className="text-lg font-medium text-gray-100 mb-4">Availability Slots</p>
//                     {formData.availabilitySlots.map((slot, index) => (
//                       <div key={index} className="flex flex-col sm:flex-row gap-4 mb-4">
//                         <select
//                           value={slot.day}
//                           onChange={(e) => handleSlotChange(index, 'day', e.target.value)}
//                           className="w-full sm:w-1/3 bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                           <option value="">Select Day</option>
//                           <option value="Monday">Monday</option>
//                           <option value="Tuesday">Tuesday</option>
//                           <option value="Wednesday">Wednesday</option>
//                           <option value="Thursday">Thursday</option>
//                           <option value="Friday">Friday</option>
//                           <option value="Saturday">Saturday</option>
//                           <option value="Sunday">Sunday</option>
//                         </select>
//                         <input
//                           type="time"
//                           value={slot.startTime}
//                           onChange={(e) => handleSlotChange(index, 'startTime', e.target.value)}
//                           className="w-full sm:w-1/3 bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         <input
//                           type="time"
//                           value={slot.endTime}
//                           onChange={(e) => handleSlotChange(index, 'endTime', e.target.value)}
//                           className="w-full sm:w-1/3 bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         {formData.availabilitySlots.length > 1 && (
//                           <button
//                             type="button"
//                             onClick={() => removeSlot(index)}
//                             className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300"
//                           >
//                             Remove
//                           </button>
//                         )}
//                       </div>
//                     ))}
//                     <button
//                       type="button"
//                       onClick={addSlot}
//                       className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300"
//                     >
//                       Add Slot
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//             <div className="flex gap-4">
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className={`w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-lg font-semibold text-lg transition-colors duration-300 shadow-lg hover:shadow-xl ${
//                   submitting ? 'opacity-50 cursor-not-allowed' : ''
//                 }`}
//               >
//                 {submitting ? 'Saving...' : 'Save Changes'}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => navigate('/profile')}
//                 className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3.5 rounded-lg font-semibold text-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
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

// export default Editprofile;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';

const Editprofile = () => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        role: '',
        barRegistrationNumber: '',
        barCouncilState: '',
        yearsOfExperience: '',
        currentWorkplace: '',
        expertise: '',
        availabilitySlots: [{ day: '', startTime: '', endTime: '' }],
        profilePic: '',
    });
    const [profilePic, setProfilePic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

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
                    toast.error('No authentication token found. Please log in.', { theme: 'dark' });
                    navigate('/login');
                    return;
                }

                const response = await axios.get('http://localhost:3000/api/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const userData = response.data;
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    phoneNumber: userData.phoneNumber || '',
                    role: userData.role || '',
                    barRegistrationNumber: userData.barRegistrationNumber || '',
                    barCouncilState: userData.barCouncilState || '',
                    yearsOfExperience: userData.yearsOfExperience || '',
                    currentWorkplace: userData.currentWorkplace || '',
                    expertise: userData.expertise || '',
                    availabilitySlots: userData.availabilitySlots?.length > 0
                        ? userData.availabilitySlots
                        : [{ day: '', startTime: '', endTime: '' }],
                    profilePic: userData.profilePic, 
                });
                setLoading(false);
            } catch (err) {
                console.error('Error fetching user data:', err);
                toast.error(err.response?.data?.message || 'Failed to fetch profile data', { theme: 'dark' });
                setLoading(false);
            }
        };

        fetchUserData();
    }, [isAuthenticated, getAccessTokenSilently, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB', { theme: 'dark' });
            return;
        }
        setProfilePic(file);
    };

    const handleSlotChange = (index, field, value) => {
        const updatedSlots = [...formData.availabilitySlots];
        updatedSlots[index] = { ...updatedSlots[index], [field]: value };
        setFormData((prev) => ({ ...prev, availabilitySlots: updatedSlots }));
    };

    const addSlot = () => {
        setFormData((prev) => ({
            ...prev,
            availabilitySlots: [...prev.availabilitySlots, { day: '', startTime: '', endTime: '' }],
        }));
    };

    const removeSlot = (index) => {
        setFormData((prev) => ({
            ...prev,
            availabilitySlots: prev.availabilitySlots.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            let token;
            if (isAuthenticated) {
                token = await getAccessTokenSilently({
                    audience: 'https://dev-dwidrngxdwz2oh0g.us.auth0.com/api/v2/',
                    scope: 'read:current_user update:current_user',
                });
            } else {
                token = localStorage.getItem('token');
            }

            if (!token) {
                toast.error('No authentication token found. Please log in.', { theme: 'dark' });
                setSubmitting(false);
                return;
            }

            // Validate required fields
            if (!formData.name) {
                toast.error('Name is required', { theme: 'dark' });
                setSubmitting(false);
                return;
            }
            if (!formData.email) {
                toast.error('Email is required', { theme: 'dark' });
                setSubmitting(false);
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                toast.error('Invalid email format', { theme: 'dark' });
                setSubmitting(false);
                return;
            }

            if (formData.role === 'lawyer') {
                if (!formData.barRegistrationNumber) {
                    toast.error('Bar Registration Number is required for lawyers', { theme: 'dark' });
                    setSubmitting(false);
                    return;
                }
                if (!formData.barCouncilState) {
                    toast.error('Bar Council State is required for lawyers', { theme: 'dark' });
                    setSubmitting(false);
                    return;
                }
            }

            // Clean up availability slots
            const cleanedSlots = formData.availabilitySlots.filter(
                (slot) => slot.day && slot.startTime && slot.endTime
            );

            // Upload profile picture if selected
            let profilePicPath = formData.profilePic;
            if (profilePic) {
                const formDataFile = new FormData();
                formDataFile.append('profilePic', profilePic);
                const uploadResponse = await axios.post('http://localhost:3000/api/upload', formDataFile, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                profilePicPath = uploadResponse.data.filePath;
            }

            // Update profile data
            const updateData = {
                ...formData,
                availabilitySlots: cleanedSlots,
                profilePic: profilePicPath || null,
            };

            const response = await axios.put(
                'http://localhost:3000/api/user',
                updateData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success('Profile updated successfully!', { theme: 'dark' });
            setSubmitting(false);
            navigate('/profile');
        } catch (err) {
            console.error('Error updating profile:', err);
            toast.error(err.response?.data?.message || 'Failed to update profile', { theme: 'dark' });
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
                <p className="text-xl font-medium animate-pulse">Loading profile...</p>
            </div>
        );
    }

    return (
        <>
            <ToastContainer />
            <Navbar />
            <div className="bg-gray-900 text-white min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-center mb-12 tracking-tight text-gray-100">Edit Profile</h1>
                <div className="max-w-6xl mx-auto bg-gradient-to-br from-gray-800 to-gray-850 p-10 rounded-2xl shadow-2xl min-h-[600px] transition-transform duration-300 hover:scale-[1.01]">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="profilePic" className="block text-lg font-medium text-gray-100">
                                    Profile Picture
                                </label>
                                <input
                                    type="file"
                                    id="profilePic"
                                    name="profilePic"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="mt-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {formData.profilePic && (
                                    <img
                                        src={`http://localhost:3000/images/${formData.profilePic}`}
                                        alt="Current Profile"
                                        className="mt-4 h-32 w-32 rounded-lg object-cover"
                                    />
                                )}
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-lg font-medium text-gray-100">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="mt-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-lg font-medium text-gray-100">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="mt-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className="block text-lg font-medium text-gray-100">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    className="mt-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            {formData.role === 'lawyer' && (
                                <>
                                    <div>
                                        <label htmlFor="barRegistrationNumber" className="block text-lg font-medium text-gray-100">
                                            Bar Registration Number
                                        </label>
                                        <input
                                            type="text"
                                            id="barRegistrationNumber"
                                            name="barRegistrationNumber"
                                            value={formData.barRegistrationNumber}
                                            onChange={handleInputChange}
                                            className="mt-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="barCouncilState" className="block text-lg font-medium text-gray-100">
                                            Bar Council State
                                        </label>
                                        <input
                                            type="text"
                                            id="barCouncilState"
                                            name="barCouncilState"
                                            value={formData.barCouncilState}
                                            onChange={handleInputChange}
                                            className="mt-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="yearsOfExperience" className="block text-lg font-medium text-gray-100">
                                            Years of Experience
                                        </label>
                                        <input
                                            type="number"
                                            id="yearsOfExperience"
                                            name="yearsOfExperience"
                                            value={formData.yearsOfExperience}
                                            onChange={handleInputChange}
                                            className="mt-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="currentWorkplace" className="block text-lg font-medium text-gray-100">
                                            Current Workplace
                                        </label>
                                        <input
                                            type="text"
                                            id="currentWorkplace"
                                            name="currentWorkplace"
                                            value={formData.currentWorkplace}
                                            onChange={handleInputChange}
                                            className="mt-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="expertise" className="block text-lg font-medium text-gray-100">
                                            Expertise
                                        </label>
                                        <input
                                            type="text"
                                            id="expertise"
                                            name="expertise"
                                            value={formData.expertise}
                                            onChange={handleInputChange}
                                            className="mt-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium text-gray-100 mb-4">Availability Slots</p>
                                        {formData.availabilitySlots.map((slot, index) => (
                                            <div key={index} className="flex flex-col sm:flex-row gap-4 mb-4">
                                                <select
                                                    value={slot.day}
                                                    onChange={(e) => handleSlotChange(index, 'day', e.target.value)}
                                                    className="w-full sm:w-1/3 bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Select Day</option>
                                                    <option value="Monday">Monday</option>
                                                    <option value="Tuesday">Tuesday</option>
                                                    <option value="Wednesday">Wednesday</option>
                                                    <option value="Thursday">Thursday</option>
                                                    <option value="Friday">Friday</option>
                                                    <option value="Saturday">Saturday</option>
                                                    <option value="Sunday">Sunday</option>
                                                </select>
                                                <input
                                                    type="time"
                                                    value={slot.startTime}
                                                    onChange={(e) => handleSlotChange(index, 'startTime', e.target.value)}
                                                    className="w-full sm:w-1/3 bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <input
                                                    type="time"
                                                    value={slot.endTime}
                                                    onChange={(e) => handleSlotChange(index, 'endTime', e.target.value)}
                                                    className="w-full sm:w-1/3 bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {formData.availabilitySlots.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSlot(index)}
                                                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addSlot}
                                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300"
                                        >
                                            Add Slot
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-lg font-semibold text-lg transition-colors duration-300 shadow-lg hover:shadow-xl ${submitting ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {submitting ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/profile')}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3.5 rounded-lg font-semibold text-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Editprofile;