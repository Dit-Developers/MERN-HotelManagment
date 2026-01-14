import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Layout Components
import Header from './component/Header';
import Footer from './component/Footer';

// Import Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Import Dashboard Pages
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import ReceptionDashboard from './pages/ReceptionDashboard';
import StaffDashboard from './pages/StaffDashboard';
import GuestDashboard from './pages/GuestDashboard';

// Import Website Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import RoomsPage from './pages/RoomsPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';

function App() {
  // Route protection function with role check
  const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token) {
      return <Navigate to="/login" />;
    }
    
    // Check if user role is allowed
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
      return <Navigate to={`/${user?.role}-dashboard`} />;
    }
    
    return children;
  };

  // Layout wrapper for public pages
  const PublicLayout = ({ children }) => (
    <div style={styles.app}>
      <Header />
      <main style={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );

  // Dashboard layout (no header/footer)
  const DashboardLayout = ({ children }) => (
    <div style={styles.dashboardApp}>
      {children}
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Public Pages with Header & Footer */}
        <Route path="/" element={
          <PublicLayout>
            <HomePage />
          </PublicLayout>
        } />
        
        <Route path="/about" element={
          <PublicLayout>
            <AboutPage />
          </PublicLayout>
        } />
        
        <Route path="/rooms" element={
          <PublicLayout>
            <RoomsPage />
          </PublicLayout>
        } />
        
        <Route path="/contact" element={
          <PublicLayout>
            <ContactPage />
          </PublicLayout>
        } />
        
        <Route path="/gallery" element={
          <PublicLayout>
            <GalleryPage />
          </PublicLayout>
        } />
        
        {/* Auth Pages (No Header/Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Dashboard Routes (Dashboard Layout) */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/manager-dashboard" element={
          <ProtectedRoute allowedRoles={['manager']}>
            <DashboardLayout>
              <ManagerDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/reception-dashboard" element={
          <ProtectedRoute allowedRoles={['receptionist']}>
            <DashboardLayout>
              <ReceptionDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/staff-dashboard" element={
          <ProtectedRoute allowedRoles={['staff']}>
            <DashboardLayout>
              <StaffDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/guest-dashboard" element={
          <ProtectedRoute allowedRoles={['guest']}>
            <DashboardLayout>
              <GuestDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        {/* Dynamic dashboard route - redirects to role-specific dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            {() => {
              const user = JSON.parse(localStorage.getItem('user'));
              return <Navigate to={`/${user?.role}-dashboard`} />;
            }}
          </ProtectedRoute>
        } />
        
        {/* 404 Page */}
        <Route path="*" element={
          <PublicLayout>
            <div style={styles.notFound}>
              <h1>404 - Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
              <a href="/" style={styles.homeLink}>Go to Homepage</a>
            </div>
          </PublicLayout>
        } />
      </Routes>
    </Router>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  dashboardApp: {
    minHeight: '100vh'
  },
  main: {
    flex: 1
  },
  notFound: {
    padding: '100px 20px',
    textAlign: 'center',
    color: '#2c3e50'
  },
  homeLink: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '10px 30px',
    backgroundColor: '#2c3e50',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px'
  }
};

export default App;