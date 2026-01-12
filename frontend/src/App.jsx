
// src/App.jsx
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './Components/ProtectedRoute';
import Navbar from './components/Navbar';

// Lazy load components for better performance
const Login = React.lazy(() => import('./Pages/Login'));
const Register = React.lazy(() => import('./Pages/Register'));
const Home = React.lazy(() => import('./pages/Home'));
const Profile = React.lazy(() => import('./Pages/Profile'));
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const ReceptionDashboard = React.lazy(() => import('./pages/reception/Dashboard'));
const HousekeepingTasks = React.lazy(() => import('./pages/housekeeping/Tasks'));
const Rooms = React.lazy(() => import('./pages/Rooms'));
const Gallery = React.lazy(() => import('./pages/Gallery'));
const BookNow = React.lazy(() => import('./pages/MyBookings'));
const Contact = React.lazy(() => import('./pages/Contact'));
const MyBookings = React.lazy(() => import('./pages/MyBookings'));

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Protected routes - different access based on role */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                
                <Route path="/booknow" element={
                  <ProtectedRoute>
                    <BookNow />
                  </ProtectedRoute>
                } />
                
                <Route path="/my-bookings" element={
                  <ProtectedRoute requiredRoles={['guest']}>
                    <MyBookings />
                  </ProtectedRoute>
                } />
                
                {/* Admin routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute requiredRoles={['admin', 'manager']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/admin/*" element={
                  <ProtectedRoute requiredRoles={['admin', 'manager']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Reception routes */}
                <Route path="/reception/dashboard" element={
                  <ProtectedRoute requiredRoles={['receptionist', 'admin', 'manager']}>
                    <ReceptionDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Housekeeping routes */}
                <Route path="/housekeeping/tasks" element={
                  <ProtectedRoute requiredRoles={['housekeeping', 'admin', 'manager']}>
                    <HousekeepingTasks />
                  </ProtectedRoute>
                } />
                
                {/* 404 route - redirect based on authentication */}
                <Route path="*" element={
                  <ProtectedRoute>
                    <Navigate to="/" replace />
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;