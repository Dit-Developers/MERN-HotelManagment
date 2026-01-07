
// Simplified version - Always show auth buttons when not logged in
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaConciergeBell, FaHotel } from "react-icons/fa";

const Navbar = ({ scrolled }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for user in storage
    const checkUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("user")) || 
                        JSON.parse(sessionStorage.getItem("user")) ||
                        JSON.parse(localStorage.getItem("guestData"));
      setUser(storedUser);
    };
    
    checkUser();
    
    // Listen for storage changes
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    navigate("/");
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark fixed-top ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <div className="logo-container">
            <div className="logo-circle">
              <span className="logo-text">LS</span>
            </div>
            <span className="brand-name">
              LuxuryStay <span className="brand-subtitle">Hospitality</span>
            </span>
          </div>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {/* Navigation Links */}
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><a className="nav-link" href="/#rooms">Rooms</a></li>
            <li className="nav-item"><a className="nav-link" href="/#amenities">Amenities</a></li>
            <li className="nav-item"><Link className="nav-link" to="/gallery">Gallery</Link></li>
            <li className="nav-item"><a className="nav-link" href="/#contact">Contact</a></li>

            {/* AUTH SECTION */}
            {user ? (
              // USER IS LOGGED IN
              <>
                {/* Dashboard Button for Staff */}
                {user.Role && user.Role !== "guest" && (
                  <li className="nav-item">
                    <Link 
                      className="btn btn-outline-warning ms-lg-2" 
                      to={
                        user.Role === "admin" ? "/admin/dashboard" :
                        user.Role === "manager" ? "/manager/dashboard" :
                        user.Role === "receptionist" ? "/receptionist/dashboard" : "/"
                      }
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
                
                {/* Profile for Guest */}
                {user.Role === "guest" && (
                  <li className="nav-item">
                    <Link 
                      className="btn btn-outline-light ms-lg-2 d-flex align-items-center" 
                      to="/guest/dashboard"
                    >
                      <FaUserCircle className="me-2" />
                      Guest
                    </Link>
                  </li>
                )}
                
                {/* Logout Button */}
                <li className="nav-item ms-lg-2">
                  <button className="btn btn-outline-danger" onClick={handleLogout}>
                    <FaSignOutAlt className="me-1" />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              // USER IS NOT LOGGED IN - ALWAYS SHOW THESE
              <>
                <li className="nav-item d-none d-lg-block">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>

                <li className="nav-item d-none d-lg-block">
                  <Link className="btn btn-outline-light ms-2" to="/register">
                    Register
                  </Link>
                </li>
                
                {/* Mobile Auth Links */}
                <li className="nav-item d-lg-none">
                  <Link className="dropdown-item" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item d-lg-none">
                  <Link className="dropdown-item" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}

            {/* BOOK NOW - Always visible */}
            <li className="nav-item ms-lg-3">
              <Link className="btn btn-primary booking-btn-main" to="/book-now">
                Book Now
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;