import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import { v4 as uuidv4 } from 'uuid';

const Consultation = () => {
  const { id } = useParams();
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    dateTime: '',
    notes: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated && !localStorage.getItem('token')) {
        toast.error('Please log in to book a consultation', { theme: 'dark' });
        navigate('/login');
        return;
      }

      try {
        const token = isAuthenticated
          ? await getAccessTokenSilently({
              audience: 'https://dev-dwidrngxdwz2oh0g.us.auth0.com/api/v2/',
              scope: 'read:current_user',
            })
          : localStorage.getItem('token');

        const lawyerResponse = await axios.get(`http://localhost:3000/api/lawyersdet/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLawyer(lawyerResponse.data);

        if (!isAuthenticated) {
          const userResponse = await axios.get('http://localhost:3000/api/user', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserData(userResponse.data);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Failed to load consultation page', { theme: 'dark' });
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isAuthenticated, getAccessTokenSilently, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.dateTime) {
      toast.error('Please select a date and time', { theme: 'dark' });
      return;
    }

    const selectedDate = new Date(formData.dateTime);
    if (selectedDate < new Date()) {
      toast.error('Please select a future date and time', { theme: 'dark' });
      return;
    }

    try {
      const token = isAuthenticated
        ? await getAccessTokenSilently({
            audience: 'https://dev-dwidrngxdwz2oh0g.us.auth0.com/api/v2/',
            scope: 'read:current_user',
          })
        : localStorage.getItem('token');

      const consultationData = {
        clientId: isAuthenticated ? user.sub : userData.id,
        lawyerId: id,
        dateTime: selectedDate.toISOString(),
        notes: formData.notes,
        meetLink: `https://meet.example.com/${uuidv4()}`, 
      };

      await axios.post('http://localhost:3000/api/consultations', consultationData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Consultation booked successfully!', { theme: 'dark' });
      navigate('/clientdashboard');
    } catch (err) {
      console.error('Error booking consultation:', err);
      toast.error(err.response?.data?.message || 'Failed to book consultation', { theme: 'dark' });
    }
  };

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
      <div className="bg-gray-900 text-white min-h-screen pt-24 px-4 sm:px-6 lg:px-8 mt-30 pb-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 mt-10 max-w-6xl mx-auto">
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
          <div className="flex-1 space-y-6 w-full">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-wide pb-2 text-center lg:text-left">
              Book Consultation with {lawyer.name}
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
            <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className='flex justify-between'>
                <h4 className="text-2xl font-semibold text-gray-100 mb-4">Schedule Your Consultation</h4>
              <p className='cursor-pointer' onClick={()=>navigate(-1)}>x</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="dateTime" className="block text-lg font-medium text-gray-200 mb-2">
                    Date and Time
                  </label>
                  <input
                    type="datetime-local"
                    id="dateTime"
                    name="dateTime"
                    value={formData.dateTime}
                    onChange={handleChange}
                    className="w-full py-2 px-4 border-2 border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="notes" className="block text-lg font-medium text-gray-200 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    className="w-full py-2 px-4 border-2 border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                    placeholder="Any specific details or questions for the consultation"
                  />
                </div>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-6 rounded-lg font-semibold text-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  Book Consultation
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Consultation;