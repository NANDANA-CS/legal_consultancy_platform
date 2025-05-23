import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoginButton from './LoginButton';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';

const ClientLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isProcessingAuth0, setIsProcessingAuth0] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();

  useEffect(() => {
    // Check if user is already authenticated with regular login
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      fetchUserData(token);
    }
  }, []);

  useEffect(() => {
    const handleAuth0Login = async () => {
      console.log('=== AUTH0 EFFECT TRIGGERED ===');
      console.log('isLoading:', isLoading);
      console.log('isAuthenticated:', isAuthenticated);
      console.log('user:', user);
      console.log('isProcessingAuth0:', isProcessingAuth0);

      // Prevent multiple executions
      if (isProcessingAuth0) {
        console.log('Already processing Auth0, skipping...');
        return;
      }
      
      // Wait for Auth0 to finish loading
      if (isLoading) {
        console.log('Auth0 is still loading...');
        return;
      }

      // If not authenticated via Auth0, skip
      if (!isAuthenticated) {
        console.log('User is not authenticated via Auth0');
        return;
      }

      // If no user data, skip
      if (!user) {
        console.log('No Auth0 user data available');
        return;
      }

      // Check if we already have a token from regular login
      const existingToken = localStorage.getItem('token');
      if (existingToken) {
        console.log('User already has a token, checking if it works...');
        try {
          const userResponse = await fetch('http://localhost:3000/api/user', {
            headers: { Authorization: `Bearer ${existingToken}` },
          });
          if (userResponse.ok) {
            console.log('Existing token is valid, navigating...');
            navigate('/');
            return;
          }
        } catch (error) {
          console.log('Existing token is invalid, proceeding with Auth0...');
          localStorage.removeItem('token');
        }
      }

      setIsProcessingAuth0(true);

      try {
        console.log('=== STARTING AUTH0 PROCESS ===');
        console.log('Auth0 user object:', JSON.stringify(user, null, 2));
        
        // Try to get Auth0 access token
        let accessToken;
        try {
          accessToken = await getAccessTokenSilently({
            audience: "https://dev-dwidrngxdwz2oh0g.us.auth0.com/api/v2/",
            scope: 'read:current_user openid profile email',
          });
          console.log('Auth0 access token retrieved:', accessToken ? 'YES' : 'NO');
        } catch (tokenError) {
          console.error('Failed to get Auth0 token:', tokenError);
          toast.error('Failed to get authentication token', { theme: 'dark' });
          return;
        }

        // Prepare user data for backend
        const userData = {
          auth0Id: user.sub,
          name: user.name || user.nickname || user.given_name || user.email?.split('@')[0] || 'Unknown User',
          email: user.email,
          picture: user.picture,
        };

        console.log('=== SENDING TO BACKEND ===');
        console.log('User data:', JSON.stringify(userData, null, 2));
        console.log('Backend URL:', 'http://localhost:3000/api/authsignup');

        // Send to backend with better error handling
        const response = await axios.post(
          'http://localhost:3000/api/authsignup',
          userData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            timeout: 10000, // 10 second timeout
          }
        );

        console.log('=== BACKEND RESPONSE ===');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));

        if (response.data && response.data.token) {
          // Store the JWT token from backend
          localStorage.setItem('token', response.data.token);
          console.log('Token stored in localStorage');
          
          toast.success('Login successful! Welcome ' + userData.name, { theme: 'dark' });
          
          // Navigate to home page
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          throw new Error('No token received from backend');
        }

      } catch (error) {
        console.error('=== AUTH0 LOGIN ERROR ===');
        console.error('Error:', error);
        
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
          console.error('Response headers:', error.response.headers);
        }
        
        // Clear any stored tokens on error
        localStorage.removeItem('token');
        
        let errorMessage = 'Failed to process login';
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast.error(`Login failed: ${errorMessage}`, { theme: 'dark' });
        
      } finally {
        setIsProcessingAuth0(false);
      }
    };

    // Add a small delay to ensure Auth0 has fully initialized
    const timeoutId = setTimeout(handleAuth0Login, 500);
    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, user, isLoading, getAccessTokenSilently, navigate, isProcessingAuth0]);

  const fetchUserData = async (token) => {
    try {
      const userResponse = await fetch('http://localhost:3000/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = await userResponse.json();
      if (userResponse.ok) {
        console.log('User data fetched:', userData);
        navigate('/');
      } else {
        throw new Error(userData.message || 'Failed to fetch user data');
      }
    } catch (err) {
      console.error('Fetch user error:', err);
      localStorage.removeItem('token');
      toast.error('Session expired. Please login again.', { theme: 'dark' });
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields', { theme: 'dark' });
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/clientlogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        toast.success('Login successful!', { theme: 'dark' });
        fetchUserData(data.token);
      } else {
        toast.error(data.message || 'Login failed', { theme: 'dark' });
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.message || 'Server error. Please try again.', { theme: 'dark' });
    }
  };

  return (
    <>
      <div className="w-full max-w-5xl bg-gray-800/80 backdrop-blur-lg p-8 rounded-xl shadow-xl border border-gray-700/30">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">Client Login</h2>
        
        {/* Show loading state during Auth0 processing */}
        {(isLoading || isProcessingAuth0) && (
          <div className="mb-4 p-3 bg-blue-900/30 border border-blue-500/50 rounded text-blue-200 text-center">
            {isLoading ? 'Loading authentication...' : 'Processing login...'}
          </div>
        )}

        {/* Show Auth0 user info for debugging */}
        {isAuthenticated && user && (
          <div className="mb-4 p-3 bg-green-900/30 border border-green-500/50 rounded text-green-200 text-sm">
            <strong>Auth0 Status:</strong> Authenticated as {user.email}
            <br />
            <strong>Processing:</strong> {isProcessingAuth0 ? 'Yes' : 'No'}
          </div>
        )}
        
        <LoginButton />
        
        <div className="flex items-center my-4 mt-10">
          <hr className="flex-grow border-gray-600" />
          <p className="mx-4 text-sm text-gray-500">OR</p>
          <hr className="flex-grow border-gray-600" />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-600"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-600"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={isProcessingAuth0 || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded font-medium"
          >
            {isProcessingAuth0 || isLoading ? 'Processing...' : 'Login as Client'}
          </button>
          <p className="text-center text-sm text-gray-300 mt-4">
            Not signed up yet?{' '}
            <a
              href="/clientsignup"
              className="text-blue-600 hover:text-blue-700 underline font-medium transition-colors"
            >
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </>
  );
};

export default ClientLogin;