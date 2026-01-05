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

import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book-now" element={<BookNow />} />

        {/* Dashboards */}
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
                <Manager />
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
