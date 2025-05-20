import React from 'react'
import { Link, useNavigate } from 'react-router-dom';


const Footer = () => {
  return (
    <>
       <footer className="bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-700">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-300 mb-4">
            &copy; 2025 LegaLead. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/about" className="text-gray-400 hover:text-white">
              About
            </Link>
            <Link to="/contact" className="text-gray-400 hover:text-white">
              Contact
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
