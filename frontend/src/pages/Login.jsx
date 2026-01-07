// src/pages/Login.jsx - Updated Version
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaHotel, FaConciergeBell, FaKey, FaEnvelope } from "react-icons/fa";
import API from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("staff"); // "staff" or "guest"

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleStaffLogin = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/users/Login", {
        Email: email,
        Password: password,
      });

      const { token, user } = res.data;

      // store auth
      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      // role-based redirect
      if (user.Role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.Role === "manager") {
        navigate("/manager/dashboard");
      } else if (user.Role === "receptionist") {
        navigate("/receptionist/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = () => {
    // Generate unique guest ID
    const guestId = `GUEST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create guest user object
    const guestUser = {
      id: guestId,
      email: email || "guest@luxurystay.com",
      name: "Guest User",
      Role: "guest",
      membership: "Standard",
      points: 1000,
      token: `guest_token_${guestId}`,
      lastLogin: new Date().toISOString()
    };

    // Store guest data
    if (rememberMe) {
      localStorage.setItem("token", guestUser.token);
      localStorage.setItem("user", JSON.stringify(guestUser));
      localStorage.setItem("guestData", JSON.stringify(guestUser));
    } else {
      sessionStorage.setItem("token", guestUser.token);
      sessionStorage.setItem("user", JSON.stringify(guestUser));
      sessionStorage.setItem("guestData", JSON.stringify(guestUser));
    }

    // Redirect to guest dashboard
    navigate("/guest/dashboard");
  };

  const handleQuickGuestAccess = () => {
    // Quick guest access without email
    const guestId = `GUEST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const guestUser = {
      id: guestId,
      email: "quick.guest@luxurystay.com",
      name: "Guest Visitor",
      Role: "guest",
      membership: "Standard",
      points: 0,
      token: `quick_guest_token_${guestId}`,
      isQuickAccess: true,
      lastLogin: new Date().toISOString()
    };

    // Store for session only (temporary access)
    sessionStorage.setItem("token", guestUser.token);
    sessionStorage.setItem("user", JSON.stringify(guestUser));
    sessionStorage.setItem("guestData", JSON.stringify(guestUser));

    navigate("/guest/dashboard");
  };

  const handleDemoAccess = (role) => {
    // Demo accounts for testing
    const demoUsers = {
      admin: {
        email: "admin@demo.com",
        password: "demo123",
        user: {
          id: 1,
          name: "Demo Admin",
          email: "admin@demo.com",
          Role: "admin"
        },
        token: "demo_admin_token_123"
      },
      manager: {
        email: "manager@demo.com",
        password: "demo123",
        user: {
          id: 2,
          name: "Demo Manager",
          email: "manager@demo.com",
          Role: "manager"
        },
        token: "demo_manager_token_123"
      },
      receptionist: {
        email: "reception@demo.com",
        password: "demo123",
        user: {
          id: 3,
          name: "Demo Receptionist",
          email: "reception@demo.com",
          Role: "receptionist"
        },
        token: "demo_reception_token_123"
      },
      guest: {
        user: {
          id: 4,
          name: "Demo Guest",
          email: "guest@demo.com",
          Role: "guest",
          membership: "Platinum",
          points: 15000
        },
        token: "demo_guest_token_123"
      }
    };

    const demo = demoUsers[role];
    
    if (role === "guest") {
      localStorage.setItem("token", demo.token);
      localStorage.setItem("user", JSON.stringify(demo.user));
      localStorage.setItem("guestData", JSON.stringify(demo.user));
      navigate("/guest/dashboard");
    } else {
      // Fill form with demo credentials
      setEmail(demo.email);
      setPassword(demo.password);
      setActiveTab("staff");
      
      // Auto-login after a short delay
      setTimeout(() => {
        alert(`Demo ${role} account loaded. Click "Sign In" to proceed.`);
      }, 300);
    }
  };

  return (
    <div className="auth-page login-page">
      <div className="auth-background"></div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="back-home mb-4">
              <Link to="/" className="back-link">
                ← Back to Home
              </Link>
            </div>

            <div className="auth-card">
              <div className="text-center mb-4">
                <div className="auth-logo">
                  <div className="logo-circle">
                    <span className="logo-text">LS</span>
                  </div>
                  <h2 className="brand-name mt-3">
                    LuxuryStay <span className="brand-subtitle">Hospitality</span>
                  </h2>
                </div>
                <h3 className="auth-title">Welcome to LuxuryStay</h3>
                <p className="auth-subtitle">
                  Choose your access method
                </p>
              </div>

              {/* Access Type Tabs */}
              <div className="access-tabs mb-4">
                <div className="nav nav-pills justify-content-center" role="tablist">
                  <button
                    className={`nav-link ${activeTab === "staff" ? "active" : ""}`}
                    onClick={() => setActiveTab("staff")}
                    type="button"
                  >
                    <FaKey className="me-2" />
                    Staff Login
                  </button>
                  <button
                    className={`nav-link ${activeTab === "guest" ? "active" : ""}`}
                    onClick={() => setActiveTab("guest")}
                    type="button"
                  >
                    <FaUserCircle className="me-2" />
                    Guest Access
                  </button>
                </div>
              </div>

              {/* Staff Login Form */}
              {activeTab === "staff" && (
                <>
                  <div className="divider mb-4">
                    <span>Staff Portal</span>
                  </div>

                  {/* Demo Accounts Quick Access */}
                  <div className="demo-access mb-4">
                    <p className="text-center mb-3">
                      <small className="text-muted">Try demo accounts:</small>
                    </p>
                    <div className="row g-2">
                      <div className="col-md-3 col-6">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm w-100"
                          onClick={() => handleDemoAccess("admin")}
                        >
                          Admin Demo
                        </button>
                      </div>
                      <div className="col-md-3 col-6">
                        <button
                          type="button"
                          className="btn btn-outline-success btn-sm w-100"
                          onClick={() => handleDemoAccess("manager")}
                        >
                          Manager Demo
                        </button>
                      </div>
                      <div className="col-md-3 col-6">
                        <button
                          type="button"
                          className="btn btn-outline-info btn-sm w-100"
                          onClick={() => handleDemoAccess("receptionist")}
                        >
                          Reception Demo
                        </button>
                      </div>
                      <div className="col-md-3 col-6">
                        <button
                          type="button"
                          className="btn btn-outline-warning btn-sm w-100"
                          onClick={() => handleDemoAccess("guest")}
                        >
                          Guest Demo
                        </button>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleStaffLogin} className="auth-form">
                    <div className="form-group mb-4">
                      <label className="form-label">
                        <FaEnvelope className="me-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors({ ...errors, email: "" });
                        }}
                        placeholder="staff@luxurystay.com"
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>

                    <div className="form-group mb-4">
                      <label className="form-label">
                        <FaKey className="me-2" />
                        Password
                      </label>
                      <input
                        type="password"
                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password)
                            setErrors({ ...errors, password: "" });
                        }}
                        placeholder="••••••••"
                      />
                      {errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                    </div>

                    <div className="d-flex justify-content-between mb-4">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="rememberMe"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="rememberMe">
                          Remember me
                        </label>
                      </div>
                      <Link to="/forgot-password" className="forgot-link">
                        Forgot password?
                      </Link>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Signing in...
                        </>
                      ) : (
                        "Staff Sign In"
                      )}
                    </button>
                  </form>
                </>
              )}

              {/* Guest Access Section */}
              {activeTab === "guest" && (
                <>
                  <div className="divider mb-4">
                    <span>Guest Portal</span>
                  </div>

                  <div className="guest-access-options">
                    <div className="row g-4">
                      {/* Option 1: Quick Guest Access */}
                      <div className="col-md-6">
                        <div className="guest-option-card text-center h-100">
                          <div className="guest-icon mb-3">
                            <FaUserCircle size={60} className="text-primary" />
                          </div>
                          <h5>Quick Access</h5>
                          <p className="text-muted small mb-4">
                            Temporary access to view available rooms and services
                          </p>
                          <button
                            type="button"
                            className="btn btn-outline-primary w-100"
                            onClick={handleQuickGuestAccess}
                          >
                            Continue as Guest
                          </button>
                          <small className="text-muted d-block mt-2">
                            No booking history will be saved
                          </small>
                        </div>
                      </div>

                      {/* Option 2: Registered Guest Access */}
                      <div className="col-md-6">
                        <div className="guest-option-card text-center h-100">
                          <div className="guest-icon mb-3">
                            <FaConciergeBell size={60} className="text-success" />
                          </div>
                          <h5>Registered Access</h5>
                          <p className="text-muted small mb-3">
                            Access your bookings and manage your stay
                          </p>
                          
                          <div className="guest-form">
                            <div className="form-group mb-3">
                              <input
                                type="email"
                                className="form-control"
                                placeholder="Your email (optional)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                              <small className="text-muted">
                                Provide email to save your preferences
                              </small>
                            </div>

                            <div className="form-check mb-3">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="guestRemember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                              />
                              <label className="form-check-label" htmlFor="guestRemember">
                                Remember my access
                              </label>
                            </div>

                            <button
                              type="button"
                              className="btn btn-success w-100"
                              onClick={handleGuestAccess}
                            >
                              Access My Dashboard
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Guest Benefits */}
                    <div className="guest-benefits mt-5">
                      <h6 className="text-center mb-3">
                        <FaHotel className="me-2" />
                        Guest Benefits
                      </h6>
                      <div className="row g-3">
                        <div className="col-md-3 col-6">
                          <div className="benefit-item text-center">
                            <div className="benefit-icon mb-2">
                              <span className="text-primary">📅</span>
                            </div>
                            <small>Manage Bookings</small>
                          </div>
                        </div>
                        <div className="col-md-3 col-6">
                          <div className="benefit-item text-center">
                            <div className="benefit-icon mb-2">
                              <span className="text-success">🔑</span>
                            </div>
                            <small>Digital Key</small>
                          </div>
                        </div>
                        <div className="col-md-3 col-6">
                          <div className="benefit-item text-center">
                            <div className="benefit-icon mb-2">
                              <span className="text-warning">🏨</span>
                            </div>
                            <small>Service Requests</small>
                          </div>
                        </div>
                        <div className="col-md-3 col-6">
                          <div className="benefit-item text-center">
                            <div className="benefit-icon mb-2">
                              <span className="text-info">💳</span>
                            </div>
                            <small>View Invoices</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-4">
                      <p className="mb-0">
                        Need to make a booking?{" "}
                        <Link to="/book-now" className="text-decoration-none fw-bold">
                          Book a Room
                        </Link>
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Switch Between Tabs */}
              <div className="text-center mt-4 pt-3 border-top">
                <p className="mb-0">
                  {activeTab === "staff" ? (
                    <>
                      Are you a guest?{" "}
                      <button
                        type="button"
                        className="btn-link text-decoration-none"
                        onClick={() => setActiveTab("guest")}
                      >
                        Access Guest Portal
                      </button>
                    </>
                  ) : (
                    <>
                      Are you a staff member?{" "}
                      <button
                        type="button"
                        className="btn-link text-decoration-none"
                        onClick={() => setActiveTab("staff")}
                      >
                        Access Staff Portal
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;