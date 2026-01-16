import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserTag, FaBriefcase, FaArrowRight, FaHotel, FaEye, FaEyeSlash } from 'react-icons/fa';

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);
      
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
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
      
      <div className="relative w-full max-w-4xl">
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
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column - Form */}
            <div className="p-6 sm:p-8 lg:p-10">
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
              
              {/* Messages */}
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}
              
              {success && (
                <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {success}
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: customStyles.navy[800] }}>
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors duration-300"
                        style={{ color: customStyles.navy[900] }}
                        required
                        placeholder="John Doe"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: customStyles.navy[800] }}>
                      Username *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaUserTag className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors duration-300"
                        style={{ color: customStyles.navy[900] }}
                        required
                        placeholder="johndoe"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: customStyles.navy[800] }}>
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors duration-300"
                        style={{ color: customStyles.navy[900] }}
                        required
                        placeholder="name@example.com"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: customStyles.navy[800] }}>
                      Phone Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaPhone className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors duration-300"
                        style={{ color: customStyles.navy[900] }}
                        required
                        placeholder="+1 234 567 8900"
                        disabled={loading}
                      />
                    </div>
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
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors duration-300"
                        style={{ color: customStyles.navy[900] }}
                        required
                        placeholder="••••••••"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        {showPassword ? (
                          <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                        ) : (
                          <FaEye className="text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Use 8 or more characters with a mix of letters, numbers & symbols
                    </p>
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
                      
                      {/* Role Permissions */}
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {formData.role === 'guest' && (
                          <>
                            <span className="text-xs text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Make Reservations
                            </span>
                            <span className="text-xs text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              View Bookings
                            </span>
                            <span className="text-xs text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Access Offers
                            </span>
                            <span className="text-xs text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Staff Tools
                            </span>
                          </>
                        )}
                        
                        {formData.role === 'receptionist' && (
                          <>
                            <span className="text-xs text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Guest Check-in/out
                            </span>
                            <span className="text-xs text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Room Management
                            </span>
                            <span className="text-xs text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Billing System
                            </span>
                            <span className="text-xs text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Financial Reports
                            </span>
                          </>
                        )}
                        
                        {formData.role === 'manager' && (
                          <>
                            <span className="text-xs text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              All Hotel Access
                            </span>
                            <span className="text-xs text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Staff Management
                            </span>
                            <span className="text-xs text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Financial Reports
                            </span>
                            <span className="text-xs text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              System Settings
                            </span>
                          </>
                        )}
                        
                        {formData.role === 'admin' && (
                          <>
                            <span className="text-xs text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Full System Access
                            </span>
                            <span className="text-xs text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              User Management
                            </span>
                            <span className="text-xs text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              System Settings
                            </span>
                            <span className="text-xs text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              All Operations
                            </span>
                          </>
                        )}
                        
                        {formData.role === 'staff' && (
                          <>
                            <span className="text-xs text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Assigned Duties
                            </span>
                            <span className="text-xs text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Guest Service Tools
                            </span>
                            <span className="text-xs text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Financial Access
                            </span>
                            <span className="text-xs text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Management Tools
                            </span>
                          </>
                        )}
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
                  className="group w-full px-6 py-4 text-sm font-medium tracking-wider uppercase rounded-lg transition-all duration-300 transform hover:scale-105 relative overflow-hidden hover:shadow-xl"
                  style={{ 
                    backgroundColor: customStyles.gold[600],
                    color: 'white'
                  }}
                  disabled={loading}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = customStyles.gold[700])}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = customStyles.gold[600])}
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
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(to right, ${customStyles.gold[700]}, ${customStyles.gold[800]})`
                    }}
                  ></div>
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
              className="p-6 sm:p-8 lg:p-10 hidden lg:block"
              style={{ backgroundColor: customStyles.navy[900] }}
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