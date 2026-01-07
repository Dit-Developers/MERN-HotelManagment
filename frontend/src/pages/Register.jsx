// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    newsletter: true,
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // API base URL - adjust this according to your environment
  // Use import.meta.env for Vite instead of process.env
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3900';

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    // Check if terms checkbox is checked
    // We'll handle this differently to avoid DOM access
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox && !termsCheckbox.checked) {
      newErrors.terms = 'You must agree to the Terms of Service and Privacy Policy';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field if user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Clear API error when user starts typing
    if (apiError) {
      setApiError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for API (combine firstName and lastName into Name field)
      const userData = {
        Name: `${formData.firstName} ${formData.lastName}`.trim(),
        Email: formData.email,
        Password: formData.password,
        Role: "user", // Fixed role as "user" (not "guest")
        Phone: formData.phone || '',
        Address: formData.address,
        // Optional: You can add newsletter preference to Preferences field
        Preferences: {
          newsletter: formData.newsletter
        }
      };
      
      console.log('Sending registration data:', userData);
      
      // Make API call to register endpoint
      const response = await axios.post(`${API_BASE_URL}/users/Register`, userData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.status === 201) {
        console.log('Registration successful:', response.data);
        
        setSuccessMessage('Registration successful! Welcome to LuxuryStay. You will be redirected to login...');
        
        // Show success message for 3 seconds then redirect to login
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle different error scenarios
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 400 && error.response.data.message === "User already exists") {
          setApiError('This email is already registered. Please use a different email or try logging in.');
        } else {
          setApiError(error.response.data.message || error.response.data.error || 'Registration failed. Please try again.');
        }
      } else if (error.request) {
        // Request was made but no response received
        setApiError('Network error. Please check your connection and try again.');
      } else {
        // Something else happened
        setApiError('An unexpected error occurred. Please try again.');
      }
      
      // Scroll to error message
      setTimeout(() => {
        const errorElement = document.querySelector('.alert-danger');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page register-page">
      {/* Background Image */}
      <div className="auth-background"></div>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-10">
            {/* Back to Home Link */}
            <div className="back-home mb-4">
              <Link to="/" className="back-link">
                <i className="fas fa-arrow-left me-2"></i>
                Back to Home
              </Link>
            </div>
            
            {/* Registration Card */}
            <div className="auth-card">
              {/* Logo */}
              <div className="text-center mb-4">
                <div className="auth-logo">
                  <div className="logo-circle">
                    <span className="logo-text">LS</span>
                  </div>
                  <h2 className="brand-name mt-3">LuxuryStay <span className="brand-subtitle">Hospitality</span></h2>
                </div>
                <h3 className="auth-title">Create Your Account</h3>
                <p className="auth-subtitle">Join LuxuryStay for exclusive benefits and personalized experiences</p>
              </div>
              
              {/* API Error Message */}
              {apiError && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {apiError}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setApiError('')}
                    aria-label="Close"
                  ></button>
                </div>
              )}
              
              {/* Success Message */}
              {successMessage && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  {successMessage}
                </div>
              )}
              
              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label htmlFor="firstName" className="form-label">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                      {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label htmlFor="lastName" className="form-label">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                      {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                    </div>
                  </div>
                </div>
                
                <div className="form-group mb-4">
                  <label htmlFor="email" className="form-label">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                
                <div className="form-group mb-4">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    placeholder="Enter your phone number (optional)"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>
                
                <div className="form-group mb-4">
                  <label htmlFor="address" className="form-label">Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label htmlFor="password" className="form-label">Password *</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                      <small className="form-text text-muted">
                        Must be at least 8 characters with uppercase, lowercase, and number
                      </small>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                      {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                    </div>
                  </div>
                </div>
                
                <div className="form-check mb-4">
                  <input
                    type="checkbox"
                    id="newsletter"
                    name="newsletter"
                    className="form-check-input"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="newsletter" className="form-check-label">
                    Yes, I want to receive exclusive offers and updates from LuxuryStay
                  </label>
                </div>
                
                <div className="form-check mb-4">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="terms" className="form-check-label">
                    I agree to the{' '}
                    <Link to="/terms" className="terms-link">Terms of Service</Link> and{' '}
                    <Link to="/privacy" className="terms-link">Privacy Policy</Link> *
                  </label>
                  {errors.terms && <div className="invalid-feedback d-block">{errors.terms}</div>}
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 auth-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : 'Create Account'}
                </button>
                
                <div className="text-center mt-4">
                  <p className="auth-footer-text">
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">Sign in here</Link>
                  </p>
                </div>
              </form>
              
              {/* Membership Tiers */}
              <div className="membership-tiers mt-5">
                <h5 className="text-center mb-4">Unlock Membership Benefits</h5>
                <div className="row">
                  <div className="col-md-4">
                    <div className="tier-card text-center">
                      <div className="tier-icon bronze">
                        <i className="fas fa-crown"></i>
                      </div>
                      <h6>Bronze Tier</h6>
                      <p className="small">Welcome gift on first stay</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="tier-card text-center">
                      <div className="tier-icon silver">
                        <i className="fas fa-gem"></i>
                      </div>
                      <h6>Silver Tier</h6>
                      <p className="small">After 5+ nights</p>
                      <p className="small">Room upgrades & late checkout</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="tier-card text-center">
                      <div className="tier-icon gold">
                        <i className="fas fa-award"></i>
                      </div>
                      <h6>Gold Tier</h6>
                      <p className="small">After 15+ nights</p>
                      <p className="small">VIP services & dedicated concierge</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;