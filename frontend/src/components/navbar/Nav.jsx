import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Nav = () => {
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
        <nav className="bg-white text-white shadow-lg fixed top-0 w-full z-10">
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
                   </div>
            </div>
        </nav>
    )
}

export default Nav