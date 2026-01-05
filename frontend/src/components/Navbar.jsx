import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ scrolled }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));

    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!user) return "/";

    switch (user.Role) {
      case "admin":
        return "/admin/dashboard";
      case "manager":
        return "/manager/dashboard";
      case "receptionist":
        return "/receptionist/dashboard";
      default:
        return "/";
    }
  };

  const handleNavClick = (e, target) => {
    e.preventDefault();

    const navbarCollapse = document.getElementById("navbarNav");
    if (navbarCollapse?.classList.contains("show")) {
      navbarCollapse.classList.remove("show");
    }

    if (location.pathname === "/" && target.startsWith("#")) {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (target.startsWith("#")) {
      navigate("/", { state: { scrollTo: target } });
      return;
    }

    navigate(target);
  };

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-dark fixed-top ${
        scrolled ? "scrolled" : ""
      }`}
    >
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand" to="/" onClick={(e) => handleNavClick(e, "/")}>
          <div className="logo-container">
            <div className="logo-circle">
              <span className="logo-text">LS</span>
            </div>
            <span className="brand-name">
              LuxuryStay <span className="brand-subtitle">Hospitality</span>
            </span>
          </div>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={(e) => handleNavClick(e, "/")}>
                Home
              </Link>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/" onClick={(e) => handleNavClick(e, "#rooms")}>
                Rooms & Suites
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/" onClick={(e) => handleNavClick(e, "#amenities")}>
                Amenities
              </a>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/gallery">
                Gallery
              </Link>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/" onClick={(e) => handleNavClick(e, "#contact")}>
                Contact
              </a>
            </li>

            {/* AUTH AREA */}
            {!user ? (
              <>
                {!["/login", "/register"].includes(location.pathname) && (
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
                  </>
                )}
              </>
            ) : (
              <>
                {/* DASHBOARD BUTTON */}
                <li className="nav-item">
                  <Link
                    className="btn btn-outline-warning ms-lg-3"
                    to={getDashboardPath()}
                  >
                    Dashboard
                  </Link>
                </li>

                {/* LOGOUT */}
                <li className="nav-item ms-lg-2">
                  <button
                    className="btn btn-outline-danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

            {/* BOOK NOW */}
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
