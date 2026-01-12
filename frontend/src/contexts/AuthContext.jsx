import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// API Base URL
const API_URL = 'http://localhost:3000';

// Configure axios
axios.defaults.baseURL = API_URL;
axios.defaults.timeout = 10000;

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

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    
    // Refs to track logout state
    const isLoggingOutRef = useRef(false);

    // Set auth token in axios headers
    const setAuthToken = useCallback((token) => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, []);

    // FIXED: Logout function
    const logout = useCallback(async () => {
        if (isLoggingOutRef.current) {
            return;
        }
        
        isLoggingOutRef.current = true;
        
        try {
            // Clear local state
            setUser(null);
            setIsAuthenticated(false);
            setError('');
            
            // Clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('rememberEmail');
            
            // Remove axios auth header
            delete axios.defaults.headers.common['Authorization'];
            
            // Try to call logout API if available
            try {
                await axios.post('/users/logout', {}, {
                    timeout: 3000,
                    headers: { 'X-Skip-Interceptor': 'true' }
                });
            } catch (apiError) {
                // Ignore API errors for logout
                console.log('Logout API call skipped:', apiError.message);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            navigate('/login', { replace: true });
            setTimeout(() => {
                isLoggingOutRef.current = false;
            }, 100);
        }
    }, [navigate]);

    // Check if user is logged in on mount
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');
            
            if (token && savedUser) {
                setAuthToken(token);
                
                try {
                    // Try to verify token with server
                    const response = await axios.get('/users/me');
                    console.log('User verified successfully');
                    
                    const serverUser = response.data.user || response.data;
                    const enhancedUser = {
                        ...serverUser,
                        userId: serverUser._id || serverUser.userId
                    };
                    
                    setUser(enhancedUser);
                    setIsAuthenticated(true);
                    localStorage.setItem('user', JSON.stringify(enhancedUser));
                } catch (error) {
                    console.error('Token verification failed:', error);
                    logout();
                }
            } else {
                console.log('No valid auth data found');
            }
            setLoading(false);
        };

        initializeAuth();
    }, [setAuthToken, logout]);

    // FIXED: Interceptor for handling auth errors
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                // Skip if this request already has skip header
                if (error.config?.headers?.['X-Skip-Interceptor']) {
                    return Promise.reject(error);
                }
                
                if (error.response?.status === 401) {
                    if (!isLoggingOutRef.current) {
                        console.log('401 Unauthorized - Logging out');
                        logout();
                    }
                } else if (!error.response) {
                    console.error('Network Error - No response from server');
                    setError('Cannot connect to server. Please check if backend is running.');
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [logout]);

    // FIXED: Enhanced Login function - UPDATED FIELD NAMES
    const login = async (email, password, rememberMe = false) => {
        setError('');
        setLoading(true);
        
        console.log('Login attempt:', { email });
        
        try {
            // FIX: Use lowercase field names to match backend
            const response = await axios.post('/users/login', {
                email: email,    // lowercase 'email'
                password: password // lowercase 'password'
            });
            
            console.log('Login response:', response.data);
            
            const { token, user: userData } = response.data;
            
            if (!token || !userData) {
                throw new Error('Invalid response from server');
            }
            
            const enhancedUserData = {
                ...userData,
                userId: userData._id || userData.userId
            };
            
            setAuthToken(token);
            setUser(enhancedUserData);
            setIsAuthenticated(true);
            
            if (rememberMe) {
                localStorage.setItem('rememberEmail', email);
            } else {
                localStorage.removeItem('rememberEmail');
            }
            
            localStorage.setItem('user', JSON.stringify(enhancedUserData));
            
            console.log('Login successful');
            return enhancedUserData;
        } catch (err) {
            console.error('Login error:', err);
            
            let errorMessage = 'Login failed. Please check your credentials.';
            
            if (err.response) {
                if (err.response.status === 401 || err.response.status === 404) {
                    errorMessage = err.response.data?.message || 'Invalid email or password';
                } else if (err.response.data?.message) {
                    errorMessage = err.response.data.message;
                }
            } else if (err.request) {
                errorMessage = 'No response from server. Please make sure backend is running.';
            }
            
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // FIXED: Enhanced Register function - UPDATED FIELD NAMES
    const register = async (userData) => {
        setError('');
        setLoading(true);
        
        try {
            console.log('Register attempt:', userData.email);
            
            // FIX: Use field names that match your User model
            const response = await axios.post('/users/register', {
                fullName: `${userData.firstName} ${userData.lastName}`,
                username: userData.email.split('@')[0], // Generate username from email
                email: userData.email,
                password: userData.password,
                phone: userData.phone,
                role: userData.role || ROLES.GUEST
            });
            
            console.log('Register response:', response.data);
            
            const { token, user: userDataRes } = response.data;
            
            if (!token || !userDataRes) {
                throw new Error('Invalid response from server');
            }
            
            const enhancedUserData = {
                ...userDataRes,
                userId: userDataRes._id || userDataRes.userId
            };
            
            setAuthToken(token);
            setUser(enhancedUserData);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(enhancedUserData));
            
            return enhancedUserData;
        } catch (err) {
            console.error('Register error:', err);
            
            let errorMessage = 'Registration failed. Please try again.';
            
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.request) {
                errorMessage = 'No response from server. Check backend connection.';
            }
            
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Get user profile
    const getProfile = async () => {
        try {
            const response = await axios.get('/users/me');
            const updatedUser = response.data.user || response.data;
            const enhancedUser = {
                ...updatedUser,
                userId: updatedUser._id || updatedUser.userId
            };
            setUser(enhancedUser);
            localStorage.setItem('user', JSON.stringify(enhancedUser));
            return enhancedUser;
        } catch (err) {
            console.error('Get Profile error:', err);
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
            const updatedUser = response.data.user || response.data;
            const enhancedUser = {
                ...updatedUser,
                userId: updatedUser._id || updatedUser.userId
            };
            setUser(enhancedUser);
            localStorage.setItem('user', JSON.stringify(enhancedUser));
            return enhancedUser;
        } catch (err) {
            console.error('Update Profile error:', err);
            throw err;
        }
    };

    // Check if user has specific role
    const hasRole = (role) => {
        return user?.role === role; // lowercase 'role'
    };

    // Check if user has any of the given roles
    const hasAnyRole = (roles) => {
        return roles.includes(user?.role); // lowercase 'role'
    };

    // Check if user has permission
    const hasPermission = (permission) => {
        const allowedRoles = PERMISSIONS[permission];
        return allowedRoles ? hasAnyRole(allowedRoles) : false;
    };

    // Get dashboard route based on role
    const getDashboardRoute = () => {
        if (!user) return '/login';
        
        switch (user.role) { // lowercase 'role'
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

// HOC for protecting routes
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

// HOC for role-based access control
export const withRole = (Component, allowedRoles) => {
    return function WithRoleComponent(props) {
        const { user, isAuthenticated, loading } = useAuth();
        const navigate = useNavigate();

        useEffect(() => {
            if (!loading && isAuthenticated && !allowedRoles.includes(user?.role)) {
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

        if (!isAuthenticated || !allowedRoles.includes(user?.role)) {
            return null;
        }

        return <Component {...props} />;
    };
};