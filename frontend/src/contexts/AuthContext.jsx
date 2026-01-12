import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// API Base URL - TEMPORARY FIX: Hardcode it
const API_URL = 'http://localhost:3900';

// Configure axios
axios.defaults.baseURL = API_URL;
// Comment this out if you have CORS issues
// axios.defaults.withCredentials = true;

// Define user roles with permissions
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  RECEPTIONIST: 'receptionist',
  HOUSEKEEPING: 'housekeeping',
  GUEST: 'guest'
};

// Define role permissions
export const PERMISSIONS = {
  VIEW_DASHBOARD: [ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTIONIST],
  MANAGE_USERS: [ROLES.ADMIN],
  MANAGE_ROOMS: [ROLES.ADMIN, ROLES.MANAGER],
  MANAGE_BOOKINGS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTIONIST],
  VIEW_REPORTS: [ROLES.ADMIN, ROLES.MANAGER],
  MANAGE_HOUSEKEEPING: [ROLES.ADMIN, ROLES.MANAGER, ROLES.HOUSEKEEPING],
  MAKE_BOOKINGS: [ROLES.GUEST, ROLES.RECEPTIONIST]
};

// Auth context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Token refresh interval (10 minutes)
const TOKEN_REFRESH_INTERVAL = 10 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenExpiry, setTokenExpiry] = useState(null);
  const navigate = useNavigate();

  // Set auth token in axios headers
  const setAuthToken = useCallback((token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      // Calculate token expiry (assuming 1 hour expiry)
      const expiryTime = Date.now() + 60 * 60 * 1000;
      localStorage.setItem('tokenExpiry', expiryTime.toString());
      setTokenExpiry(expiryTime);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
      setTokenExpiry(null);
    }
  }, []);

  // Check if token is expired
  const isTokenExpired = useCallback(() => {
    if (!tokenExpiry) return true;
    return Date.now() > tokenExpiry;
  }, [tokenExpiry]);

  // Auto-refresh token by verifying with server
  useEffect(() => {
    let refreshInterval;
    
    const verifyToken = async () => {
      if (!user || isTokenExpired()) return;
      
      try {
        await axios.post('/users/verify-token');
        // If verification succeeds, token is still valid
        // Update token expiry
        const newExpiry = Date.now() + 60 * 60 * 1000;
        localStorage.setItem('tokenExpiry', newExpiry.toString());
        setTokenExpiry(newExpiry);
      } catch (error) {
        console.error('Token verification failed:', error);
        logout();
      }
    };

    if (user && !isTokenExpired()) {
      refreshInterval = setInterval(verifyToken, TOKEN_REFRESH_INTERVAL);
      // Initial verification check
      verifyToken();
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [user, tokenExpiry, isTokenExpired]);

  // Check if user is logged in on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      const savedExpiry = localStorage.getItem('tokenExpiry');
      
      if (token && savedUser && savedExpiry) {
        const expiryTime = parseInt(savedExpiry);
        
        if (Date.now() > expiryTime) {
          // Token expired, clear everything
          logout();
        } else {
          setAuthToken(token);
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setTokenExpiry(expiryTime);
          setIsAuthenticated(true);
          
          // Verify token with server
          try {
            await axios.post('/users/verify-token');
          } catch (error) {
            console.error('Token verification failed:', error);
            logout();
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [setAuthToken]);

  // Interceptor for handling auth errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Unauthorized - token expired or invalid
          logout();
          navigate('/login', {
            state: { 
              message: 'Your session has expired. Please login again.',
              from: window.location.pathname 
            }
          });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  // Login function
  const login = async (email, password, rememberMe = false) => {
    setError('');
    setLoading(true);
    
    try {
      const response = await axios.post('/users/login', {
        Email: email,
        Password: password
      });
      
      const { token, user: userData } = response.data;
      
      // Ensure userData has userId
      const enhancedUserData = {
        ...userData,
        userId: userData.userId || userData._id
      };
      
      // Set auth token
      setAuthToken(token);
      
      // Save user data
      setUser(enhancedUserData);
      setIsAuthenticated(true);
      
      if (rememberMe) {
        localStorage.setItem('rememberEmail', email);
      } else {
        localStorage.removeItem('rememberEmail');
      }
      
      localStorage.setItem('user', JSON.stringify(enhancedUserData));
      
      return enhancedUserData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setError('');
    setLoading(true);
    
    try {
      const response = await axios.post('/users/register', {
        Name: `${userData.firstName} ${userData.lastName}`,
        Email: userData.email,
        Password: userData.password,
        Phone: userData.phone,
        Address: userData.address || '',
        Role: userData.role || ROLES.GUEST
      });
      
      const { token, user: userDataRes } = response.data;
      
      // Ensure userDataRes has userId
      const enhancedUserData = {
        ...userDataRes,
        userId: userDataRes.userId || userDataRes._id
      };
      
      // Auto-login after registration
      setAuthToken(token);
      setUser(enhancedUserData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(enhancedUserData));
      
      return enhancedUserData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setTokenExpiry(null);
    setError('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    delete axios.defaults.headers.common['Authorization'];
    
    // Optionally call logout endpoint
    axios.post('/users/logout').catch(() => {
      // Ignore errors on logout
    });
  };

  // Get user profile
  const getProfile = async () => {
    try {
      const response = await axios.get('/users/me');
      const updatedUser = response.data.user;
      const enhancedUser = {
        ...updatedUser,
        userId: updatedUser.userId || updatedUser._id
      };
      setUser(enhancedUser);
      localStorage.setItem('user', JSON.stringify(enhancedUser));
      return enhancedUser;
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      }
      throw err;
    }
  };

  // Update profile
  const updateProfile = async (data) => {
    try {
      const userId = data.userId || user?.userId || user?._id;
      if (!userId) {
        throw new Error('User ID not found');
      }
      
      const response = await axios.put(`/users/update/${userId}`, data);
      const updatedUser = response.data.user;
      const enhancedUser = {
        ...updatedUser,
        userId: updatedUser.userId || updatedUser._id
      };
      setUser(enhancedUser);
      localStorage.setItem('user', JSON.stringify(enhancedUser));
      return enhancedUser;
    } catch (err) {
      throw err;
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await axios.post('/users/change-password', {
        currentPassword,
        newPassword
      });
    } catch (err) {
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await axios.post('/users/reset-password', { email });
    } catch (err) {
      throw err;
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.Role === role;
  };

  // Check if user has any of the given roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.Role);
  };

  // Check if user has permission
  const hasPermission = (permission) => {
    const allowedRoles = PERMISSIONS[permission];
    return allowedRoles ? hasAnyRole(allowedRoles) : false;
  };

  // Get dashboard route based on role
  const getDashboardRoute = () => {
    if (!user) return '/login';
    
    switch (user.Role) {
      case ROLES.ADMIN:
      case ROLES.MANAGER:
        return '/admin/dashboard';
      case ROLES.RECEPTIONIST:
        return '/reception/dashboard';
      case ROLES.HOUSEKEEPING:
        return '/housekeeping/tasks';
      case ROLES.GUEST:
        return '/';
      default:
        return '/';
    }
  };

  // Get remembered email
  const getRememberedEmail = () => {
    return localStorage.getItem('rememberEmail');
  };

  // Clear error
  const clearError = () => {
    setError('');
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    getProfile,
    updateProfile,
    changePassword,
    resetPassword,
    hasRole,
    hasAnyRole,
    hasPermission,
    getDashboardRoute,
    getRememberedEmail,
    clearError,
    ROLES,
    PERMISSIONS
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const withAuth = (Component) => {
  return function WithAuthComponent(props) {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        navigate('/login', { 
          state: { from: props.location?.pathname || '/' } 
        });
      }
    }, [isAuthenticated, loading, navigate, props.location]);

    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
};

export const withRole = (Component, allowedRoles) => {
  return function WithRoleComponent(props) {
    const { user, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!loading && isAuthenticated && !allowedRoles.includes(user?.Role)) {
        navigate('/unauthorized');
      }
    }, [user, isAuthenticated, loading, navigate]);

    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated || !allowedRoles.includes(user?.Role)) {
      return null;
    }

    return <Component {...props} />;
  };
};