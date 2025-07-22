import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import login_img from '../assets/unsplash_EVgsAbL51Rk.png';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get('role') || 'user';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Simplified validation for email and password
  useEffect(() => {
    const newErrors = {};
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    const endpoint = role === 'admin' ? '/api/admin-login/' : '/api/user-login/';
    const payload = { email: formData.email, password: formData.password };

    try {
      const response = await axios.post(`http://127.0.0.1:8000${endpoint}`, payload);

      if (response.data.status === 'success') {
        // --- STORE TOKENS IN LOCALSTORAGE ---
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
        if(role === 'admin') {
          localStorage.setItem('admin_name', response.data.adminName);
        }

        navigate(role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
      }
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    const hasNoErrors = Object.keys(errors).length === 0;
    const hasRequiredFields = formData.email.trim() && formData.password.trim();
    return hasNoErrors && hasRequiredFields;
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >


          {/* Branding */}
          <div className="mb-15 pl-40">
            <h1 className="text-2xl font-bold text-gray-900">
              Event <span className="text-purple-600">Hive</span>
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl  font-bold text-gray-900 mb-2 pl-20">Sign In to Event Hive</h2>
            {/* <p className="text-gray-600 pl-39 mt-5">{role === 'admin' ? 'Admin Portal Access' : 'Welcome back to your account'}</p> */}
          </div>

          {loginError && (
            <motion.div
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{loginError}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field (for both User and Admin) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 uppercase">
                Your Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <motion.div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </motion.div>
                )}
              </div>
              {errors.email && (
                <motion.p
                  className="mt-2 text-sm text-red-600"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 uppercase">Password</label>
                <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-purple-600 transition-colors">
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 pr-12 transition-colors ${
                    errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  className="mt-2 text-sm text-red-600"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                isFormValid() && !isLoading
                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link to={`/signup?role=${role}`} className="text-purple-600 hover:text-purple-700 font-medium">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:flex flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 z-10"></div>
        <img src={login_img} alt="Event" className="w-screen h-screen object-cover" />
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="text-center text-white p-8 bg-black/30 backdrop-blur-sm rounded-2xl max-w-md">
            <h3 className="text-3xl font-bold mb-4">Hello Friend</h3>
            <p className="text-lg opacity-90 leading-relaxed">
              To keep connected with us please login with your personal information
            </p>
                        <Link to={`/login?role=${role}`}>
                          <motion.button
                            className="px-8 py-3 border-2 border-white text-white mt-4 rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300 font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Sign In
                          </motion.button>
                        </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}