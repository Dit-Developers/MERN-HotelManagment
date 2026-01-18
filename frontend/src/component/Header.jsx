import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaHome, FaInfoCircle, FaBed, FaImages, FaEnvelope } from 'react-icons/fa';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleDashboardClick = () => {
    if (user) {
      navigate(`/${user.role}-dashboard`);
    } else {
      navigate('/login');
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsMenuOpen(false);
    navigate('/login');
  };

  // Custom color styles
  const customStyles = {
    navy: {
      50: '#f0f4f8',
      100: '#d9e2ec',
      200: '#bcccdc',
      300: '#9fb3c8',
      400: '#829ab1',
      500: '#627d98',
      600: '#486581',
      700: '#334e68',
      800: '#243b53',
      900: '#102a43',
    },
    gold: {
      50: '#fff9e6',
      100: '#ffefbf',
      200: '#ffe599',
      300: '#ffdb73',
      400: '#ffd14d',
      500: '#c7a53f',
      600: '#b89434',
      700: '#9e7b2e',
      800: '#856328',
      900: '#6c4c22',
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header 
      className="sticky top-0 z-50 shadow-lg transition-all duration-300"
      style={{ 
        backgroundColor: customStyles.navy[900],
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${customStyles.navy[800]}`
      }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo - Responsive sizing */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="font-serif text-xl sm:text-2xl font-light tracking-wider text-white hover:opacity-90 transition-opacity duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <span style={{ color: customStyles.gold[500] }} className="font-normal">LUXURY</span> HOTEL
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center">
            <ul className="flex items-center space-x-0 xl:space-x-1">
              <li>
                <Link 
                  to="/" 
                  className="flex items-center px-3 xl:px-4 py-2 text-xs xl:text-sm font-light tracking-wider uppercase transition-colors duration-300 rounded-sm border-b-2"
                  style={{ 
                    color: isActive('/') ? customStyles.gold[500] : '#d1d5db',
                    borderColor: isActive('/') ? customStyles.gold[500] : 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = customStyles.gold[500]}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
                >
                  <FaHome className="mr-1 xl:mr-2" />
                  <span className="hidden xl:inline">Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="flex items-center px-3 xl:px-4 py-2 text-xs xl:text-sm font-light tracking-wider uppercase transition-colors duration-300 rounded-sm border-b-2"
                  style={{ 
                    color: isActive('/about') ? customStyles.gold[500] : '#d1d5db',
                    borderColor: isActive('/about') ? customStyles.gold[500] : 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = customStyles.gold[500]}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
                >
                  <FaInfoCircle className="mr-1 xl:mr-2" />
                  <span className="hidden xl:inline">About</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/rooms" 
                  className="flex items-center px-3 xl:px-4 py-2 text-xs xl:text-sm font-light tracking-wider uppercase transition-colors duration-300 rounded-sm border-b-2"
                  style={{ 
                    color: isActive('/rooms') ? customStyles.gold[500] : '#d1d5db',
                    borderColor: isActive('/rooms') ? customStyles.gold[500] : 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = customStyles.gold[500]}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
                >
                  <FaBed className="mr-1 xl:mr-2" />
                  <span className="hidden xl:inline">Rooms</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/gallery" 
                  className="flex items-center px-3 xl:px-4 py-2 text-xs xl:text-sm font-light tracking-wider uppercase transition-colors duration-300 rounded-sm border-b-2"
                  style={{ 
                    color: isActive('/gallery') ? customStyles.gold[500] : '#d1d5db',
                    borderColor: isActive('/gallery') ? customStyles.gold[500] : 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = customStyles.gold[500]}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
                >
                  <FaImages className="mr-1 xl:mr-2" />
                  <span className="hidden xl:inline">Gallery</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="flex items-center px-3 xl:px-4 py-2 text-xs xl:text-sm font-light tracking-wider uppercase transition-colors duration-300 rounded-sm border-b-2"
                  style={{ 
                    color: isActive('/contact') ? customStyles.gold[500] : '#d1d5db',
                    borderColor: isActive('/contact') ? customStyles.gold[500] : 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = customStyles.gold[500]}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
                >
                  <FaEnvelope className="mr-1 xl:mr-2" />
                  <span className="hidden xl:inline">Contact</span>
                </Link>
              </li>
              
              {/* Auth Links - Responsive layout */}
              <li className="ml-2 xl:ml-4">
                {user ? (
                  <div className="flex items-center space-x-2 xl:space-x-4">
                    {/* User Info - Hidden on smaller screens */}
                    <div className="hidden xl:flex flex-col items-end">
                      <span className="text-xs xl:text-sm font-light text-gray-300">
                        Welcome,
                      </span>
                      <span 
                        className="text-xs xl:text-sm font-medium truncate max-w-[120px]"
                        style={{ color: customStyles.gold[400] }}
                      >
                        {user.fullName}
                      </span>
                    </div>
                    
                    {/* Role Badge - Smaller on mobile */}
                    <div 
                      className="px-2 xl:px-3 py-1 text-xs font-medium tracking-wider uppercase rounded-sm"
                      style={{ 
                        backgroundColor: customStyles.gold[900],
                        color: customStyles.gold[300]
                      }}
                    >
                      {user.role.charAt(0).toUpperCase()}
                      <span className="hidden xl:inline">{user.role.slice(1)}</span>
                    </div>
                    
                    {/* Dashboard Button - Responsive sizing */}
                    <button 
                      onClick={handleDashboardClick}
                      className="px-3 xl:px-4 py-2 text-xs xl:text-sm font-medium tracking-wider uppercase rounded-sm transition-all duration-300 hover:shadow-lg"
                      style={{ 
                        backgroundColor: customStyles.gold[600],
                        color: 'white'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                    >
                      <FaUser className="inline mr-1 xl:mr-2" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </button>
                    
                    {/* Logout Button - Responsive sizing */}
                    <button 
                      onClick={handleLogout}
                      className="px-3 xl:px-4 py-2 text-xs xl:text-sm font-medium tracking-wider uppercase rounded-sm transition-all duration-300 hover:shadow-lg border"
                      style={{ 
                        borderColor: customStyles.gold[600],
                        color: customStyles.gold[400],
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = customStyles.gold[900];
                        e.currentTarget.style.color = customStyles.gold[300];
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = customStyles.gold[400];
                      }}
                    >
                      <FaSignOutAlt className="inline mr-1 xl:mr-2" />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 xl:space-x-4">
                    {/* Login Button - Responsive sizing */}
                    <Link 
                      to="/login"
                      className="px-3 xl:px-6 py-2 text-xs xl:text-sm font-medium tracking-wider uppercase rounded-sm transition-all duration-300 border"
                      style={{ 
                        borderColor: customStyles.gold[600],
                        color: customStyles.gold[400],
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = customStyles.gold[900];
                        e.currentTarget.style.color = customStyles.gold[300];
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = customStyles.gold[400];
                      }}
                    >
                      <FaUser className="inline mr-1 xl:mr-2" />
                      <span className="hidden sm:inline">Login</span>
                    </Link>
                    
                    {/* Register Button - Responsive sizing */}
                    <Link 
                      to="/register"
                      className="px-3 xl:px-6 py-2 text-xs xl:text-sm font-medium tracking-wider uppercase rounded-sm transition-all duration-300 hover:shadow-lg"
                      style={{ 
                        backgroundColor: customStyles.gold[600],
                        color: 'white'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                    >
                      <span className="hidden sm:inline">Register</span>
                    </Link>
                  </div>
                )}
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Toggle - Visible on mobile/tablet */}
          <button 
            className="lg:hidden text-white focus:outline-none transition-transform duration-300 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ color: customStyles.gold[400] }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FaTimes className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <FaBars className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Enhanced responsive behavior */}
      <div 
        className={`lg:hidden fixed inset-x-0 top-16 sm:top-20 z-40 transition-all duration-300 ease-in-out overflow-y-auto max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-5rem)] ${
          isMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
        }`}
        style={{ 
          backgroundColor: customStyles.navy[900],
          borderTop: `1px solid ${customStyles.navy[800]}`,
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
          {/* Navigation Links */}
          <div className="space-y-1 sm:space-y-2">
            <Link 
              to="/" 
              className="flex items-center px-4 py-3 text-sm font-light tracking-wider uppercase rounded-sm w-full transition-all duration-300"
              style={{ 
                color: isActive('/') ? customStyles.gold[500] : customStyles.gold[100],
                backgroundColor: isActive('/') ? customStyles.navy[800] : 'transparent'
              }}
              onClick={() => setIsMenuOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = customStyles.navy[800];
                e.currentTarget.style.color = customStyles.gold[500];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isActive('/') ? customStyles.navy[800] : 'transparent';
                e.currentTarget.style.color = isActive('/') ? customStyles.gold[500] : customStyles.gold[100];
              }}
            >
              <FaHome className="mr-3" />
              Home
            </Link>
            <Link 
              to="/about" 
              className="flex items-center px-4 py-3 text-sm font-light tracking-wider uppercase rounded-sm w-full transition-all duration-300"
              style={{ 
                color: isActive('/about') ? customStyles.gold[500] : '#d1d5db',
                backgroundColor: isActive('/about') ? customStyles.navy[800] : 'transparent'
              }}
              onClick={() => setIsMenuOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = customStyles.navy[800];
                e.currentTarget.style.color = customStyles.gold[500];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isActive('/about') ? customStyles.navy[800] : 'transparent';
                e.currentTarget.style.color = isActive('/about') ? customStyles.gold[500] : '#d1d5db';
              }}
            >
              <FaInfoCircle className="mr-3" />
              About
            </Link>
            <Link 
              to="/rooms" 
              className="flex items-center px-4 py-3 text-sm font-light tracking-wider uppercase rounded-sm w-full transition-all duration-300"
              style={{ 
                color: isActive('/rooms') ? customStyles.gold[500] : '#d1d5db',
                backgroundColor: isActive('/rooms') ? customStyles.navy[800] : 'transparent'
              }}
              onClick={() => setIsMenuOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = customStyles.navy[800];
                e.currentTarget.style.color = customStyles.gold[500];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isActive('/rooms') ? customStyles.navy[800] : 'transparent';
                e.currentTarget.style.color = isActive('/rooms') ? customStyles.gold[500] : '#d1d5db';
              }}
            >
              <FaBed className="mr-3" />
              Rooms
            </Link>
            <Link 
              to="/gallery" 
              className="flex items-center px-4 py-3 text-sm font-light tracking-wider uppercase rounded-sm w-full transition-all duration-300"
              style={{ 
                color: isActive('/gallery') ? customStyles.gold[500] : '#d1d5db',
                backgroundColor: isActive('/gallery') ? customStyles.navy[800] : 'transparent'
              }}
              onClick={() => setIsMenuOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = customStyles.navy[800];
                e.currentTarget.style.color = customStyles.gold[500];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isActive('/gallery') ? customStyles.navy[800] : 'transparent';
                e.currentTarget.style.color = isActive('/gallery') ? customStyles.gold[500] : '#d1d5db';
              }}
            >
              <FaImages className="mr-3" />
              Gallery
            </Link>
            <Link 
              to="/contact" 
              className="flex items-center px-4 py-3 text-sm font-light tracking-wider uppercase rounded-sm w-full transition-all duration-300"
              style={{ 
                color: isActive('/contact') ? customStyles.gold[500] : '#d1d5db',
                backgroundColor: isActive('/contact') ? customStyles.navy[800] : 'transparent'
              }}
              onClick={() => setIsMenuOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = customStyles.navy[800];
                e.currentTarget.style.color = customStyles.gold[500];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isActive('/contact') ? customStyles.navy[800] : 'transparent';
                e.currentTarget.style.color = isActive('/contact') ? customStyles.gold[500] : '#d1d5db';
              }}
            >
              <FaEnvelope className="mr-3" />
              Contact
            </Link>
          </div>

          {/* User Info & Auth Links */}
          <div className="pt-3 sm:pt-4 border-t" style={{ borderColor: customStyles.navy[800] }}>
            {user ? (
              <div className="space-y-3 sm:space-y-4">
                {/* User Info */}
                <div className="px-4 py-2">
                  <div className="text-sm font-light text-gray-400">Welcome back,</div>
                  <div 
                    className="text-base sm:text-lg font-medium truncate"
                    style={{ color: customStyles.gold[400] }}
                  >
                    {user.fullName}
                  </div>
                  <div 
                    className="inline-block mt-1 px-3 py-1 text-xs font-medium tracking-wider uppercase rounded-sm"
                    style={{ 
                      backgroundColor: customStyles.gold[900],
                      color: customStyles.gold[300]
                    }}
                  >
                    {user.role}
                  </div>
                </div>
                
                {/* Dashboard Button */}
                <button 
                  onClick={handleDashboardClick}
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium tracking-wider uppercase rounded-sm transition-all duration-300"
                  style={{ 
                    backgroundColor: customStyles.gold[600],
                    color: 'white'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                >
                  <FaUser className="mr-3" />
                  Dashboard
                </button>
                
                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium tracking-wider uppercase rounded-sm transition-all duration-300 border"
                  style={{ 
                    borderColor: customStyles.gold[600],
                    color: customStyles.gold[400],
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = customStyles.gold[900];
                    e.currentTarget.style.color = customStyles.gold[300];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = customStyles.gold[400];
                  }}
                >
                  <FaSignOutAlt className="mr-3" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {/* Login Button */}
                <Link 
                  to="/login"
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium tracking-wider uppercase rounded-sm transition-all duration-300 border"
                  style={{ 
                    borderColor: customStyles.gold[600],
                    color: customStyles.gold[400],
                    backgroundColor: 'transparent'
                  }}
                  onClick={() => setIsMenuOpen(false)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = customStyles.gold[900];
                    e.currentTarget.style.color = customStyles.gold[300];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = customStyles.gold[400];
                  }}
                >
                  <FaUser className="mr-3" />
                  Login
                </Link>
                
                {/* Register Button */}
                <Link 
                  to="/register"
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium tracking-wider uppercase rounded-sm transition-all duration-300"
                  style={{ 
                    backgroundColor: customStyles.gold[600],
                    color: 'white'
                  }}
                  onClick={() => setIsMenuOpen(false)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
