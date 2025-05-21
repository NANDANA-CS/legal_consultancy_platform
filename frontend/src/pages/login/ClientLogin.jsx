import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';

const ClientLogin = () => {
  const [loginMethod, setLoginMethod] = useState('google');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginWithPopup, getAccessTokenSilently } = useAuth0();

  const toggleLoginMethod = (method) => {
    setLoginMethod(method);
    setFormData({ email: '', password: '' });
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        toast.success('Login successful!', { theme: 'dark' });
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Login failed', { theme: 'dark' });
      }
    } catch (err) {
      toast.error('Server error. Please try again.', { theme: 'dark' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithPopup({
        authorizationParams: { connection: 'google-oauth2' },
      });
      const accessToken = await getAccessTokenSilently();
      const response = await fetch('http://localhost:3000/api/auth/auth0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: accessToken }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        toast.success('Login successful!', { theme: 'dark' });
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Google login failed', { theme: 'dark' });
      }
    } catch (err) {
      console.error('Popup login error:', err);
      toast.error('Google login failed. Please try again.', { theme: 'dark' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (

        <div className="bg-gray-800/70 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-700/50 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>         
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Client Login</h2>

          {loginMethod === 'google' && (
            <div className="mb-8">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="relative w-full bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-200 group"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                      />
                      <path
                        fill="#34A853"
                        d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
                      />
                      <path
                        fill="#4A90E2"
                        d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
                <div className="absolute inset-0 rounded-lg border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              
              <div className="relative flex items-center justify-center mt-8 mb-4">
                <div className="border-t border-gray-700 flex-grow"></div>
                <div className="mx-4 text-sm text-gray-500">OR</div>
                <div className="border-t border-gray-700 flex-grow"></div>
              </div>
              
              <button
                onClick={() => toggleLoginMethod('manual')}
                className="w-full py-2.5 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white rounded-lg font-medium transition-all duration-200 text-sm"
              >
                Sign in with Email
              </button>
            </div>
          )}

          {loginMethod === 'manual' && (
            <form onSubmit={handleManualLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-gray-300 text-sm font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900/70 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none transition-colors duration-200"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label htmlFor="password" className="block text-gray-300 text-sm font-medium">
                    Password
                  </label>
              
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900/70 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none transition-colors duration-200"
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-200"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Signup Link */}
          <div className="text-center mt-8">
             <p className="text-center text-sm text-gray-300 mt-4">
              Not signed up yet?{' '}
              <a
                href="/signup"
                className="text-blue-600 hover:text-blue-700 underline font-medium transition-colors"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      
  
  );
};

export default ClientLogin;

