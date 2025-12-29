// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Simulate login API call
    console.log('Login attempt with:', { email, password, rememberMe });
    
    // For demo purposes, simulate successful login
    alert('Login successful! Welcome back to LuxuryStay.');
    navigate('/'); // Redirect to home page
  };

  const handleSocialLogin = (provider) => {
    alert(`Logging in with ${provider}...`);
    // In a real app, this would trigger OAuth flow
  };

  return (
    <div className="auth-page login-page">
      {/* Background Image */}
      <div className="auth-background"></div>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8">
            {/* Back to Home Link */}
            <div className="back-home mb-4">
              <Link to="/" className="back-link">
                <i className="fas fa-arrow-left me-2"></i>
                Back to Home
              </Link>
            </div>
            
            {/* Login Card */}
            <div className="auth-card">
              {/* Logo */}
              <div className="text-center mb-4">
                <div className="auth-logo">
                  <div className="logo-circle">
                    <span className="logo-text">LS</span>
                  </div>
                  <h2 className="brand-name mt-3">LuxuryStay <span className="brand-subtitle">Hospitality</span></h2>
                </div>
                <h3 className="auth-title">Welcome Back</h3>
                <p className="auth-subtitle">Sign in to access your account and exclusive benefits</p>
              </div>
              
              {/* Social Login Options */}
              <div className="social-login mb-4">
                <button 
                  className="btn btn-social btn-google"
                  onClick={() => handleSocialLogin('Google')}
                >
                  <i className="fab fa-google me-2"></i>
                  Continue with Google
                </button>
                <button 
                  className="btn btn-social btn-facebook mt-3"
                  onClick={() => handleSocialLogin('Facebook')}
                >
                  <i className="fab fa-facebook-f me-2"></i>
                  Continue with Facebook
                </button>
              </div>
              
              <div className="divider">
                <span>or sign in with email</span>
              </div>
              
              {/* Login Form */}
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group mb-4">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({...errors, email: ''});
                    }}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                
                <div className="form-group mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({...errors, password: ''});
                    }}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      className="form-check-input"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="rememberMe" className="form-check-label">Remember me</label>
                  </div>
                  <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
                </div>
                
                <button type="submit" className="btn btn-primary w-100 auth-btn">
                  Sign In
                </button>
                
                <div className="text-center mt-4">
                  <p className="auth-footer-text">
                    Don't have an account?{' '}
                    <Link to="/register" className="auth-link">Create one here</Link>
                  </p>
                </div>
              </form>
              
              {/* Member Benefits */}
              <div className="member-benefits mt-5">
                <h5 className="text-center mb-3">Member Benefits</h5>
                <div className="row">
                  <div className="col-6">
                    <div className="benefit-item text-center">
                      <i className="fas fa-gift"></i>
                      <p className="small mb-0">Exclusive Offers</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="benefit-item text-center">
                      <i className="fas fa-star"></i>
                      <p className="small mb-0">Priority Booking</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="benefit-item text-center">
                      <i className="fas fa-percent"></i>
                      <p className="small mb-0">Special Discounts</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="benefit-item text-center">
                      <i className="fas fa-concierge-bell"></i>
                      <p className="small mb-0">Personalized Service</p>
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

export default Login;