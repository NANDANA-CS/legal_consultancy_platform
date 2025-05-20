import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();


    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsMobileMenuOpen(false);
        navigate('/login');
    };

    return (
        <nav className="bg-cyan-900 text-white shadow-lg fixed top-0 w-full z-10">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-44">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <img
                                src="/images/logo.png"
                                alt="LegaLead Logo"
                                className="h-65 w-auto"
                            />
                            {/* <span className="ml-2 text-3xl font-bold">LegaLead</span> */}
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/" className="hover:bg-gray-700 px-3 py-2 rounded-md text-xl font-medium">
                            Home
                        </Link>
                        <Link
                            to="/lawyers"
                            className="hover:bg-gray-700 px-3 py-2 rounded-md text-xl font-medium"
                        >
                            Find Lawyers
                        </Link>
                        {user && (
                            <Link
                                to="/dashboard"
                                className="hover:bg-gray-700 px-3 py-2 rounded-md text-xl font-medium"
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
                                    className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-xl font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="hover:bg-gray-700 px-3 py-2 rounded-md text-xl font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-xl font-medium"
                                >
                                    Signup
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar