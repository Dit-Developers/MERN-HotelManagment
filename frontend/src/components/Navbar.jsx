import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, ROLES } from '../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Public navigation items (always visible)
  const publicNavItems = [
    { name: 'Home', path: '/' },
    { name: 'Rooms & Suites', path: '/rooms' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Book Now', path: '/booknow', requiresAuth: true },
    { name: 'Contact', path: '/contact' },
  ];

  // Staff/Admin navigation items (only for logged-in staff)
  const staffNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', roles: [ROLES.ADMIN, ROLES.MANAGER], requiresAuth: true },
    { name: 'Bookings', path: '/admin/bookings', roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTIONIST], requiresAuth: true },
    { name: 'Rooms', path: '/admin/rooms', roles: [ROLES.ADMIN, ROLES.MANAGER], requiresAuth: true },
    { name: 'Tasks', path: '/housekeeping/tasks', roles: [ROLES.HOUSEKEEPING], requiresAuth: true },
    { name: 'Reports', path: '/admin/reports', roles: [ROLES.ADMIN, ROLES.MANAGER], requiresAuth: true },
  ];

  // Guest-specific items (only for logged-in guests)
  const guestNavItems = [
    { name: 'My Bookings', path: '/my-bookings', requiresAuth: true },
    { name: 'My Profile', path: '/profile', requiresAuth: true },
  ];

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('button[aria-label="Toggle menu"]')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle navigation to auth-required pages
  const handleNavigation = (item) => {
    if (item.requiresAuth && !isAuthenticated) {
      // Redirect to login with return URL
      navigate('/login', { 
        state: { 
          from: item.path,
          message: `Please login to access ${item.name}` 
        } 
      });
      return false;
    }
    return true;
  };

  // Check if user has access to navigation item
  const hasAccess = (item) => {
    // Public items are always accessible
    if (!item.requiresAuth) return true;
    
    // Auth-required items need user to be logged in
    if (!isAuthenticated || !user) return false;
    
    // If item has role restrictions, check them
    if (item.roles) {
      return item.roles.includes(user.role);
    }
    
    return true;
  };

  // Determine which nav items to show based on user role
  const getNavItems = () => {
    const items = [...publicNavItems];
    
    if (isAuthenticated && user) {
      if (user.role === ROLES.GUEST) {
        // Add guest-specific items
        items.push(...guestNavItems.filter(hasAccess));
      } else {
        // Add staff/admin items based on role
        items.push(...staffNavItems.filter(hasAccess));
      }
    }
    
    return items;
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  const BuildingIcon = () => (
    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );

  const UserIcon = () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const MenuIcon = () => (
    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  const CloseIcon = () => (
    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  // Get user's display name safely
  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.fullName || user.name || user.email || 'User';
  };

  // Get user's email safely
  const getUserEmail = () => {
    if (!user) return '';
    return user.email || '';
  };

  // Get user's role safely
  const getUserRole = () => {
    if (!user) return 'guest';
    return user.role || 'guest';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#215E61' }}>
                <BuildingIcon className="text-white" />
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold tracking-tight" style={{ color: '#215E61' }}>
                  LuxuryStay
                </span>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 font-medium">HOSPITALITY</span>
                  {user && getUserRole() !== ROLES.GUEST && (
                    <span className="ml-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      {getUserRole().toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  item.requiresAuth && !isAuthenticated 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={(e) => {
                  if (item.requiresAuth && !isAuthenticated) {
                    e.preventDefault();
                    handleNavigation(item);
                  } else {
                    setIsMenuOpen(false);
                  }
                }}
                title={item.requiresAuth && !isAuthenticated ? "Login required" : ""}
              >
                {item.name}
                {item.requiresAuth && !isAuthenticated && (
                  <span className="ml-1 text-xs">🔒</span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  {/* User Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                      aria-label="User menu"
                      aria-expanded={isUserMenuOpen}
                    >
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserIcon className="text-gray-600" />
                      </div>
                      <span>{getUserDisplayName()}</span>
                    </button>
                    
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                        <div className="px-4 py-2 border-b">
                          <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                          <p className="text-xs text-gray-500">{getUserEmail()}</p>
                          <p className="text-xs text-gray-500 mt-1">Role: {getUserRole()}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Profile
                        </Link>
                        {getUserRole() === ROLES.GUEST && (
                          <Link
                            to="/my-bookings"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            My Bookings
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register"
                    className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200 hover:opacity-90"
                    style={{ backgroundColor: '#215E61' }}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div ref={mobileMenuRef} className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 pt-2 pb-3 space-y-1 sm:px-6 bg-white border-t">
          {/* Navigation Items */}
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`block px-3 py-2 text-base font-medium rounded-md ${
                item.requiresAuth && !isAuthenticated 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={(e) => {
                if (item.requiresAuth && !isAuthenticated) {
                  e.preventDefault();
                  handleNavigation(item);
                  setIsMenuOpen(false);
                } else {
                  setIsMenuOpen(false);
                }
              }}
              title={item.requiresAuth && !isAuthenticated ? "Login required" : ""}
            >
              <div className="flex items-center">
                {item.name}
                {item.requiresAuth && !isAuthenticated && (
                  <span className="ml-2 text-xs">🔒</span>
                )}
              </div>
            </Link>
          ))}
          
          {/* Mobile Authentication */}
          {!isAuthenticated ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="space-y-2 px-3">
                <div className="text-sm text-gray-500 mb-2">
                  Login to access booking and other features
                </div>
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md border border-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center px-4 py-2 text-base font-medium text-white rounded-md hover:opacity-90"
                  style={{ backgroundColor: '#215E61' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="px-4 py-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserIcon className="text-gray-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-800">{getUserDisplayName()}</p>
                    <p className="text-sm text-gray-500">{getUserEmail()}</p>
                    <p className="text-xs text-gray-500">Role: {getUserRole()}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  {getUserRole() === ROLES.GUEST && (
                    <Link
                      to="/my-bookings"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md focus:outline-none"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
