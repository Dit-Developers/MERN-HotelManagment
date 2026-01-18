import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserTag, FaBriefcase, FaArrowRight, FaHotel, FaEye, FaEyeSlash } from 'react-icons/fa';
import FormStatus from '../component/FormStatus';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    role: 'guest'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    fullName: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    general: ''
  });
  const [touched, setTouched] = useState({
    fullName: false,
    username: false,
    phone: false,
    email: false,
    password: false
  });

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
    fullName: {
      required: 'Full name is required',
      minLength: 2,
      minLengthMessage: 'Full name must be at least 2 characters',
      maxLength: 100,
      maxLengthMessage: 'Full name cannot exceed 100 characters',
      pattern: /^[a-zA-Z\s.'-]+$/,
      patternMessage: 'Full name can only contain letters, spaces, apostrophes, dots, and hyphens'
    },
    username: {
      required: 'Username is required',
      minLength: 3,
      minLengthMessage: 'Username must be at least 3 characters',
      maxLength: 30,
      maxLengthMessage: 'Username cannot exceed 30 characters',
      pattern: /^[a-zA-Z0-9_]+$/,
      patternMessage: 'Username can only contain letters, numbers, and underscores'
    },
    email: {
      required: 'Email is required',
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
      maxLength: 100,
      maxLengthMessage: 'Email cannot exceed 100 characters'
    },
    phone: {
      required: 'Phone number is required',
      pattern: /^\+?[1-9]\d{0,15}$/,
      message: 'Please enter a valid phone number',
      maxLength: 15,
      maxLengthMessage: 'Phone number cannot exceed 15 digits'
    },
    password: {
      required: 'Password is required',
      minLength: 8,
      minLengthMessage: 'Password must be at least 8 characters',
      maxLength: 50,
      maxLengthMessage: 'Password cannot exceed 50 characters',
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      patternMessage: 'Password must contain uppercase, lowercase, number, and special character'
    }
  };

  // Validate individual field
  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';
    
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
      fullName: validateField('fullName', formData.fullName),
      username: validateField('username', formData.username),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      password: validateField('password', formData.password),
      general: ''
    };

    setErrors(newErrors);
    return !newErrors.fullName && !newErrors.username && !newErrors.email && 
           !newErrors.phone && !newErrors.password;
  };

  // Handle blur event
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Handle input change with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (touched[name] && errors[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Real-time validation for password strength
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    
    const strengthData = {
      0: { text: 'Very Weak', color: 'text-red-500' },
      1: { text: 'Weak', color: 'text-red-400' },
      2: { text: 'Fair', color: 'text-yellow-500' },
      3: { text: 'Good', color: 'text-green-400' },
      4: { text: 'Strong', color: 'text-green-500' },
      5: { text: 'Very Strong', color: 'text-green-600' }
    };
    
    return { strength, ...strengthData[Math.min(strength, 5)] };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      fullName: true,
      username: true,
      email: true,
      phone: true,
      password: true
    });
    
    // Validate form
    if (!validateForm()) {
      setError('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    setErrors(prev => ({ ...prev, general: '' }));

    try {
      const response = await axios.post('http://localhost:5001/api/register', formData);
      
      if (response.status === 201) {
        setSuccess('Registration successful! You will be redirected to login shortly.');
        
        // Reset form
        setFormData({
          fullName: '',
          username: '',
          phone: '',
          email: '',
          password: '',
          role: 'guest'
        });
        
        // Reset errors and touched
        setErrors({
          fullName: '',
          username: '',
          phone: '',
          email: '',
          password: '',
          general: ''
        });
        setTouched({
          fullName: false,
          username: false,
          phone: false,
          email: false,
          password: false
        });
        
        // Store token if needed
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      setErrors(prev => ({ ...prev, general: errorMessage }));
    } finally {
      setLoading(false);
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return formData.fullName.trim() && 
           formData.username.trim() && 
           formData.email.trim() && 
           formData.phone.trim() && 
           formData.password.trim() && 
           !errors.fullName && 
           !errors.username && 
           !errors.email && 
           !errors.phone && 
           !errors.password;
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
      
      <div className="relative w-full max-w-5xl" style={{ minHeight: '800px' }}>
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
            Join <span style={{ color: customStyles.gold[500] }} className="font-normal">Luxury Hotel</span>
          </h1>
          
          <p className="text-gray-600 text-sm sm:text-base font-light max-w-2xl mx-auto">
            Create your account to access exclusive benefits and manage your reservations
          </p>
        </div>
        
        {/* Registration Form Container */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200" style={{ height: 'auto', minHeight: '700px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Left Column - Form */}
            <div className="p-6 sm:p-8 lg:p-10 overflow-y-auto" style={{ maxHeight: '700px' }}>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <FaUser className="text-lg" style={{ color: customStyles.gold[600] }} />
                  <span 
                    className="font-light tracking-[0.2em] uppercase text-xs"
                    style={{ color: customStyles.gold[600] }}
                  >
                    Create Account
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-light tracking-wide"
                  style={{ color: customStyles.navy[900] }}
                >
                  Register New Account
                </h2>
              </div>
              
              <FormStatus
                type="error"
                message={error || errors.general}
                onClose={() => {
                  setError('');
                  setErrors(prev => ({ ...prev, general: '' }));
                }}
              />

              <FormStatus
                type="success"
                message={success}
                onClose={() => {
                  setSuccess('');
                }}
              />
              
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: customStyles.navy[800] }}>
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaUser className={`${errors.fullName && touched.fullName ? 'text-red-500' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        onBlur={() => handleBlur('fullName')}
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-colors duration-300 ${
                          errors.fullName && touched.fullName 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:border-gold-500 focus:ring-gold-500'
                        }`}
                        style={{ color: customStyles.navy[900] }}
                        placeholder="John Doe"
                        disabled={loading}
                      />
                    </div>
                    {errors.fullName && touched.fullName && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        {errors.fullName}
                      </p>
                    )}
                  </div>
                  
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: customStyles.navy[800] }}>
                      Username *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaUserTag className={`${errors.username && touched.username ? 'text-red-500' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        onBlur={() => handleBlur('username')}
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-colors duration-300 ${
                          errors.username && touched.username 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:border-gold-500 focus:ring-gold-500'
                        }`}
                        style={{ color: customStyles.navy[900] }}
                        placeholder="johndoe"
                        disabled={loading}
                      />
                    </div>
                    {errors.username && touched.username && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        {errors.username}
                      </p>
                    )}
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: customStyles.navy[800] }}>
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaEnvelope className={`${errors.email && touched.email ? 'text-red-500' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => handleBlur('email')}
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-colors duration-300 ${
                          errors.email && touched.email 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:border-gold-500 focus:ring-gold-500'
                        }`}
                        style={{ color: customStyles.navy[900] }}
                        placeholder="name@example.com"
                        disabled={loading}
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
                  
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: customStyles.navy[800] }}>
                      Phone Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaPhone className={`${errors.phone && touched.phone ? 'text-red-500' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={() => handleBlur('phone')}
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-colors duration-300 ${
                          errors.phone && touched.phone 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:border-gold-500 focus:ring-gold-500'
                        }`}
                        style={{ color: customStyles.navy[900] }}
                        placeholder="+12345678900"
                        disabled={loading}
                      />
                    </div>
                    {errors.phone && touched.phone && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  
                  {/* Password */}
                  <div className="sm:col-span-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium" style={{ color: customStyles.navy[800] }}>
                        Password *
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
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={() => handleBlur('password')}
                        className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-colors duration-300 ${
                          errors.password && touched.password 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:border-gold-500 focus:ring-gold-500'
                        }`}
                        style={{ color: customStyles.navy[900] }}
                        placeholder="••••••••"
                        disabled={loading}
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
                    
                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-xs font-medium ${passwordStrength.color}`}>
                            {passwordStrength.text}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formData.password.length}/50
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              passwordStrength.strength <= 2 ? 'bg-red-500' :
                              passwordStrength.strength === 3 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Password Requirements */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className={`text-xs flex items-center ${/^.{8,}$/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                        {/^.{8,}$/.test(formData.password) ? (
                          <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                          </svg>
                        )}
                        8+ characters
                      </div>
                      <div className={`text-xs flex items-center ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                        {/[a-z]/.test(formData.password) ? (
                          <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                          </svg>
                        )}
                        Lowercase letter
                      </div>
                      <div className={`text-xs flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                        {/[A-Z]/.test(formData.password) ? (
                          <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                          </svg>
                        )}
                        Uppercase letter
                      </div>
                      <div className={`text-xs flex items-center ${/\d/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                        {/\d/.test(formData.password) ? (
                          <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                          </svg>
                        )}
                        Number
                      </div>
                      <div className={`text-xs flex items-center ${/[@$!%*?&]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                        {/[@$!%*?&]/.test(formData.password) ? (
                          <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                          </svg>
                        )}
                        Special character
                      </div>
                    </div>
                    
                    {errors.password && touched.password && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        {errors.password}
                      </p>
                    )}
                  </div>
                  
                  {/* Role - Enhanced Dropdown */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-2" style={{ color: customStyles.navy[800] }}>
                      Account Type *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <FaBriefcase className="text-gray-400" />
                      </div>
                      
                      {/* Custom Dropdown Trigger */}
                      <div className="relative">
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all duration-300 appearance-none bg-white cursor-pointer hover:border-gold-400"
                          style={{ color: customStyles.navy[900] }}
                          disabled={loading}
                        >
                          <option value="guest">Guest / Customer</option>
                          <option value="receptionist">Receptionist</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Administrator</option>
                          <option value="staff">Staff</option>
                        </select>
                        
                        {/* Custom Arrow */}
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <svg 
                            className="w-5 h-5 text-gray-400 transition-transform duration-300 group-focus-within:rotate-180" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Role Icons Preview */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <div 
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${formData.role === 'guest' ? 'ring-2 ring-offset-1' : 'opacity-60 hover:opacity-100'}`}
                          style={formData.role === 'guest' ? {
                            backgroundColor: customStyles.gold[50],
                            color: customStyles.gold[700],
                            borderColor: customStyles.gold[300],
                            borderWidth: '1px'
                          } : {
                            backgroundColor: customStyles.navy[50],
                            color: customStyles.navy[700],
                            borderColor: customStyles.navy[200],
                            borderWidth: '1px'
                          }}
                          onClick={() => setFormData({...formData, role: 'guest'})}
                        >
                          <FaUser className="mr-1.5 text-xs" />
                          Guest
                        </div>
                        
                        <div 
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${formData.role === 'receptionist' ? 'ring-2 ring-offset-1' : 'opacity-60 hover:opacity-100'}`}
                          style={formData.role === 'receptionist' ? {
                            backgroundColor: customStyles.gold[50],
                            color: customStyles.gold[700],
                            borderColor: customStyles.gold[300],
                            borderWidth: '1px'
                          } : {
                            backgroundColor: customStyles.navy[50],
                            color: customStyles.navy[700],
                            borderColor: customStyles.navy[200],
                            borderWidth: '1px'
                          }}
                          onClick={() => setFormData({...formData, role: 'receptionist'})}
                        >
                          <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          Receptionist
                        </div>
                        
                        <div 
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${formData.role === 'manager' ? 'ring-2 ring-offset-1' : 'opacity-60 hover:opacity-100'}`}
                          style={formData.role === 'manager' ? {
                            backgroundColor: customStyles.gold[50],
                            color: customStyles.gold[700],
                            borderColor: customStyles.gold[300],
                            borderWidth: '1px'
                          } : {
                            backgroundColor: customStyles.navy[50],
                            color: customStyles.navy[700],
                            borderColor: customStyles.navy[200],
                            borderWidth: '1px'
                          }}
                          onClick={() => setFormData({...formData, role: 'manager'})}
                        >
                          <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Manager
                        </div>
                        
                        <div 
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${formData.role === 'admin' ? 'ring-2 ring-offset-1' : 'opacity-60 hover:opacity-100'}`}
                          style={formData.role === 'admin' ? {
                            backgroundColor: customStyles.gold[50],
                            color: customStyles.gold[700],
                            borderColor: customStyles.gold[300],
                            borderWidth: '1px'
                          } : {
                            backgroundColor: customStyles.navy[50],
                            color: customStyles.navy[700],
                            borderColor: customStyles.navy[200],
                            borderWidth: '1px'
                          }}
                          onClick={() => setFormData({...formData, role: 'admin'})}
                        >
                          <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Admin
                        </div>
                        
                        <div 
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${formData.role === 'staff' ? 'ring-2 ring-offset-1' : 'opacity-60 hover:opacity-100'}`}
                          style={formData.role === 'staff' ? {
                            backgroundColor: customStyles.gold[50],
                            color: customStyles.gold[700],
                            borderColor: customStyles.gold[300],
                            borderWidth: '1px'
                          } : {
                            backgroundColor: customStyles.navy[50],
                            color: customStyles.navy[700],
                            borderColor: customStyles.navy[200],
                            borderWidth: '1px'
                          }}
                          onClick={() => setFormData({...formData, role: 'staff'})}
                        >
                          <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Staff
                        </div>
                      </div>
                    </div>
                    
                    {/* Role Description */}
                    <div className="mt-3 p-4 rounded-lg border border-gray-200 bg-gray-50">
                      <div className="flex items-start mb-3">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3"
                          style={{ backgroundColor: customStyles.gold[100] }}
                        >
                          <svg className="w-4 h-4" style={{ color: customStyles.gold[600] }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1" style={{ color: customStyles.navy[900] }}>
                            {formData.role === 'guest' && 'Guest / Customer Account'}
                            {formData.role === 'receptionist' && 'Receptionist Account'}
                            {formData.role === 'manager' && 'Manager Account'}
                            {formData.role === 'admin' && 'Administrator Account'}
                            {formData.role === 'staff' && 'Staff Account'}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {formData.role === 'guest' && 'Perfect for guests making reservations and managing bookings. Access to booking history and special offers.'}
                            {formData.role === 'receptionist' && 'For front desk staff managing guest check-ins, check-outs, and room assignments.'}
                            {formData.role === 'manager' && 'For hotel managers overseeing operations, staff management, and financial reporting.'}
                            {formData.role === 'admin' && 'Full system access including user management, system settings, and all hotel operations.'}
                            {formData.role === 'staff' && 'For hotel staff members with access to assigned duties and guest service tools.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Terms Agreement */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="w-4 h-4 mt-1 rounded border-gray-300 focus:ring-gold-500 text-gold-600"
                    disabled={loading}
                  />
                  <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                    I agree to the{' '}
                    <Link to="/terms" className="font-medium text-gold-600 hover:text-gold-700 transition-colors duration-300">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="font-medium text-gold-600 hover:text-gold-700 transition-colors duration-300">
                      Privacy Policy
                    </Link>
                  </label>
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
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
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
              
              {/* Login Link */}
              <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{' '}
                  <Link 
                    to="/login"
                    className="font-medium transition-colors duration-300 group inline-flex items-center"
                    style={{ color: customStyles.gold[600] }}
                    onMouseEnter={(e) => e.currentTarget.style.color = customStyles.gold[700]}
                    onMouseLeave={(e) => e.currentTarget.style.color = customStyles.gold[600]}
                  >
                    Sign in here
                    <FaArrowRight className="ml-2 text-xs group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </p>
              </div>
            </div>
            
            {/* Right Column - Info & Benefits */}
            <div 
              className="p-6 sm:p-8 lg:p-10 hidden lg:block overflow-y-auto"
              style={{ backgroundColor: customStyles.navy[900], maxHeight: '700px' }}
            >
              <div className="h-full flex flex-col justify-center">
                <div className="mb-8">
                  <h3 className="text-2xl font-serif font-light text-white mb-4">
                    Benefits of <span style={{ color: customStyles.gold[500] }}>Registering</span>
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Create your Luxury Hotel account to unlock exclusive features and personalized services
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div 
                      className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full mr-4"
                      style={{ backgroundColor: customStyles.gold[900] }}
                    >
                      <svg className="w-5 h-5 text-gold-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Easy Booking</h4>
                      <p className="text-gray-400 text-sm">Quick access to room reservations and modifications</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div 
                      className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full mr-4"
                      style={{ backgroundColor: customStyles.gold[900] }}
                    >
                      <svg className="w-5 h-5 text-gold-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Secure Account</h4>
                      <p className="text-gray-400 text-sm">Military-grade encryption for your personal data</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div 
                      className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full mr-4"
                      style={{ backgroundColor: customStyles.gold[900] }}
                    >
                      <svg className="w-5 h-5 text-gold-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Priority Support</h4>
                      <p className="text-gray-400 text-sm">Dedicated customer service for registered members</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div 
                      className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full mr-4"
                      style={{ backgroundColor: customStyles.gold[900] }}
                    >
                      <svg className="w-5 h-5 text-gold-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Exclusive Offers</h4>
                      <p className="text-gray-400 text-sm">Member-only discounts and promotional rates</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 pt-8 border-t border-gray-800">
                  <p className="text-gray-400 text-xs">
                    By creating an account, you agree to our terms and conditions. Your information is protected by our security measures.
                  </p>
                </div>
              </div>
            </div>
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

export default Register;
