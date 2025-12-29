// src/components/Navigation.jsx (OR Navbar.jsx depending on your naming)
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ scrolled }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  const handleNavClick = (e, target) => {
    e.preventDefault();
    
    if (isHomePage && target.startsWith('#')) {
      // Scroll to section on home page
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else if (!isHomePage && target.startsWith('#')) {
      // Navigate to home page with hash
      navigate(`/${target}`);
    } else if (target === '/book-now') {
      // Navigate to book now page
      navigate('/book-now');
    }
    
    // Close mobile menu if open
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    }
  };

  const handleBookNow = (e) => {
    e.preventDefault();
    navigate('/book-now');
    
    // Close mobile menu if open
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark fixed-top ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={(e) => handleNavClick(e, '/')}>
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
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                to="/"
                onClick={(e) => handleNavClick(e, '/')}
              >
                Home
              </Link>
            </li>
            
            <li className="nav-item">
              <a 
                className="nav-link" 
                href="#rooms"
                onClick={(e) => handleNavClick(e, '#rooms')}
              >
                Rooms & Suites
              </a>
            </li>
            
            <li className="nav-item">
              <a 
                className="nav-link" 
                href="#amenities"
                onClick={(e) => handleNavClick(e, '#amenities')}
              >
                Amenities
              </a>
            </li>
            
            <li className="nav-item">
              <Link 
                className="nav-link" 
                to="/gallery"
                onClick={(e) => handleNavClick(e, '/gallery')}
              >
                Gallery
              </Link>
            </li>
            
            <li className="nav-item">
              <a 
                className="nav-link" 
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
              >
                Contact
              </a>
            </li>
            
            {/* Auth Links - Show only if not on auth pages */}
            {!['/login', '/register'].includes(location.pathname) && (
              <>
                <li className="nav-item d-none d-lg-block">
                  <Link className="nav-link" to="/login">
                    <i className="fas fa-sign-in-alt me-1"></i> Login
                  </Link>
                </li>
                
                <li className="nav-item d-none d-lg-block">
                  <Link 
                    className="btn btn-outline-light ms-2" 
                    to="/register"
                  >
                    <i className="fas fa-user-plus me-1"></i> Register
                  </Link>
                </li>
              </>
            )}
            
            {/* Book Now Button */}
            <li className="nav-item">
              <Link 
                className="btn btn-primary ms-2 booking-btn-main" 
                to="/book-now"
                
              >
                <i className="fas fa-calendar-check me-1"></i> Book Now
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;