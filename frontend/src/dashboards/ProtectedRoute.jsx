import React from "react";
import { Navigate } from "react-router-dom";

// role = string ("admin", "manager", etc.)
// children = the dashboard component wrapped
const ProtectedRoute = ({ role, children }) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");

  if (!token) {
    // not logged in
    return <Navigate to="/login" replace />;
  }

  if (role && user.Role !== role) {
    // role mismatch
    return <Navigate to="/" replace />;
  }

  // authorized
  return children;
};

export default ProtectedRoute;
