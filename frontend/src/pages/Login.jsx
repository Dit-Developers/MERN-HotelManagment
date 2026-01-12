import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    Email: '',
    Password: ''
  });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login, loading, error: authError, getRememberedEmail, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  // Initialize form with remembered Email on component mount
  useEffect(() => {
    // Clear any previous auth errors when component mounts
    clearError();
    
    // Check for remembered Email
    const rememberedEmail = getRememberedEmail();
    if (rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        Email: rememberedEmail
      }));
      setRememberMe(true);
    }
    
    // Check for any message from navigation (like session expired)
    if (location.state?.message) {
      // Could show a toast notification here
      console.log('Navigation message:', location.state.message);
    }
    
    // Cleanup function
    return () => {
      // Cleanup if needed
    };
  }, [clearError, getRememberedEmail, location.state]);

  // Auto-focus Email input on mount for better UX
  useEffect(() => {
    const EmailInput = document.getElementById('Email');
    if (EmailInput && !formData.Email) {
      EmailInput.focus();
    }
  }, [formData.Email]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle remember me checkbox change
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.Email.trim()) {
      newErrors.Email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
      newErrors.Email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.Password) {
      newErrors.Password = 'Password is required';
    } else if (formData.Password.length < 2) {
      newErrors.Password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Focus on first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.focus();
        }
      }
      return;
    }
    
    try {
      await login(formData.Email, formData.Password, rememberMe);
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by auth context
      // Focus on Password field on login failure for better UX
      const PasswordInput = document.getElementById('Password');
      if (PasswordInput) {
        PasswordInput.focus();
        PasswordInput.select();
      }
    }
  };

  // Handle Enter key press for better UX
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !loading) {
        const form = e.target.closest('form');
        if (form) {
          handleSubmit(e);
        }
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [loading]);

  // Show loading state effect
  useEffect(() => {
    if (loading) {
      // Disable form inputs during loading
      const inputs = document.querySelectorAll('input, button');
      inputs.forEach(input => {
        input.setAttribute('disabled', 'true');
      });
    } else {
      // Re-enable form inputs
      const inputs = document.querySelectorAll('input, button');
      inputs.forEach(input => {
        input.removeAttribute('disabled');
      });
    }
  }, [loading]);

  // Handle demo credential click
  const handleDemoCredentialClick = (Email, Password) => {
    setFormData({
      Email,
      Password
    });
    
    // Auto-submit after a short delay for demo convenience
    setTimeout(() => {
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton && !loading) {
        submitButton.click();
      }
    }, 100);
  };

  // Reset form
  const handleResetForm = () => {
    setFormData({
      Email: '',
      Password: ''
    });
    setErrors({});
    setRememberMe(false);
    
    const EmailInput = document.getElementById('Email');
    if (EmailInput) {
      EmailInput.focus();
    }
  };

  // Building Icon Component
  const BuildingIcon = () => (
    <svg 
      className="h-12 w-12" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
      />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F5FBE6' }}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div 
              className="p-3 rounded-full transition-transform hover:scale-105" 
              style={{ backgroundColor: '#215E61', color: 'white' }}
            >
              <BuildingIcon />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to LuxuryStay
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10 transition-shadow hover:shadow-xl">
          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md animate-pulse">
              <p className="text-sm text-red-600 font-medium">{authError}</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div>
              <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="mt-1 relative">
                <input
                  id="Email"
                  name="Email"
                  type="Email"
                  autoComplete="Email"
                  required
                  value={formData.Email}
                  onChange={handleChange}
                  disabled={loading}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 sm:text-sm transition-colors ${
                    errors.Email 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  } ${loading ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  style={{ 
                    borderColor: errors.Email ? undefined : '#215E61',
                  }}
                  placeholder="you@example.com"
                />
                {errors.Email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {errors.Email && <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.Email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="Password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="Password"
                  name="Password"
                  type="Password"
                  autoComplete="current-Password"
                  required
                  value={formData.Password}
                  onChange={handleChange}
                  disabled={loading}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 sm:text-sm transition-colors ${
                    errors.Password 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  } ${loading ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  style={{ 
                    borderColor: errors.Password ? undefined : '#215E61',
                  }}
                  placeholder="••••••••"
                />
                {errors.Password && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {errors.Password && <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.Password}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  disabled={loading}
                  className="h-4 w-4 rounded border-gray-300 transition-colors focus:ring-blue-500"
                  style={{ accentColor: '#215E61' }}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-Password')}
                  disabled={loading}
                  className="font-medium hover:text-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ color: '#215E61' }}
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
                style={{ backgroundColor: '#215E61' }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign in'}
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="font-medium hover:text-opacity-80 transition-colors" 
                  style={{ color: '#215E61' }}
                  onClick={(e) => loading && e.preventDefault()}
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Demo Credentials:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded hover:bg-gray-100 transition-colors cursor-pointer group"
                   onClick={() => handleDemoCredentialClick('guest@example.com', 'Password123')}>
                <span className="font-medium">Guest:</span>
                <span className="font-mono text-gray-500 group-hover:text-gray-700 transition-colors">
                  guest@example.com / Password123
                </span>
                <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">Click to use</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded hover:bg-gray-100 transition-colors cursor-pointer group"
                   onClick={() => handleDemoCredentialClick('admin@hotel.com', 'admin123')}>
                <span className="font-medium">Admin:</span>
                <span className="font-mono text-gray-500 group-hover:text-gray-700 transition-colors">
                  admin@hotel.com / admin123
                </span>
                <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">Click to use</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded hover:bg-gray-100 transition-colors cursor-pointer group"
                   onClick={() => handleDemoCredentialClick('reception@hotel.com', 'reception123')}>
                <span className="font-medium">Receptionist:</span>
                <span className="font-mono text-gray-500 group-hover:text-gray-700 transition-colors">
                  reception@hotel.com / reception123
                </span>
                <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">Click to use</span>
              </div>
            </div>
          </div>

          {/* Reset Form Button */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleResetForm}
              disabled={loading}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;