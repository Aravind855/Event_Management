import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, ArrowLeft, Check, X } from 'lucide-react';
import singup_img from '../assets/unsplash_UCbMZ0S-w28.png';



export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get('role') || 'user';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRequirements = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

useEffect(() => {
  const newErrors = {};

  if (formData.name && (!/^[A-Za-z ]+$/.test(formData.name) || formData.name.length < 2)) {
    newErrors.name = 'Name must contain only letters and be at least 2 characters';
  }

  if (formData.email && !/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(formData.email)) {
    newErrors.email = 'Please enter a valid email address';
  }

  if (formData.password && formData.password.length < 8) {
    newErrors.password = 'Password must be at least 8 characters';
  }

  if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match';
  }

  setErrors(newErrors);
}, [formData]);


  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setMessage('');
  };

    const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setMessage('');

  const endpoint = role === 'admin' ? '/api/admin-signup/' : '/api/user-signup/';
  const payload = {
    name: formData.name,
    email: formData.email,
    password: formData.password,
  };

  try {
    const response = await fetch(`https://event-management-m7h6.onrender.com${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || result.status !== 'success') {
      setMessage(result.message || 'Signup failed');
      setMessageType('error');
    } else {
      setMessage(result.message);
      setMessageType('success');

      // ✅ Redirect to login page with role param
      setTimeout(() => {
        navigate(`/login?role=${role}`);
      }, 2000);
    }
  } catch (error) {
    setMessage('Something went wrong. Please try again.');
    setMessageType('error');
  } finally {
    setIsLoading(false);
  }
};


  const isFormValid = () => {
    const hasNoErrors = Object.keys(errors).length === 0;
    const hasRequiredFields =
      formData.name && formData.email && formData.password && formData.confirmPassword;
    const passwordsMatch = formData.password === formData.confirmPassword;
    return hasNoErrors && hasRequiredFields && passwordsMatch;
  };

    const getPasswordStrength = () => {
    if (formData.password.length < 6) {
        return { text: 'Weak', color: 'text-red-500', bg: 'bg-red-500' };
    }

    const score = Object.values(passwordRequirements).filter(Boolean).length;

    if (score < 3) return { text: 'Weak', color: 'text-red-500', bg: 'bg-red-500' };
    if (score === 3 || score === 4) return { text: 'Medium', color: 'text-yellow-500', bg: 'bg-yellow-500' };
    return { text: 'Strong', color: 'text-green-500', bg: 'bg-green-500' };
    };


  return (
    <div className="min-h-screen flex">
      {/* Left: Visual Section */}
      <div className="hidden lg:flex flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 z-10"></div>
        <img
          src={singup_img}
          alt="Welcome"
          className="w-full h-screen object-cover"
        />
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="text-center text-white p-8 bg-black/30 backdrop-blur-sm rounded-2xl max-w-md">
            <h3 className="text-3xl font-bold mb-4">Welcome back</h3>
            <p className="text-lg opacity-90 leading-relaxed mb-6">
              To keep connected with us provide us with your information
            </p>
            <Link to={`/login?role=${role}`}>
              <motion.button
                className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right: Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >


          <h1 className="text-2xl font-bold text-gray-900 mb-6 pl-41">
            Event <span className="text-purple-600">Hive</span>
          </h1>

          <h2 className="text-3xl font-bold text-gray-900 mb-15 pl-20">Sign Up to Event Hive</h2>
          {/* <p className="text-gray-600 mb-6 pl-35 mt-5">
            {role === 'admin' ? 'Create your admin account' : 'Join our community today'}
          </p> */}

          {message && (
            <motion.div
              className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
                messageType === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {messageType === 'success' ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <p className={`text-sm ${messageType === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                {message}
              </p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-black-700 mb-2">Your Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                }`}
                placeholder="Enter your name"
              />
              {errors.name && (
                <motion.p
                  className="mt-2 text-sm text-red-600"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.name}
                </motion.p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-black-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                }`}
                placeholder="Enter your email"
              />
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

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-black-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 pr-12 ${
                    errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-black-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 text-xs text-gray-600">
                  Strength: <span className={getPasswordStrength().color}>{getPasswordStrength().text}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 pr-12 ${
                    errors.confirmPassword
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-purple-500'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  className="mt-2 text-sm text-red-600"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition duration-300 ${
                isFormValid() && !isLoading
                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              whileTap={{ scale: 0.97 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Sign Up'
              )}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to={`/login?role=${role}`} className="text-purple-600 hover:text-purple-700 font-medium">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
