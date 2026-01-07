// App.js - Updated version
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookNow from "./pages/BookNow";

import DashboardLayout from "./dashboards/DashboardLayout";
import ProtectedRoute from "./dashboards/ProtectedRoute";

import Admin from "./dashboards/admin/Admin";
import Manager from "./dashboards/manager/Manager";
import Receptionist from "./dashboards/receptionist/Receptionist";
import Guest from "./dashboards/guest/Guest"; // New import

import "./App.css";
import ManagerDashboard from "./dashboards/manager/Manager";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book-now" element={<BookNow />} />

        {/* Guest Dashboard */}
        <Route
          path="/guest/dashboard"
          element={
            <ProtectedRoute role="guest">
              <DashboardLayout>
                <Guest />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Staff Dashboards */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <DashboardLayout>
                <Admin />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute role="manager">
              <DashboardLayout>
                <ManagerDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/receptionist/dashboard"
          element={
            <ProtectedRoute role="receptionist">
              <DashboardLayout>
                <Receptionist />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;