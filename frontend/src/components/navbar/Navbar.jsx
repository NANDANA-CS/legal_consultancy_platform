import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Assuming you have a way to decode the token or fetch user data
            // Replace this with your actual logic to get user details
            const userData = JSON.parse(localStorage.getItem('user')); // Example
            setUser(userData);
        }
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsMobileMenuOpen(false);
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
                            {/* <span className="ml-2 text-2xl font-bold">LegaLead</span> */}
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
                                className="hover:bg-gray-700 px-3 py-2 rounded-md text-lg font-medium"
                            >
                                {user.role === 'lawyer'
                                    ? 'Lawyer Dashboard'
                                    : user.role === 'admin'
                                        ? 'Admin Dashboard'
                                        : 'Client Dashboard'}
                            </Link>
                        )}
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-300 text-sm">{user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-lg font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="hover:bg-gray-700 px-3 py-2 rounded-md text-lg font-medium"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                    {/* Mobile Menu Button */}
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
            {/* Mobile Menu */}
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
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left hover:bg-red-700 bg-red-600 px-3 py-2 rounded-md text-base font-medium"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
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