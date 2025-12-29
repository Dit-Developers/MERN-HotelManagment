// src/components/Navigation.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


const Navbar = ({ scrolled }) => {
  const navigate = useNavigate();

  const handleNavClick = (e) => {
    // Only handle smooth scroll for hash links on the same page
    if (e.target.hash && window.location.pathname === '/') {
      e.preventDefault();
      const element = document.querySelector(e.target.hash);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Close mobile menu if open
        const navbarCollapse = document.getElementById('navbarNav');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          navbarCollapse.classList.remove('show');
        }
      }
    }
  };

  const handleBookNow = () => {
    if (window.location.pathname === '/') {
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // If not on home page, navigate to home page with booking section
      navigate('/#booking');
    }
    
    // Close mobile menu if open
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    }
  };

  const isHomePage = window.location.pathname === '/';

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark fixed-top ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <div className="logo-container">
            <div className="logo-circle">
              <span className="logo-text">LS</span>
            </div>
            <span className="brand-name">LuxuryStay <span className="brand-subtitle">Hospitality</span></span>
          </div>
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link 
                className="nav-link" 
                to="/"
                onClick={isHomePage ? handleNavClick : undefined}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link" 
                href={isHomePage ? "#rooms" : "/#rooms"}
                onClick={handleNavClick}
              >
                Rooms & Suites
              </a>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link" 
                href={isHomePage ? "#amenities" : "/#amenities"}
                onClick={handleNavClick}
              >
                Amenities
              </a>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link" 
                href={isHomePage ? "#gallery" : "/#gallery"}
                onClick={handleNavClick}
              >
                Gallery
              </a>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link" 
                href={isHomePage ? "#contact" : "/#contact"}
                onClick={handleNavClick}
              >
                Contact
              </a>
            </li>
            
            {/* Auth Links */}
            <li className="nav-item dropdown d-lg-none">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                id="authDropdown" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                Account
              </a>
              <ul className="dropdown-menu" aria-labelledby="authDropdown">
                <li>
                  <Link className="dropdown-item" to="/login">
                    <i className="fas fa-sign-in-alt me-2"></i> Login
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/register">
                    <i className="fas fa-user-plus me-2"></i> Register
                  </Link>
                </li>
              </ul>
            </li>
            
            {/* Desktop Auth Links */}
            <li className="nav-item d-none d-lg-block">
              <Link className="nav-link" to="/login">
                <i className="fas fa-sign-in-alt me-1"></i> Login
              </Link>
            </li>
            <li className="nav-item d-none d-lg-block">
              <Link 
                className="btn btn-outline-light booking-btn ms-2" 
                to="/register"
              >
                <i className="fas fa-user-plus me-1"></i> Register
              </Link>
            </li>
            
            {/* Book Now Button */}
            <li className="nav-item">
              <button 
                className="btn btn-primary ms-2 booking-btn-main" 
                onClick={handleBookNow}
              >
                <i className="fas fa-calendar-check me-1"></i> Book Now
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;