
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated && localStorage.getItem('token')) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:3000/api/user', {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Fetched user data:', response.data);
          setUserData(response.data);
        } catch (err) {
          console.error('Error fetching user data:', err);
          localStorage.removeItem('token');
        }
      }
    };
    fetchUserData();
  }, [isAuthenticated]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    if (isAuthenticated) {
      logout({ returnTo: window.location.origin + '/login' });
    } else {
      localStorage.removeItem('token');
      setUserData(null);
      navigate('/login');
    }
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleChatClick = () => {
    toast.info('Chat feature coming soon!', {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'dark',
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/lawyers?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isLoggedIn = isAuthenticated || !!userData;
  const currentUser = isAuthenticated ? user : userData;
  const profilePic = isAuthenticated
    ? user?.picture
    : userData?.profilePic
      ? `http://localhost:3000/images/${userData.profilePic}`
      : '/images/default-profile.png';

  console.log('Current user:', { isLoggedIn, role: currentUser?.role, name: currentUser?.name });

  return (
    <nav className="bg-cyan-900 text-white shadow-lg fixed top-0 w-full z-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-44">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/images/logo.png" alt="LegaLead Logo" className="h-52 w-auto" />
            </Link>
          </div>

          <div className="w-full max-w-2xl mx-4 relative">
            <form onSubmit={handleSearch}>
              <input
                type="search"
                name="search"
                id="search"
                placeholder="Search for Lawyers by name, workplace, or state"
                className="w-full py-2 pl-4 pr-10 border-2 border-gray-300 rounded-lg text-gray-800 text-base font-medium focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 transition-all placeholder:text-gray-400 bg-white shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <img src="/images/search.png" alt="Search Icon" className="h-5 w-5" />
              </button>
            </form>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {location.pathname !== '/lawyers' && currentUser?.role !== 'lawyer' && (
              <>
              <Link
                to="/lawyers"
                className="hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium border border-white"
              >
                Consult Lawyers
              </Link>
              <Link 
              to='/myappoinments'
               className="hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium border border-white"
              >
                My Appoinments
              </Link>
              </>
              
            )}
            
            {isLoggedIn && currentUser?.role === 'lawyer' && (
              <>
                <button
                  onClick={handleChatClick}
                  className="hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium border border-white"
                >
                  Chat with Clients
                </button>
                 <Link 
                  to='/appoinments'
                   className="hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium border border-white"
                  >   Appoinments            
                </Link>
                <Link
                  to="/casedetails"
                  className="hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium border border-white"
                >
                  Cases
                </Link>
               
              </>
            )}
            {isLoggedIn ? (
              <div className="relative ml-4" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="h-12 w-15 rounded-full object-cover"
                  />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-cyan-700 rounded-md shadow-lg py-1 z-20">
                    <div className="px-4 py-2 text-lg text-white font-semibold border-b border-gray-600">
                      {currentUser?.name || 'User'}
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-base text-white hover:bg-gray-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to={currentUser?.role === 'lawyer' ? '/lawyerdashboard' : '/clientdashboard'}
                      className="block px-4 py-2 text-base text-white hover:bg-gray-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {currentUser?.role === 'lawyer' ? 'Lawyer Dashboard' : 'Client Dashboard'}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-base text-white hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
              >
                Login
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-cyan-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-4">
            <Link
              to="/"
              className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            {currentUser?.role !== 'lawyer' && (
              <Link
                to="/lawyers"
                className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMobileMenu}
              >
                Find Lawyers
              </Link>     
            )}
            {isLoggedIn && currentUser?.role === 'lawyer' && (
              <>
                <button
                  className="block w-full text-left hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
                  onClick={handleChatClick}
                >
                  Chat with Clients
                </button>
                <Link
                  to="/casedetails"
                  className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
                  onClick={toggleMobileMenu}
                >
                  Cases
                </Link>
              </>
            )}
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 px-3 py-2 w-full text-left"
                >
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="text-white font-medium">{currentUser?.name || 'User'}</span>
                </button>
                {isDropdownOpen && (
                  <div className="bg-cyan-900 rounded-md shadow-lg py-1 mt-1">
                    <Link
                     to={currentUser?.role === 'lawyer' ? '/lawyerdashboard' : '/clientdashboard'}
                      className="block px-4 py-2 text-base font-medium text-white hover:bg-gray-700"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {currentUser?.role === 'lawyer' ? 'Lawyer Dashboard' : 'Client Dashboard'}
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-base font-medium text-white hover:bg-gray-700"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-base font-medium text-white hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="block hover:bg-blue-700 bg-blue-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMobileMenu}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
      <ToastContainer />
    </nav>
  );
};

export default Navbar;