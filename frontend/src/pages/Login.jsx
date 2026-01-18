import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaHotel, FaShieldAlt, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import FormStatus from '../component/FormStatus';
import { API_URL } from '../config/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });
  const navigate = useNavigate();

  const customStyles = {
    navy: {
      50: '#f0f4f8',
      100: '#d9e2ec',
      200: '#bcccdc',
      300: '#9fb3c8',
      400: '#829ab1',
      500: '#627d98',
      600: '#486581',
      700: '#334e68',
      800: '#243b53',
      900: '#102a43',
    },
    gold: {
      50: '#fff9e6',
      100: '#ffefbf',
      200: '#ffe599',
      300: '#ffdb73',
      400: '#ffd14d',
      500: '#c7a53f',
      600: '#b89434',
      700: '#9e7b2e',
      800: '#856328',
      900: '#6c4c22',
    }
  };

  // Validation rules
  const validationRules = {
    email: {
      required: 'Email is required',
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
      maxLength: 100,
      maxLengthMessage: 'Email cannot exceed 100 characters'
    },
    password: {
      required: 'Password is required',
      minLength: 6,
      minLengthMessage: 'Password must be at least 6 characters',
      maxLength: 50,
      maxLengthMessage: 'Password cannot exceed 50 characters',
      patternMessage: 'Password should contain letters and numbers'
    }
  };

  // Validate individual field
  const validateField = (name, value) => {
    const rules = validationRules[name];
    let error = '';

    if (!value.trim()) {
      error = rules.required;
    } else if (rules.pattern && !rules.pattern.test(value)) {
      error = rules.message || rules.patternMessage;
    } else if (rules.minLength && value.length < rules.minLength) {
      error = rules.minLengthMessage;
    } else if (rules.maxLength && value.length > rules.maxLength) {
      error = rules.maxLengthMessage;
    }

    return error;
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {
      email: validateField('email', email),
      password: validateField('password', password),
      general: ''
    };

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  // Handle blur event
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, field === 'email' ? email : password);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Real-time validation for email on type
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (touched.email) {
      const error = validateField('email', value);
      setErrors(prev => ({ ...prev, email: error }));
    }
  };

  // Real-time validation for password on type
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    if (touched.password) {
      const error = validateField('password', value);
      setErrors(prev => ({ ...prev, password: error }));
    }
  };

  // Check if user is already logged in on component mount
  const redirectToDashboard = useCallback((role) => {
    switch (role) {
      case 'admin':
        navigate('/admin-dashboard');
        break;
      case 'manager':
        navigate('/manager-dashboard');
        break;
      case 'receptionist':
        navigate('/reception-dashboard');
        break;
      case 'staff':
        navigate('/staff-dashboard');
        break;
      case 'user':  
      case 'guest':
        navigate('/');
        break;
      default:
        navigate('/guest-dashboard');
    } 
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    
    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        redirectToDashboard(user.role);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.clear();
      }
    }
  }, [redirectToDashboard]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      email: true,
      password: true
    });
    
    // Validate form
    if (!validateForm()) {
      setMessage('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    setMessage('');
    setErrors(prev => ({ ...prev, general: '' }));

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: email.trim(),
        password: password
      });

      // Store token and user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setMessage('Login successful! Redirecting...');

      // Redirect based on user role after 1 second
      setTimeout(() => {
        redirectToDashboard(response.data.user.role);
      }, 1000);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setMessage(errorMessage);
      setErrors(prev => ({ ...prev, general: errorMessage }));
      
      // Clear password field on failed login attempt
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  // Check if form is valid (for button styling)
  const isFormValid = () => {
    return email.trim() && password.trim() && !errors.email && !errors.password;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-12">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10"
          style={{ backgroundColor: customStyles.navy[900] }}
        ></div>
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10"
          style={{ backgroundColor: customStyles.gold[600] }}
        ></div>
      </div>
      
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
            style={{ backgroundColor: customStyles.gold[100] }}
          >
            <FaHotel className="text-3xl" style={{ color: customStyles.gold[600] }} />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-serif font-light mb-4 tracking-tight"
            style={{ color: customStyles.navy[900] }}
          >
            Welcome to <span style={{ color: customStyles.gold[500] }} className="font-normal">Luxury Hotel</span>
          </h1>
          
          <p className="text-gray-600 text-sm sm:text-base font-light">
            Sign in to access your account and manage your bookings
          </p>
        </div>
        
        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <FaShieldAlt className="text-lg" style={{ color: customStyles.gold[600] }} />
                <span 
                  className="font-light tracking-[0.2em] uppercase text-xs"
                  style={{ color: customStyles.gold[600] }}
                >
                  Secure Login
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-light tracking-wide"
                style={{ color: customStyles.navy[900] }}
              >
                Sign In to Your Account
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: customStyles.navy[800] }}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className={`${errors.email && touched.email ? 'text-red-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => handleBlur('email')}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-colors duration-300 ${
                      errors.email && touched.email 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-gold-500 focus:ring-gold-500'
                    }`}
                    style={{ color: customStyles.navy[900] }}
                    placeholder="name@example.com"
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
                {errors.email && touched.email && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>
              
              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium" style={{ color: customStyles.navy[800] }}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-gray-500 hover:text-gold-600 transition-colors duration-300"
                    disabled={loading}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className={`${errors.password && touched.password ? 'text-red-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={() => handleBlur('password')}
                    className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-colors duration-300 ${
                      errors.password && touched.password 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-gold-500 focus:ring-gold-500'
                    }`}
                    style={{ color: customStyles.navy[900] }}
                    placeholder="••••••••"
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <FaEyeSlash className={`${errors.password && touched.password ? 'text-red-400 hover:text-red-600' : 'text-gray-400 hover:text-gray-600'}`} />
                    ) : (
                      <FaEye className={`${errors.password && touched.password ? 'text-red-400 hover:text-red-600' : 'text-gray-400 hover:text-gray-600'}`} />
                    )}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {errors.password}
                  </p>
                )}
                <div className="mt-2 text-xs text-gray-500">
                  Password must be at least 6 characters with letters and numbers
                </div>
              </div>
              
              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded border-gray-300 focus:ring-gold-500 text-gold-600"
                    disabled={loading}
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <Link 
                  to="/forgot-password"
                  className="text-sm font-medium transition-colors duration-300"
                  style={{ color: customStyles.gold[600] }}
                  onMouseEnter={(e) => e.currentTarget.style.color = customStyles.gold[700]}
                  onMouseLeave={(e) => e.currentTarget.style.color = customStyles.gold[600]}
                >
                  Forgot password?
                </Link>
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit" 
                className={`group w-full px-6 py-4 text-sm font-medium tracking-wider uppercase rounded-lg transition-all duration-300 transform relative overflow-hidden hover:shadow-xl ${
                  !isFormValid() || loading 
                    ? 'opacity-70 cursor-not-allowed' 
                    : 'hover:scale-105'
                }`}
                style={{ 
                  backgroundColor: isFormValid() && !loading ? customStyles.gold[600] : customStyles.gold[400],
                  color: 'white'
                }}
                disabled={!isFormValid() || loading}
                onMouseEnter={(e) => {
                  if (isFormValid() && !loading) {
                    e.currentTarget.style.backgroundColor = customStyles.gold[700];
                  }
                }}
                onMouseLeave={(e) => {
                  if (isFormValid() && !loading) {
                    e.currentTarget.style.backgroundColor = customStyles.gold[600];
                  }
                }}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </span>
                {isFormValid() && !loading && (
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(to right, ${customStyles.gold[700]}, ${customStyles.gold[800]})`
                    }}
                  ></div>
                )}
              </button>
            </form>
            
            <FormStatus
              type={message && message.includes('successful') ? 'success' : 'error'}
              message={message}
              onClose={() => setMessage('')}
            />
            
            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            {/* Social Login Options (Optional) */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">Facebook</span>
              </button>
            </div>
          </div>
          
          {/* Footer / Register Link */}
          <div className="px-6 py-6 sm:px-8 border-t border-gray-200 bg-gray-50 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link 
                to="/register"
                className="font-medium transition-colors duration-300 group inline-flex items-center"
                style={{ color: customStyles.gold[600] }}
                onMouseEnter={(e) => e.currentTarget.style.color = customStyles.gold[700]}
                onMouseLeave={(e) => e.currentTarget.style.color = customStyles.gold[600]}
              >
                Create an account
                <FaArrowRight className="ml-2 text-xs group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </p>
          </div>
        </div>
        
        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <Link 
              to="/privacy"
              className="hover:text-gray-700 transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              to="/terms"
              className="hover:text-gray-700 transition-colors duration-300"
            >
              Terms of Service
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              to="/contact"
              className="hover:text-gray-700 transition-colors duration-300"
            >
              Contact Support
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            © {new Date().getFullYear()} Luxury Hotel Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
