import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import ReceptionDashboard from './pages/ReceptionDashboard';
import StaffDashboard from './pages/StaffDashboard';
import GuestDashboard from './pages/GuestDashboard';

function App() {
  // Simple route protection function
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/manager-dashboard" element={
          <ProtectedRoute>
            <ManagerDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/reception-dashboard" element={
          <ProtectedRoute>
            <ReceptionDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/staff-dashboard" element={
          <ProtectedRoute>
            <StaffDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/guest-dashboard" element={
          <ProtectedRoute>
            <GuestDashboard />
          </ProtectedRoute>
        } />
        
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;