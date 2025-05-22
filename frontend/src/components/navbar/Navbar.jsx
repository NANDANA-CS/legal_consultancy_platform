// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const Navbar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         try {
//           const response = await fetch('http://localhost:3000/api/user', {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           const data = await response.json();
//           if (response.ok) {
//             setUser(data);
//           } else {
//             localStorage.removeItem('token');
//             setUser(null);
//           }
//         } catch (err) {
//           console.error('Fetch user error:', err);
//           localStorage.removeItem('token');
//           setUser(null);
//         }
//       }
//     };
//     fetchUserData();
//   }, []);

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     setIsMobileMenuOpen(false);
//     navigate('/login');
//   };

//   return (
//     <nav className="bg-cyan-900 text-white shadow-lg fixed top-0 w-full z-10">
//       <div className="mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-44">
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center">
//               <img
//                 src="/images/logo.png"
//                 alt="LegaLead Logo"
//                 className="h-65 w-auto"
//               />
//             </Link>
//           </div>

//           <div className="w-full max-w-2xl mx-4 relative">
//             <input
//               type="search"
//               name="search"
//               id="search"
//               placeholder="Search for Lawyers"
//               className="w-full py-4 pl-5 pr-14 border-2 border-gray-300 rounded-lg text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 transition-all placeholder:text-gray-400 bg-white shadow-sm"
//             />
//             <img
//               src="/images/search.png"
//               alt="Search Icon"
//               className="h-6 w-6 absolute right-4 top-1/2 transform -translate-y-1/2"
//             />
//           </div>

//           <div className="hidden md:flex items-center space-x-4">
//             <Link to="/" className="hover:bg-gray-700 px-3 py-2 rounded-md text-lg font-medium">
//               Home
//             </Link>
//             <Link
//               to="/lawyers"
//               className="hover:bg-gray-700 px-3 py-2 rounded-md text-lg font-medium"
//             >
//               Find Lawyers
//             </Link>
//             {/* {user && (
//               <Link
//                 to="/dashboard"
//                 className="hover:bg-gray-700 px-3 py-2 rounded-md text-lg font-medium"
//               >
//                 {user.role === 'lawyer'
//                   ? 'Lawyer Dashboard'
//                   : user.role === 'admin'
//                     ? 'Admin Dashboard'
//                     : 'Client Dashboard'}
//               </Link>
//             )} */}
//             {user ? (
//               <div className="flex items-center space-x-4">
//                 <div className="flex items-center space-x-2">
//                   <img
//                     src={`http://localhost:3000/images/${user.profilepic}`}
//                     alt="Profile"
//                     className="h-8 w-8 rounded-full object-cover"
//                   />
//                   <span className="text-gray-300 text-sm">{user.name}</span>
//                 </div>
//                 <button
//                   onClick={handleLogout}
//                   className="bg-red-500 hover:bg-red-700 px-3 py-2 rounded-md text-lg font-medium"
//                 >
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <Link
//                 to="/login"
//                 className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-lg font-medium"
//               >
//                 Login
//               </Link>
//             )}
//           </div>

