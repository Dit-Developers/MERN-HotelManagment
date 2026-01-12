import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// API Base URL
const API_URL = 'http://localhost:9000';

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

// Token refresh interval (10 minutes)
const TOKEN_REFRESH_INTERVAL = 10 * 60 * 1000;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [tokenExpiry, setTokenExpiry] = useState(null);
    const navigate = useNavigate();
    
    // Refs to track logout state and prevent multiple calls
    const isLoggingOutRef = useRef(false);
    const logoutCallCountRef = useRef(0);

    // Enhanced error logging function
    const logError = (type, error) => {
        console.error(`[Auth Error - ${type}]`, {
            message: error.message,
            response: error.response ? {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            } : 'No response',
            request: error.request ? 'Request made but no response' : 'No request made'
        });
    };

    // Test API connection function
    const testApiConnection = async () => {
        console.log('Testing API connection to:', API_URL);
        try {
            const response = await axios.get('/health', { timeout: 3000 });
            console.log('API connection test successful:', response.data);
            return true;
        } catch (err) {
            console.error('API connection test failed:', err.message);
            return false;
        }
    };

    // Set auth token in axios headers
    const setAuthToken = useCallback((token) => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
            // Calculate token expiry (assuming 24 hour expiry from backend)
            const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
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

    // FIXED: Logout function with protection against multiple calls
    const logout = useCallback(async (skipApiCall = false) => {
        // Prevent multiple simultaneous logout calls
        if (isLoggingOutRef.current) {
            console.log('Logout already in progress, skipping...');
            return;
        }
        
        isLoggingOutRef.current = true;
        logoutCallCountRef.current++;
        
        console.log(`Logout call #${logoutCallCountRef.current} started`);
        
        try {
            // Clear local state FIRST
            setUser(null);
            setIsAuthenticated(false);
            setTokenExpiry(null);
            setError('');
            
            // Clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('tokenExpiry');
            localStorage.removeItem('rememberEmail');
            
            // Remove axios auth header
            delete axios.defaults.headers.common['Authorization'];
            
            // Only call logout API if not skipped (to prevent loops)
            if (!skipApiCall) {
                try {
                    await axios.post('/users/logout', {}, {
                        timeout: 3000,
                        headers: {
                            'X-Skip-Interceptor': 'true' // Add custom header to skip interceptor
                        }
                    });
                    console.log('Logout API call successful');
                } catch (apiError) {
                    console.log('Logout API call failed (expected for stateless JWT):', apiError.message);
                    // Don't throw, we want to continue with logout even if API fails
                }
            }
            
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Navigate to login page AFTER cleanup
            navigate('/login', { replace: true });
            
            // Reset logout flag after a short delay
            setTimeout(() => {
                isLoggingOutRef.current = false;
                console.log(`Logout call #${logoutCallCountRef.current} completed`);
            }, 100);
        }
    }, [navigate]);

    // Check if user is logged in on mount
    useEffect(() => {
        const initializeAuth = async () => {
            console.log('Initializing auth...');
            
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');
            const savedExpiry = localStorage.getItem('tokenExpiry');
            
            console.log('Auth initialization data:', { 
                hasToken: !!token, 
                hasUser: !!savedUser, 
                hasExpiry: !!savedExpiry 
            });
            
            if (token && savedUser && savedExpiry) {
                const expiryTime = parseInt(savedExpiry);
                
                if (isTokenExpired()) {
                    console.log('Token expired, logging out');
                    logout(true); // Skip API call for expired token
                    setLoading(false);
                    return;
                }
                
                // Set token first
                setAuthToken(token);
                
                try {
                    // Verify token with server
                    const response = await axios.post('/users/verify-token');
                    console.log('Token verified successfully');
                    
                    // Use server's user data
                    const serverUser = response.data.user;
                    const enhancedUser = {
                        ...serverUser,
                        userId: serverUser._id || serverUser.userId
                    };
                    
                    setUser(enhancedUser);
                    setIsAuthenticated(true);
                    localStorage.setItem('user', JSON.stringify(enhancedUser));
                } catch (error) {
                    console.error('Token verification failed:', error);
                    logout(true); // Skip API call for failed verification
                }
            } else {
                console.log('No valid auth data found in localStorage');
            }
            setLoading(false);
        };

        initializeAuth();
    }, [setAuthToken, isTokenExpired, logout]);

    // FIXED: Interceptor for handling auth errors
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                // Skip if this request already has skip header
                if (error.config?.headers?.['X-Skip-Interceptor']) {
                    return Promise.reject(error);
                }
                
                logError('Response Interceptor', error);
                
                if (error.response?.status === 401) {
                    // Check if we're already logging out
                    if (!isLoggingOutRef.current) {
                        console.log('401 Unauthorized - Starting logout process');
                        // Don't call navigate here, let logout handle it
                        logout(true); // Skip API call to prevent loop
                    }
                } else if (error.response?.status === 404) {
                    console.error('404 Error - Route not found:', error.config.url);
                    setError(`API endpoint not found: ${error.config.url}. Please check backend routes.`);
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
    }, [logout]); // Add logout to dependencies

    // Enhanced Login function
    const login = async (email, password, rememberMe = false) => {
        setError('');
        setLoading(true);
        
        console.log('Login attempt started:', { email });
        
        try {
            const response = await axios.post('/users/Login', {
                Email: email,
                Password: password
            });
            
            console.log('Login response received:', response.data);
            
            const { token, user: userData } = response.data;
            
            if (!token || !userData) {
                throw new Error('Invalid response from server');
            }
            
            // Ensure userData has userId
            const enhancedUserData = {
                ...userData,
                userId: userData._id || userData.userId
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
            
            console.log('Login successful:', enhancedUserData);
            
            return enhancedUserData;
        } catch (err) {
            logError('Login', err);
            
            let errorMessage = 'Login failed. Please check your credentials.';
            
            if (err.response) {
                if (err.response.status === 401 || err.response.status === 404) {
                    errorMessage = err.response.data?.message || 'Invalid email or password';
                } else if (err.response.data?.message) {
                    errorMessage = err.response.data.message;
                } else {
                    errorMessage = `Server error: ${err.response.status}`;
                }
            } else if (err.request) {
                errorMessage = 'No response from server. Please make sure backend is running on port 9000.';
            } else {
                errorMessage = err.message || 'Login failed';
            }
            
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Enhanced Register function
    const register = async (userData) => {
        setError('');
        setLoading(true);
        
        try {
            console.log('Register attempt:', userData.email);
            
            const response = await axios.post('/users/Register', {
                Name: `${userData.firstName} ${userData.lastName}`,
                Email: userData.email,
                Password: userData.password,
                Phone: userData.phone,
                Address: userData.address || '',
                Role: userData.role || ROLES.GUEST
            });
            
            console.log('Register response:', response.data);
            
            const { token, user: userDataRes } = response.data;
            
            if (!token || !userDataRes) {
                throw new Error('Invalid response from server');
            }
            
            // Ensure userDataRes has userId
            const enhancedUserData = {
                ...userDataRes,
                userId: userDataRes._id || userDataRes.userId
            };
            
            // Auto-login after registration
            setAuthToken(token);
            setUser(enhancedUserData);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(enhancedUserData));
            
            return enhancedUserData;
        } catch (err) {
            logError('Register', err);
            
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
            const updatedUser = response.data.user;
            const enhancedUser = {
                ...updatedUser,
                userId: updatedUser._id || updatedUser.userId
            };
            setUser(enhancedUser);
            localStorage.setItem('user', JSON.stringify(enhancedUser));
            return enhancedUser;
        } catch (err) {
            logError('Get Profile', err);
            if (err.response?.status === 401) {
                logout(true); // Skip API call to prevent loop
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
            
            const response = await axios.put(`/users/Update/${userId}`, data);
            const updatedUser = response.data.user;
            const enhancedUser = {
                ...updatedUser,
                userId: updatedUser._id || updatedUser.userId
            };
            setUser(enhancedUser);
            localStorage.setItem('user', JSON.stringify(enhancedUser));
            return enhancedUser;
        } catch (err) {
            logError('Update Profile', err);
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
            logError('Change Password', err);
            throw err;
        }
    };

    // Reset password
    const resetPassword = async (email) => {
        try {
            await axios.post('/users/reset-password', { email });
        } catch (err) {
            logError('Reset Password', err);
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

    // Test backend endpoints (for debugging)
    const testEndpoints = async () => {
        console.log('Testing backend endpoints...');
        
        const endpoints = [
            { method: 'GET', url: '/health' },
            { method: 'POST', url: '/users/Login' },
            { method: 'POST', url: '/users/Register' }
        ];
        
        for (const endpoint of endpoints) {
            try {
                console.log(`Testing ${endpoint.method} ${endpoint.url}`);
                const response = await axios({
                    method: endpoint.method,
                    url: endpoint.url,
                    data: endpoint.method === 'POST' ? { test: true } : undefined
                });
                console.log(`✓ ${endpoint.url}: ${response.status}`);
            } catch (err) {
                console.error(`✗ ${endpoint.url}: ${err.response?.status || err.message}`);
            }
        }
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
        testEndpoints,
        testApiConnection,
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