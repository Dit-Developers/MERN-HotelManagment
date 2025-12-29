// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    newsletter: true
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      console.log('Registration attempt with:', formData);
      
      // Simulate successful registration
      setTimeout(() => {
        alert('Registration successful! Welcome to LuxuryStay.');
        navigate('/login'); // Redirect to login page
      }, 1500);
      
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
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
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
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
                    required
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