//           <div className="md:hidden flex items-center">
//             <button
//               onClick={toggleMobileMenu}
//               className="text-white focus:outline-none"
//             >
//               <svg
//                 className="h-6 w-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {isMobileMenuOpen && (
//         <div className="md:hidden bg-cyan-900">
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//             <Link
//               to="/"
//               className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
//               onClick={toggleMobileMenu}
//             >
//               Home
//             </Link>
//             <Link
//               to="/lawyers"
//               className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
//               onClick={toggleMobileMenu}
//             >
//               Find Lawyers
//             </Link>
//             {user && (
//               <Link
//                 to="/dashboard"
//                 className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
//                 onClick={toggleMobileMenu}
//               >
//                 {user.role === 'lawyer'
//                   ? 'Lawyer Dashboard'
//                   : user.role === 'admin'
//                     ? 'Admin Dashboard'
//                     : 'Client Dashboard'}
//               </Link>
//             )}
//             {user ? (
//               <div className="flex items-center space-x-2 px-3 py-2">
//                 <img
//                   src={user.profilepic || user.profilePic || '/images/default-profile.png'}
//                   alt="Profile"
//                   className="h-8 w-8 rounded-full object-cover"
//                 />
//                 <span className="text-gray-300 text-base">{user.name}</span>
//               </div>
//             ) : null}
//             {user ? (
//               <button
//                 onClick={handleLogout}
//                 className="block w-full text-left hover:bg-red-700 bg-red-600 px-3 py-2 rounded-md text-base font-medium"
//               >
//                 Logout
//               </button>
//             ) : (
//               <Link
//                 to="/login"
//                 className="block hover:bg-blue-700 bg-blue-600 px-3 py-2 rounded-md text-base font-medium"
//                 onClick={toggleMobileMenu}
//               >
//                 Login
//               </Link>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:3000/api/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            setUser(data);
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (err) {
          console.error('Fetch user error:', err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
    };
    fetchUserData();
  }, []);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsDropdownOpen(false); // Close dropdown when toggling mobile menu
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-cyan-900 text-white shadow-lg fixed top-0 w-full z-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-44">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/images/logo.png"
                alt="LegaLead Logo"
                className="h-65 w-auto"
              />
            </Link>
          </div>

          <div className="w-full max-w-2xl mx-4 relative">
            <input
              type="search"
              name="search"
              id="search"
              placeholder="Search for Lawyers"
              className="w-full py-4 pl-5 pr-14 border-2 border-gray-300 rounded-lg text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 transition-all placeholder:text-gray-400 bg-white shadow-sm"
            />
            <img
              src="/images/search.png"
              alt="Search Icon"
              className="h-6 w-6 absolute right-4 top-1/2 transform -translate-y-1/2"
            />
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:bg-gray-700 px-3 py-2 rounded-md text-lg font-medium">
              Home
            </Link>
            <Link
              to="/lawyers"
              className="hover:bg-gray-700 px-3 py-2 rounded-md text-lg font-medium"
            >
              Find Lawyers
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className="hover:bg-gray-700  px-3 py-2 rounded-md text-lg font-medium"
              >
                {user.role === 'lawyer'
                  ? 'Lawyer Dashboard'
                  : user.role === 'admin'
                    ? 'Admin Dashboard'
                    : 'Client Dashboard'}
              </Link>
            )}
            {user ? (
              <div className="relative " ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 focus:outline-none "
                >
                  <img
                    src={user.profilepic ? `http://localhost:3000/images/${user.profilepic}` : '/images/default-profile.png'}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="text-gray-300 text-sm">{user.name}</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-cyan-700 rounded-md shadow-lg py-1 z-20">
                    {/* <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                      {user.name}
                    </div> */}
                    <Link

                      to="/profile"
                      className="block px-2 pl-12 py-2 text-sm text-white hover:bg-gray-500 bg-[url('/images/profile.png')] bg-contain bg-no-repeat "
                      style={{ backgroundSize: "20px 20px" }}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile 
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 pl-12 text-sm text-white hover:bg-red-600 bg-[url('/images/logout-icon.png')] bg-contain bg-no-repeat"
                      style={{ backgroundSize: "28px 28px" }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-lg font-medium"
              >
                Login
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none"
            >
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/lawyers"
              className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMobileMenu}
            >
              Find Lawyers
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMobileMenu}
              >
                {user.role === 'lawyer'
                  ? 'Lawyer Dashboard'
                  : user.role === 'admin'
                    ? 'Admin Dashboard'
                    : 'Client Dashboard'}
              </Link>
            )}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 px-3 py-2 w-full text-left"
                >
                  <img
                    src={user.profilepic ? `http://localhost:3000/images/${user.profilepic}` : '/images/default-profile.png'}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="text-gray-300 text-base">{user.name}</span>
                </button>
                {isDropdownOpen && (
                  <div className="bg-cyan-900 rounded-md shadow-lg py-1 mt-1">
                  
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-base text-white hover:bg-gray-700"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-base text-white hover:bg-red-700"
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
    </nav>
  );
};

export default Navbar;