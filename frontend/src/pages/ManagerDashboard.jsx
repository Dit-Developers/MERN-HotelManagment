import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaTachometerAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaBroom,
  FaStar,
  FaSignOutAlt,
  FaSyncAlt,
  FaUserCircle,
  FaChevronRight,
  FaEye,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaClock,
  FaHotel,
  FaUsers,
  FaChartLine,
  FaComments,
  FaFilter,
  FaEdit,
  FaChevronDown
} from 'react-icons/fa';
import FormStatus from '../component/FormStatus';

function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [housekeeping, setHousekeeping] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [users, setUsers] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Filter states
  const [dateFilter, setDateFilter] = useState('today');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [user] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
  const API_URL = 'http://localhost:5001/api';
  const token = localStorage.getItem('token');

  // Custom color styles matching HomePage
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

  // Updated styles
  const tabBaseClasses = "flex items-center gap-3 px-6 py-4 text-sm font-light tracking-wider uppercase transition-all duration-300 border-l-4";
  const activeTabClasses = "font-normal shadow-inner";
  
  const selectClasses = "rounded-sm border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 font-light transition-all duration-300 bg-white/80 backdrop-blur-sm";
  const smallSelectClasses = "rounded-sm border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 font-light transition-all duration-300 bg-white/80 backdrop-blur-sm min-w-[140px]";
  const cardClasses = "rounded-sm border bg-white/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg transition-all duration-500";
  const tableHeaderClasses = "grid grid-cols-5 rounded-sm bg-gray-50 px-4 py-3 text-xs font-light tracking-wider uppercase text-gray-600";
  const tableRowClasses = "grid grid-cols-5 border-b border-gray-100 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-300";

  // Clear messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const usersRes = await fetch(`${API_URL}/get-all-users`, { headers });
      const usersData = await usersRes.json();
      setUsers(Array.isArray(usersData?.allUsers) ? usersData.allUsers :
               Array.isArray(usersData) ? usersData : []);

      // Fetch bookings
      const bookingsRes = await fetch(`${API_URL}/booking/all-bookings`, { headers });
      const bookingsData = await bookingsRes.json();
      setBookings(Array.isArray(bookingsData?.allBookings) ? bookingsData.allBookings : 
                  Array.isArray(bookingsData) ? bookingsData : []);
      
      // Fetch revenue data (payments)
      const revenueRes = await fetch(`${API_URL}/payment/get-all-payments`, { headers });
      const revenueData = await revenueRes.json();
      setRevenueData(Array.isArray(revenueData?.payments) ? revenueData.payments : 
                     Array.isArray(revenueData) ? revenueData : []);
      
      // Fetch service requests for housekeeping
      const housekeepingRes = await fetch(`${API_URL}/service-requests`, { headers });
      const housekeepingData = await housekeepingRes.json();
      const requests = Array.isArray(housekeepingData?.serviceRequests) ? 
                      housekeepingData.serviceRequests : 
                      Array.isArray(housekeepingData) ? housekeepingData : [];
      setServiceRequests(requests);
      const housekeepingRequests = requests.filter(req => 
        req.serviceType === 'housekeeping' || 
        req.serviceType === 'room_cleaning' ||
        (req.serviceType && req.serviceType.toLowerCase().includes('clean'))
      );
      setHousekeeping(housekeepingRequests);
      
      // Fetch feedbacks (reviews)
      const feedbackRes = await fetch(`${API_URL}/reviews/get-all-reviews`, { headers });
      const feedbackData = await feedbackRes.json();
      setFeedbacks(Array.isArray(feedbackData?.getReviews) ? feedbackData.getReviews : 
                   Array.isArray(feedbackData) ? feedbackData : []);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]);

  const fetchTabData = useCallback(async (tab) => {
    setLoading(true);
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      switch(tab) {
        case 'bookings': {
          const bookingsRes = await fetch(`${API_URL}/booking/all-bookings`, { headers });
          const bookingsData = await bookingsRes.json();
          setBookings(Array.isArray(bookingsData?.allBookings) ? bookingsData.allBookings : 
                     Array.isArray(bookingsData) ? bookingsData : []);
          break;
        }
        
        case 'revenue': {
          const revenueRes = await fetch(`${API_URL}/payment/get-all-payments`, { headers });
          const revenueData = await revenueRes.json();
          setRevenueData(Array.isArray(revenueData?.payments) ? revenueData.payments : 
                        Array.isArray(revenueData) ? revenueData : []);
          break;
        }
        
        case 'housekeeping': {
          const housekeepingRes = await fetch(`${API_URL}/service-requests`, { headers });
          const housekeepingData = await housekeepingRes.json();
          const requests = Array.isArray(housekeepingData?.serviceRequests) ? 
                          housekeepingData.serviceRequests : 
                          Array.isArray(housekeepingData) ? housekeepingData : [];
          setServiceRequests(requests);
          const housekeepingRequests = requests.filter(req => 
            req.serviceType === 'housekeeping' || 
            req.serviceType === 'room_cleaning' ||
            (req.serviceType && req.serviceType.toLowerCase().includes('clean'))
          );
          setHousekeeping(housekeepingRequests);
          break;
        }
        
        case 'guests': {
          const usersRes = await fetch(`${API_URL}/get-all-users`, { headers });
          const usersData = await usersRes.json();
          setUsers(Array.isArray(usersData?.allUsers) ? usersData.allUsers :
                   Array.isArray(usersData) ? usersData : []);

          const bookingsRes = await fetch(`${API_URL}/booking/all-bookings`, { headers });
          const bookingsData = await bookingsRes.json();
          setBookings(Array.isArray(bookingsData?.allBookings) ? bookingsData.allBookings : 
                     Array.isArray(bookingsData) ? bookingsData : []);

          const revenueRes = await fetch(`${API_URL}/payment/get-all-payments`, { headers });
          const revenueData = await revenueRes.json();
          setRevenueData(Array.isArray(revenueData?.payments) ? revenueData.payments : 
                        Array.isArray(revenueData) ? revenueData : []);

          const housekeepingRes = await fetch(`${API_URL}/service-requests`, { headers });
          const housekeepingData = await housekeepingRes.json();
          const requests = Array.isArray(housekeepingData?.serviceRequests) ? 
                          housekeepingData.serviceRequests : 
                          Array.isArray(housekeepingData) ? housekeepingData : [];
          setServiceRequests(requests);
          const housekeepingRequests = requests.filter(req => 
            req.serviceType === 'housekeeping' || 
            req.serviceType === 'room_cleaning' ||
            (req.serviceType && req.serviceType.toLowerCase().includes('clean'))
          );
          setHousekeeping(housekeepingRequests);
          break;
        }
        
        case 'feedback': {
          const feedbackRes = await fetch(`${API_URL}/reviews/get-all-reviews`, { headers });
          const feedbackData = await feedbackRes.json();
          setFeedbacks(Array.isArray(feedbackData?.getReviews) ? feedbackData.getReviews : 
                      Array.isArray(feedbackData) ? feedbackData : []);
          break;
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]);

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token, fetchAllData]);

  useEffect(() => {
    if (token && activeTab !== 'dashboard') {
      fetchTabData(activeTab);
    }
  }, [activeTab, token, fetchTabData]);

  useEffect(() => {
    const handleFocus = () => {
      if (token) {
        fetchAllData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [token, fetchAllData]);

  // Refresh all data
  const refreshData = () => {
    fetchAllData();
  };

  // Generic API call function
  const apiCall = async (method, endpoint, data = null) => {
    setError('');
    setSuccess('');
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const options = { method, headers };
      if (data) options.body = JSON.stringify(data);

      const response = await fetch(`${API_URL}${endpoint}`, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Request failed');
      }

      setSuccess(result.message || 'Operation successful');
      fetchAllData(); // Refresh all data after successful operation
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update booking status
  const updateBookingStatus = async (id, status) => {
    await apiCall('PUT', `/booking/update-booking-status/${id}`, { bookingStatus: status });
  };

  // Update housekeeping status
  const updateHousekeepingStatus = async (id, status) => {
    await apiCall('PUT', `/service-requests/${id}/status`, { status });
  };

  // Filter revenue by date
  const filterRevenueByDate = () => {
    const revenueArray = Array.isArray(revenueData) ? revenueData : [];
    if (revenueArray.length === 0) {
      return [];
    }
    
    const now = new Date();
    let filtered = revenueArray;
    
    if (dateFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(payment => 
        payment.createdAt && payment.createdAt.toString().startsWith(today)
      );
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(payment => {
        if (!payment.createdAt) return false;
        const paymentDate = new Date(payment.createdAt);
        return paymentDate >= weekAgo;
      });
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(payment => {
        if (!payment.createdAt) return false;
        const paymentDate = new Date(payment.createdAt);
        return paymentDate >= monthAgo;
      });
    }
    // 'all' filter returns all data
    
    return filtered;
  };

  // Filter bookings by status
  const filterBookingsByStatus = () => {
    const bookingsArray = Array.isArray(bookings) ? bookings : [];
    if (bookingsArray.length === 0) return [];
    if (statusFilter === 'all') return bookingsArray;
    return bookingsArray.filter(booking => booking.bookingStatus === statusFilter);
  };

  // Calculate revenue totals
  const calculateRevenue = () => {
    const filteredRevenue = filterRevenueByDate();
    const revenueArray = Array.isArray(filteredRevenue) ? filteredRevenue : [];
    
    if (revenueArray.length === 0) {
      return { total: 0, completed: 0, pending: 0, totalTransactions: 0 };
    }
    
    const total = revenueArray.reduce((sum, payment) => {
      const amount = parseFloat(payment.amount) || 0;
      return sum + amount;
    }, 0);
    
    const completed = revenueArray.filter(p => p.status === 'completed').length;
    const pending = revenueArray.filter(p => p.status === 'pending').length;
    
    return { 
      total: total.toFixed(2), 
      completed, 
      pending, 
      totalTransactions: revenueArray.length 
    };
  };

  // Calculate dashboard statistics
  const calculateDashboardStats = () => {
    const bookingsArray = Array.isArray(bookings) ? bookings : [];
    const housekeepingArray = Array.isArray(housekeeping) ? housekeeping : [];
    const revenueStats = calculateRevenue();
    
    const activeBookings = bookingsArray.filter(b => b.bookingStatus === 'checked-in').length;
    const pendingRequests = housekeepingArray.filter(h => h.status === 'pending').length;
    const totalBookings = bookingsArray.length;
    
    return {
      totalBookings,
      activeBookings,
      totalRevenue: revenueStats.total,
      pendingRequests
    };
  };

  const isSameId = (a, b) => {
    if (!a || !b) return false;
    const aVal = typeof a === 'object' ? a._id : a;
    const bVal = typeof b === 'object' ? b._id : b;
    if (!aVal || !bVal) return false;
    return String(aVal) === String(bVal);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  // Render content based on active tab
  const renderContent = () => {
    if (loading && activeTab === 'dashboard') {
      return (
        <div className="py-20 text-center">
          <div className="mx-auto w-16 h-16 border-t-2 border-b-2 rounded-full animate-spin" style={{ borderColor: customStyles.gold[600] }}></div>
          <p className="mt-4 text-gray-600 font-light">Loading dashboard...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard': {
        const dashboardStats = calculateDashboardStats();
        return (
          <div className="space-y-8">
            <div className={cardClasses}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-2xl font-serif font-light text-gray-900 mb-2">
                    Welcome, <span style={{ color: customStyles.gold[600] }}>{user?.fullName}</span>
                  </h1>
                  <p className="text-gray-600 font-light">
                    Hotel Manager Dashboard - Overview
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={refreshData}
                    className="group flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase"
                    style={{ 
                      backgroundColor: customStyles.gold[600],
                      color: 'white'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                  >
                    <FaSyncAlt className="animate-spin group-hover:animate-none" />
                    Refresh Data
                  </button>
                </div>
              </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                className={cardClasses}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderLeftColor = customStyles.gold[600];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderLeftColor = customStyles.navy[600];
                }}
                style={{ borderLeft: `4px solid ${customStyles.navy[600]}` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full" style={{ backgroundColor: `${customStyles.navy[600]}20` }}>
                    <FaHotel className="text-xl" style={{ color: customStyles.navy[600] }} />
                  </div>
                  <span 
                    className="text-xs font-light tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${customStyles.navy[600]}20`,
                      color: customStyles.navy[700]
                    }}
                  >
                    Total
                  </span>
                </div>
                <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">Total Bookings</p>
                <p className="text-2xl font-light" style={{ color: customStyles.navy[900] }}>{dashboardStats.totalBookings}</p>
              </div>

              <div 
                className={cardClasses}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderLeftColor = customStyles.gold[600];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderLeftColor = customStyles.gold[600];
                }}
                style={{ borderLeft: `4px solid ${customStyles.gold[600]}` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full" style={{ backgroundColor: `${customStyles.gold[600]}20` }}>
                    <FaUsers className="text-xl" style={{ color: customStyles.gold[600] }} />
                  </div>
                  <span 
                    className="text-xs font-light tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${customStyles.gold[600]}20`,
                      color: customStyles.gold[700]
                    }}
                  >
                    Active
                  </span>
                </div>
                <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">Active Bookings</p>
                <p className="text-2xl font-light" style={{ color: customStyles.navy[900] }}>{dashboardStats.activeBookings}</p>
              </div>

              <div 
                className={cardClasses}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderLeftColor = customStyles.gold[600];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderLeftColor = customStyles.navy[600];
                }}
                style={{ borderLeft: `4px solid ${customStyles.navy[600]}` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full" style={{ backgroundColor: `${customStyles.navy[600]}20` }}>
                    <FaDollarSign className="text-xl" style={{ color: customStyles.navy[600] }} />
                  </div>
                  <span 
                    className="text-xs font-light tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${customStyles.navy[600]}20`,
                      color: customStyles.navy[700]
                    }}
                  >
                    Revenue
                  </span>
                </div>
                <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">Total Revenue</p>
                <p className="text-2xl font-light" style={{ color: customStyles.navy[900] }}>${dashboardStats.totalRevenue}</p>
              </div>

              <div 
                className={cardClasses}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderLeftColor = customStyles.gold[600];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderLeftColor = customStyles.gold[600];
                }}
                style={{ borderLeft: `4px solid ${customStyles.gold[600]}` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full" style={{ backgroundColor: `${customStyles.gold[600]}20` }}>
                    <FaBroom className="text-xl" style={{ color: customStyles.gold[600] }} />
                  </div>
                  <span 
                    className="text-xs font-light tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${customStyles.gold[600]}20`,
                      color: customStyles.gold[700]
                    }}
                  >
                    Pending
                  </span>
                </div>
                <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">Pending Requests</p>
                <p className="text-2xl font-light" style={{ color: customStyles.navy[900] }}>{dashboardStats.pendingRequests}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={cardClasses}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-light text-gray-900">
                  Quick <span style={{ color: customStyles.navy[900] }}>Actions</span>
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  className="group flex flex-col items-center justify-center p-5 rounded-sm border transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  style={{ borderColor: customStyles.navy[200] }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = customStyles.gold[600];
                    e.currentTarget.style.backgroundColor = customStyles.gold[50];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = customStyles.navy[200];
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onClick={() => setActiveTab('bookings')}
                >
                  <FaCalendarAlt className="text-2xl mb-3" style={{ color: customStyles.navy[600] }} />
                  <span className="text-sm font-light tracking-wider" style={{ color: customStyles.navy[900] }}>View Bookings</span>
                </button>
                
                <button
                  className="group flex flex-col items-center justify-center p-5 rounded-sm border transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  style={{ borderColor: customStyles.navy[200] }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = customStyles.gold[600];
                    e.currentTarget.style.backgroundColor = customStyles.gold[50];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = customStyles.navy[200];
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onClick={() => setActiveTab('revenue')}
                >
                  <FaDollarSign className="text-2xl mb-3" style={{ color: customStyles.gold[600] }} />
                  <span className="text-sm font-light tracking-wider" style={{ color: customStyles.navy[900] }}>View Revenue</span>
                </button>
                
                <button
                  className="group flex flex-col items-center justify-center p-5 rounded-sm border transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  style={{ borderColor: customStyles.navy[200] }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = customStyles.gold[600];
                    e.currentTarget.style.backgroundColor = customStyles.gold[50];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = customStyles.navy[200];
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onClick={() => setActiveTab('housekeeping')}
                >
                  <FaBroom className="text-2xl mb-3" style={{ color: customStyles.navy[600] }} />
                  <span className="text-sm font-light tracking-wider" style={{ color: customStyles.navy[900] }}>Monitor Cleaning</span>
                </button>
                
                <button
                  className="group flex flex-col items-center justify-center p-5 rounded-sm border transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  style={{ borderColor: customStyles.navy[200] }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = customStyles.gold[600];
                    e.currentTarget.style.backgroundColor = customStyles.gold[50];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = customStyles.navy[200];
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onClick={() => setActiveTab('feedback')}
                >
                  <FaStar className="text-2xl mb-3" style={{ color: customStyles.gold[600] }} />
                  <span className="text-sm font-light tracking-wider" style={{ color: customStyles.navy[900] }}>View Feedback</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className={cardClasses}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-light text-gray-900">
                    Recent <span style={{ color: customStyles.navy[900] }}>Bookings</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('bookings')}
                    className="group flex items-center gap-2 text-sm font-light tracking-wider uppercase"
                    style={{ color: customStyles.navy[900] }}
                    onMouseEnter={(e) => e.currentTarget.style.color = customStyles.gold[700]}
                    onMouseLeave={(e) => e.currentTarget.style.color = customStyles.navy[900]}
                  >
                    View All
                    <FaChevronRight className="transform group-hover:translate-x-1 transition-transform duration-300 text-xs" />
                  </button>
                </div>
                
                {Array.isArray(bookings) && bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map((b, index) => (
                      <div 
                        key={b._id || index} 
                        className="flex items-center justify-between p-4 rounded-sm border transition-all duration-300 hover:bg-white/50"
                        style={{ borderColor: customStyles.navy[200] }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-light"
                            style={{ 
                              backgroundColor: `${customStyles.navy[600]}20`,
                              color: customStyles.navy[700]
                            }}
                          >
                            #{b._id ? b._id.slice(-6) : 'N/A'}
                          </div>
                          <div>
                            <p className="text-sm font-light" style={{ color: customStyles.navy[900] }}>
                              Room: {b.roomId || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-600 font-light">Guest: {b.guestId?.slice(-6) || 'N/A'}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-light tracking-wider ${
                          b.bookingStatus === 'checked-in' 
                            ? 'bg-green-100 text-green-800'
                            : b.bookingStatus === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : b.bookingStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {b.bookingStatus || 'unknown'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 font-light">No recent bookings</p>
                  </div>
                )}
              </div>

              <div className={cardClasses}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-light text-gray-900">
                    Recent <span style={{ color: customStyles.navy[900] }}>Revenue</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('revenue')}
                    className="group flex items-center gap-2 text-sm font-light tracking-wider uppercase"
                    style={{ color: customStyles.navy[900] }}
                    onMouseEnter={(e) => e.currentTarget.style.color = customStyles.gold[700]}
                    onMouseLeave={(e) => e.currentTarget.style.color = customStyles.navy[900]}
                  >
                    View All
                    <FaChevronRight className="transform group-hover:translate-x-1 transition-transform duration-300 text-xs" />
                  </button>
                </div>
                
                {Array.isArray(revenueData) && revenueData.length > 0 ? (
                  <div className="space-y-4">
                    {revenueData.slice(0, 3).map((p, index) => (
                      <div 
                        key={p._id || index} 
                        className="flex items-center justify-between p-4 rounded-sm border transition-all duration-300 hover:bg-white/50"
                        style={{ borderColor: customStyles.navy[200] }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-light"
                            style={{ 
                              backgroundColor: `${customStyles.gold[600]}20`,
                              color: customStyles.gold[700]
                            }}
                          >
                            ${parseFloat(p.amount || 0).toFixed(2)}
                          </div>
                          <div>
                            <p className="text-sm font-light" style={{ color: customStyles.navy[900] }}>
                              {p.paymentMethod || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-600 font-light">Payment #{p._id?.slice(-6) || 'N/A'}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-light tracking-wider ${
                          p.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : p.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {p.status || 'unknown'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 font-light">No recent payments</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }

      case 'bookings': {
        const filteredBookings = filterBookingsByStatus();
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-serif font-light text-gray-900 mb-2">
                  Manage <span style={{ color: customStyles.navy[900] }}>Bookings</span>
                </h2>
                <p className="text-gray-600 font-light">
                  Administer hotel bookings and reservations
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-600" />
                  <select
                    className={selectClasses}
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked-in">Checked-in</option>
                    <option value="checked-out">Checked-out</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <button 
                  onClick={refreshData}
                  className="group flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase"
                  style={{ 
                    backgroundColor: customStyles.gold[600],
                    color: 'white'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                >
                  <FaSyncAlt className="animate-spin group-hover:animate-none" />
                  Refresh
                </button>
              </div>
            </div>

            <div className={cardClasses}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-light text-gray-900 mb-2">
                  All Bookings <span className="text-sm font-normal" style={{ color: customStyles.gold[600] }}>({filteredBookings.length})</span>
                </h3>
              </div>
              
              {loading ? (
                <div className="py-20 text-center">
                  <div className="mx-auto w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin" style={{ borderColor: customStyles.gold[600] }}></div>
                  <p className="mt-4 text-gray-600 font-light">Loading bookings...</p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <FaCalendarAlt className="text-4xl mx-auto mb-4" style={{ color: customStyles.navy[300] }} />
                  <p className="text-gray-600 font-light">No bookings found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map(b => (
                    <div 
                      key={b._id || Math.random()} 
                      className="group flex items-center justify-between p-5 rounded-sm border transition-all duration-300 hover:bg-white/70 hover:shadow-md"
                      style={{ borderColor: customStyles.navy[200] }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ 
                            backgroundColor: `${customStyles.navy[600]}20`,
                            color: customStyles.navy[700]
                          }}
                        >
                          <FaCalendarAlt className="text-xl" />
                        </div>
                        <div>
                          <h4 className="text-base font-light mb-1" style={{ color: customStyles.navy[900] }}>
                            Booking #{b._id ? b._id.slice(-6) : 'N/A'}
                          </h4>
                          <p className="text-sm text-gray-600 font-light">Guest: {b.guestId || 'N/A'}</p>
                          <p className="text-sm text-gray-600 font-light">Room: {b.roomId || 'N/A'}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs font-light px-2 py-1 rounded-sm bg-gray-100 text-gray-800">
                              Check-in: {b.checkinDate ? new Date(b.checkinDate).toLocaleDateString() : 'N/A'}
                            </span>
                            <span className="text-xs font-light px-2 py-1 rounded-sm bg-gray-100 text-gray-800">
                              Check-out: {b.checkoutDate ? new Date(b.checkoutDate).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-light tracking-wider ${
                          b.bookingStatus === 'checked-in'
                            ? 'bg-green-100 text-green-800'
                            : b.bookingStatus === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : b.bookingStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : b.bookingStatus === 'checked-out'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {b.bookingStatus || 'unknown'}
                        </span>
                        <select
                          className={smallSelectClasses}
                          value={b.bookingStatus || 'pending'}
                          onChange={e => updateBookingStatus(b._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="checked-in">Checked-in</option>
                          <option value="checked-out">Checked-out</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }

      case 'revenue': {
        const filteredRevenue = filterRevenueByDate();
        const revenueStats = calculateRevenue();
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-serif font-light text-gray-900 mb-2">
                  Revenue <span style={{ color: customStyles.navy[900] }}>Reports</span>
                </h2>
                <p className="text-gray-600 font-light">
                  Financial overview and transaction details
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-600" />
                  <select
                    className={selectClasses}
                    value={dateFilter}
                    onChange={e => setDateFilter(e.target.value)}
                  >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="all">All Time</option>
                  </select>
                </div>
                <button 
                  onClick={refreshData}
                  className="group flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase"
                  style={{ 
                    backgroundColor: customStyles.gold[600],
                    color: 'white'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                >
                  <FaSyncAlt className="animate-spin group-hover:animate-none" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                className={cardClasses}
                style={{ borderLeft: `4px solid ${customStyles.gold[600]}` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full" style={{ backgroundColor: `${customStyles.gold[600]}20` }}>
                    <FaDollarSign className="text-xl" style={{ color: customStyles.gold[600] }} />
                  </div>
                </div>
                <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">Total Revenue</p>
                <p className="text-2xl font-light" style={{ color: customStyles.navy[900] }}>${revenueStats.total}</p>
              </div>

              <div 
                className={cardClasses}
                style={{ borderLeft: `4px solid ${customStyles.navy[600]}` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full" style={{ backgroundColor: `${customStyles.navy[600]}20` }}>
                    <FaCheckCircle className="text-xl" style={{ color: customStyles.navy[600] }} />
                  </div>
                </div>
                <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">Completed</p>
                <p className="text-2xl font-light" style={{ color: customStyles.navy[900] }}>{revenueStats.completed}</p>
                <p className="text-xs text-gray-600 font-light mt-2">Transactions</p>
              </div>

              <div 
                className={cardClasses}
                style={{ borderLeft: `4px solid ${customStyles.gold[600]}` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full" style={{ backgroundColor: `${customStyles.gold[600]}20` }}>
                    <FaClock className="text-xl" style={{ color: customStyles.gold[600] }} />
                  </div>
                </div>
                <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">Pending</p>
                <p className="text-2xl font-light" style={{ color: customStyles.navy[900] }}>{revenueStats.pending}</p>
                <p className="text-xs text-gray-600 font-light mt-2">Transactions</p>
              </div>

              <div 
                className={cardClasses}
                style={{ borderLeft: `4px solid ${customStyles.navy[600]}` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full" style={{ backgroundColor: `${customStyles.navy[600]}20` }}>
                    <FaChartLine className="text-xl" style={{ color: customStyles.navy[600] }} />
                  </div>
                </div>
                <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">Total</p>
                <p className="text-2xl font-light" style={{ color: customStyles.navy[900] }}>{revenueStats.totalTransactions}</p>
                <p className="text-xs text-gray-600 font-light mt-2">Transactions</p>
              </div>
            </div>

            <div className={cardClasses}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-light text-gray-900 mb-2">
                  Payment Details <span className="text-sm font-normal" style={{ color: customStyles.gold[600] }}>({filteredRevenue.length})</span>
                </h3>
              </div>
              
              {loading ? (
                <div className="py-20 text-center">
                  <div className="mx-auto w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin" style={{ borderColor: customStyles.gold[600] }}></div>
                  <p className="mt-4 text-gray-600 font-light">Loading payments...</p>
                </div>
              ) : filteredRevenue.length === 0 ? (
                <div className="text-center py-12">
                  <FaDollarSign className="text-4xl mx-auto mb-4" style={{ color: customStyles.navy[300] }} />
                  <p className="text-gray-600 font-light">No payment records found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className={tableHeaderClasses}>
                    <span>ID</span>
                    <span>Amount</span>
                    <span>Method</span>
                    <span>Status</span>
                    <span>Date</span>
                  </div>
                  {filteredRevenue.map(p => (
                    <div key={p._id || Math.random()} className={tableRowClasses}>
                      <span className="font-light">#{p._id ? p._id.slice(-6) : 'N/A'}</span>
                      <span className="font-light">${parseFloat(p.amount || 0).toFixed(2)}</span>
                      <span className="font-light">{p.paymentMethod || 'N/A'}</span>
                      <span className={`font-light ${
                        p.status === 'completed'
                          ? 'text-green-600'
                          : p.status === 'pending'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                        {p.status || 'unknown'}
                      </span>
                      <span className="font-light">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }

      case 'guests': {
        const guestsArray = Array.isArray(users) ? users.filter(u => {
          const role = u?.role ? u.role.toLowerCase() : '';
          return role === 'guest' || role === 'user' || !role;
        }) : [];

        const guestBookings = selectedGuest && Array.isArray(bookings)
          ? bookings.filter(b => 
              isSameId(b.guestId, selectedGuest._id) || 
              isSameId(b.userId, selectedGuest._id)
            )
          : [];

        const guestPayments = selectedGuest && Array.isArray(revenueData)
          ? revenueData.filter(p => 
              isSameId(p.userId, selectedGuest._id) || 
              isSameId(p.guestId, selectedGuest._id)
            )
          : [];

        const guestServiceRequests = selectedGuest && Array.isArray(serviceRequests)
          ? serviceRequests.filter(sr => isSameId(sr.userId, selectedGuest._id))
          : [];

        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-serif font-light text-gray-900 mb-2">
                  Guest <span style={{ color: customStyles.navy[900] }}>Insights</span>
                </h2>
                <p className="text-gray-600 font-light">
                  View guest booking, payment, and service history
                </p>
              </div>
              <button 
                onClick={refreshData}
                className="group flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase"
                style={{ 
                  backgroundColor: customStyles.gold[600],
                  color: 'white'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
              >
                <FaSyncAlt className="animate-spin group-hover:animate-none" />
                Refresh
              </button>
            </div>

            {selectedGuest && (
              <div className={cardClasses}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-light text-gray-900 mb-1">
                      Guest Details
                    </h3>
                    <p className="text-sm font-light text-gray-600">
                      {selectedGuest.fullName} ({selectedGuest.email})
                    </p>
                  </div>
                  <button
                    className="px-3 py-2 text-sm font-light tracking-wider uppercase rounded-sm border transition-all duration-300"
                    style={{ 
                      borderColor: customStyles.navy[600],
                      color: customStyles.navy[600]
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = customStyles.navy[600];
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = customStyles.navy[600];
                    }}
                    onClick={() => setSelectedGuest(null)}
                  >
                    Close
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-light tracking-wider uppercase mb-3 text-gray-700">
                      Bookings ({guestBookings.length})
                    </h4>
                    {guestBookings.length === 0 ? (
                      <p className="text-sm text-gray-500 font-light">No bookings found</p>
                    ) : (
                      <div className="space-y-3">
                        {guestBookings.map(b => (
                          <div key={b._id} className="rounded-sm border px-4 py-3 text-sm font-light" style={{ borderColor: customStyles.navy[200] }}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-800">Booking #{b._id?.slice(-6)}</span>
                              <span className="text-xs px-2 py-1 rounded-sm bg-gray-100 text-gray-800">
                                Room {b.roomId}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600">
                              Check-in: {b.checkinDate ? new Date(b.checkinDate).toLocaleDateString() : 'N/A'}
                            </div>
                            <div className="text-xs text-gray-600">
                              Check-out: {b.checkoutDate ? new Date(b.checkoutDate).toLocaleDateString() : 'N/A'}
                            </div>
                            <div className="mt-1 text-xs">
                              <span className={`px-2 py-1 rounded-sm ${
                                b.bookingStatus === 'confirmed'
                                  ? 'bg-green-100 text-green-800'
                                  : b.bookingStatus === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : b.bookingStatus === 'checked-in'
                                  ? 'bg-blue-100 text-blue-800'
                                  : b.bookingStatus === 'checked-out'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {b.bookingStatus}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-light tracking-wider uppercase mb-3 text-gray-700">
                      Payments ({guestPayments.length})
                    </h4>
                    {guestPayments.length === 0 ? (
                      <p className="text-sm text-gray-500 font-light">No payments found</p>
                    ) : (
                      <div className="space-y-3">
                        {guestPayments.map(p => (
                          <div key={p._id} className="rounded-sm border px-4 py-3 text-sm font-light" style={{ borderColor: customStyles.navy[200] }}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-800">Payment #{p._id?.slice(-6)}</span>
                              <span className="text-xs font-medium">
                                ${parseFloat(p.amount || 0).toFixed(2)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600">
                              Status: <span className="font-medium">{p.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-light tracking-wider uppercase mb-3 text-gray-700">
                      Service Requests ({guestServiceRequests.length})
                    </h4>
                    {guestServiceRequests.length === 0 ? (
                      <p className="text-sm text-gray-500 font-light">No service requests found</p>
                    ) : (
                      <div className="space-y-3">
                        {guestServiceRequests.map(sr => (
                          <div key={sr._id} className="rounded-sm border px-4 py-3 text-sm font-light" style={{ borderColor: customStyles.navy[200] }}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-800">{sr.serviceType}</span>
                              <span className={`text-xs px-2 py-1 rounded-sm ${
                                sr.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : sr.status === 'in_progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : sr.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {sr.status}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 mb-1">
                              Room: {sr.roomNumber}
                            </div>
                            <div className="text-xs text-gray-700">
                              {sr.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className={cardClasses}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-light text-gray-900 mb-2">
                  All Guests <span className="text-sm font-normal" style={{ color: customStyles.gold[600] }}>({guestsArray.length})</span>
                </h3>
              </div>
              {loading ? (
                <div className="py-20 text-center">
                  <div className="mx-auto w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin" style={{ borderColor: customStyles.gold[600] }}></div>
                  <p className="mt-4 text-gray-600 font-light">Loading guests...</p>
                </div>
              ) : guestsArray.length === 0 ? (
                <div className="text-center py-12">
                  <FaUsers className="text-4xl mx-auto mb-4" style={{ color: customStyles.navy[300] }} />
                  <p className="text-gray-600 font-light">No guests found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {guestsArray.map(g => (
                      <div 
                        key={g._id}
                        className="rounded-sm border p-5 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300"
                        style={{ borderColor: customStyles.navy[200] }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ 
                                backgroundColor: `${customStyles.navy[600]}20`,
                                color: customStyles.navy[700]
                              }}
                            >
                              <FaUserCircle className="text-lg" />
                            </div>
                            <div>
                              <h4 className="text-base font-light" style={{ color: customStyles.navy[900] }}>
                                {g.fullName}
                              </h4>
                              <p className="text-sm text-gray-600 font-light">{g.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-light tracking-wider px-2 py-1 rounded-sm"
                            style={{ 
                              backgroundColor: `${customStyles.gold[600]}20`,
                              color: customStyles.gold[700]
                            }}
                          >
                            {g.status || 'active'}
                          </span>
                          <button
                            className="group flex items-center gap-2 px-3 py-2 text-sm font-light tracking-wider uppercase rounded-sm border transition-all duration-300"
                            style={{ 
                              borderColor: customStyles.navy[600],
                              color: customStyles.navy[600]
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = customStyles.navy[600];
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = customStyles.navy[600];
                            }}
                            onClick={() => setSelectedGuest(g)}
                          >
                            <FaEye />
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }

      case 'housekeeping': {
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-serif font-light text-gray-900 mb-2">
                  Housekeeping <span style={{ color: customStyles.navy[900] }}>Monitor</span>
                </h2>
                <p className="text-gray-600 font-light">
                  Manage cleaning requests and housekeeping operations
                </p>
              </div>
              <button 
                onClick={refreshData}
                className="group flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase"
                style={{ 
                  backgroundColor: customStyles.gold[600],
                  color: 'white'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
              >
                <FaSyncAlt className="animate-spin group-hover:animate-none" />
                Refresh
              </button>
            </div>

            <div className={cardClasses}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-light text-gray-900 mb-2">
                  Cleaning Requests <span className="text-sm font-normal" style={{ color: customStyles.gold[600] }}>({Array.isArray(housekeeping) ? housekeeping.length : 0})</span>
                </h3>
              </div>
              
              {loading ? (
                <div className="py-20 text-center">
                  <div className="mx-auto w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin" style={{ borderColor: customStyles.gold[600] }}></div>
                  <p className="mt-4 text-gray-600 font-light">Loading housekeeping requests...</p>
                </div>
              ) : !Array.isArray(housekeeping) || housekeeping.length === 0 ? (
                <div className="text-center py-12">
                  <FaBroom className="text-4xl mx-auto mb-4" style={{ color: customStyles.navy[300] }} />
                  <p className="text-gray-600 font-light">No housekeeping requests found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {housekeeping.map(h => (
                    <div 
                      key={h._id || Math.random()} 
                      className="group flex items-center justify-between p-5 rounded-sm border transition-all duration-300 hover:bg-white/70 hover:shadow-md"
                      style={{ borderColor: customStyles.navy[200] }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ 
                            backgroundColor: `${customStyles.gold[600]}20`,
                            color: customStyles.gold[700]
                          }}
                        >
                          <FaBroom className="text-xl" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-light mb-1" style={{ color: customStyles.navy[900] }}>
                            Room {h.roomNumber || 'N/A'}
                          </h4>
                          <p className="text-sm text-gray-600 font-light">Type: {h.serviceType || 'N/A'}</p>
                          <p className="text-sm text-gray-700 font-light mt-2">{h.description || 'No description'}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className={`text-xs font-light tracking-wider px-2 py-1 rounded-sm ${
                              h.priority === 'urgent'
                                ? 'bg-red-100 text-red-800'
                                : h.priority === 'high'
                                ? 'bg-orange-100 text-orange-800'
                                : h.priority === 'normal'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {h.priority || 'normal'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-light tracking-wider ${
                          h.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : h.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : h.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {h.status || 'pending'}
                        </span>
                        <select
                          className={smallSelectClasses}
                          value={h.status || 'pending'}
                          onChange={e => updateHousekeepingStatus(h._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }

      case 'feedback': {
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-serif font-light text-gray-900 mb-2">
                  Customer <span style={{ color: customStyles.navy[900] }}>Feedback</span>
                </h2>
                <p className="text-gray-600 font-light">
                  Guest reviews and feedback analysis
                </p>
              </div>
              <button 
                onClick={refreshData}
                className="group flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase"
                style={{ 
                  backgroundColor: customStyles.gold[600],
                  color: 'white'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
              >
                <FaSyncAlt className="animate-spin group-hover:animate-none" />
                Refresh
              </button>
            </div>

            <div className={cardClasses}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-light text-gray-900 mb-2">
                  All Reviews <span className="text-sm font-normal" style={{ color: customStyles.gold[600] }}>({Array.isArray(feedbacks) ? feedbacks.length : 0})</span>
                </h3>
              </div>
              
              {loading ? (
                <div className="py-20 text-center">
                  <div className="mx-auto w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin" style={{ borderColor: customStyles.gold[600] }}></div>
                  <p className="mt-4 text-gray-600 font-light">Loading feedback...</p>
                </div>
              ) : !Array.isArray(feedbacks) || feedbacks.length === 0 ? (
                <div className="text-center py-12">
                  <FaStar className="text-4xl mx-auto mb-4" style={{ color: customStyles.navy[300] }} />
                  <p className="text-gray-600 font-light">No reviews found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {feedbacks.map(r => (
                    <div 
                      key={r._id || Math.random()} 
                      className="rounded-sm border bg-white/50 backdrop-blur-sm p-6 hover:bg-white/70 transition-all duration-300"
                      style={{ borderColor: customStyles.navy[200] }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ 
                              backgroundColor: `${customStyles.navy[600]}20`,
                              color: customStyles.navy[700]
                            }}
                          >
                            <FaUserCircle className="text-lg" />
                          </div>
                          <div>
                            <h4 className="text-base font-light" style={{ color: customStyles.navy[900] }}>
                              Review #{r._id ? r._id.slice(-6) : 'N/A'}
                            </h4>
                            <p className="text-sm text-gray-600 font-light">User: {r.userId?.slice(-6) || 'Unknown'}</p>
                          </div>
                        </div>
                        <span className="text-xs font-light text-gray-600">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-800 font-light italic">
                          "{r.remarks || 'No remarks provided'}"
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${
                                i < (r.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 font-light">
                          <FaComments className="text-gray-500" />
                          <span>Feedback</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }

      default:
        return (
          <div className="text-center py-20">
            <p className="text-gray-600 font-light">Select a menu item</p>
          </div>
        );
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { id: 'bookings', label: 'Bookings', icon: <FaCalendarAlt /> },
    { id: 'revenue', label: 'Revenue', icon: <FaDollarSign /> },
    { id: 'guests', label: 'Guests', icon: <FaUsers /> },
    { id: 'housekeeping', label: 'Housekeeping', icon: <FaBroom /> },
    { id: 'feedback', label: 'Feedback', icon: <FaStar /> },
  ];

  return (
    <div 
      className="min-h-screen font-serif"
      style={{ 
        background: `linear-gradient(to bottom, ${customStyles.navy[50]}, white)`
      }}
    >
      {/* Header */}
      <div 
        className="relative overflow-hidden border-b"
        style={{ borderColor: customStyles.navy[200] }}
      >
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, ${customStyles.navy[900]}CC, ${customStyles.navy[800]}CC)`
            }}
          ></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-light text-white mb-2 tracking-tight">
                Hotel <span style={{ color: customStyles.gold[500] }}>Manager</span> Dashboard
              </h1>
              <p className="text-gray-300 font-light text-sm tracking-widest uppercase">Management System</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-full"
                  style={{ backgroundColor: `${customStyles.gold[600]}20` }}
                >
                  <FaUserCircle className="text-lg" style={{ color: customStyles.gold[600] }} />
                </div>
                <div className="text-right">
                  <p className="text-white font-light text-sm">
                    Welcome, <span className="font-normal" style={{ color: customStyles.gold[500] }}>{user?.fullName}</span>
                  </p>
                  <p className="text-xs text-gray-300 font-light tracking-wider uppercase">
                    Role: Manager
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="group px-4 py-2 text-white font-light text-sm rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase relative overflow-hidden border"
                style={{ 
                  borderColor: customStyles.gold[600],
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = customStyles.gold[600];
                  e.currentTarget.style.borderColor = customStyles.gold[600];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = customStyles.gold[600];
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <FaSignOutAlt />
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <FormStatus
          type={success ? 'success' : 'error'}
          message={success || error}
          onClose={() => {
            setSuccess('');
            setError('');
          }}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="rounded-sm border bg-white/80 backdrop-blur-sm shadow-sm">
              <div className="p-6 border-b" style={{ borderColor: customStyles.navy[200] }}>
                <h3 className="text-lg font-light text-gray-900 mb-4">Navigation</h3>
                <div className="space-y-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      className={`${tabBaseClasses} ${
                        activeTab === tab.id ? activeTabClasses : 'border-transparent text-gray-700 hover:text-gray-900'
                      }`}
                      style={
                        activeTab === tab.id
                          ? { 
                              backgroundColor: customStyles.gold[600],
                              borderLeftColor: customStyles.gold[600],
                              color: 'white'
                            }
                          : { borderColor: 'transparent' }
                      }
                      onMouseEnter={(e) => {
                        if (activeTab !== tab.id) {
                          e.currentTarget.style.color = customStyles.navy[900];
                          e.currentTarget.style.borderLeftColor = customStyles.navy[900];
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeTab !== tab.id) {
                          e.currentTarget.style.color = '#374151';
                          e.currentTarget.style.borderLeftColor = 'transparent';
                        }
                      }}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-center">
                  <button 
                    onClick={refreshData}
                    className="group flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase"
                    style={{ 
                      backgroundColor: customStyles.navy[900],
                      color: 'white'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.navy[800]}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.navy[900]}
                  >
                    <FaSyncAlt className="animate-spin group-hover:animate-none" />
                    Refresh All Data
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div 
        className="border-t py-6"
        style={{ 
          borderColor: customStyles.navy[200],
          backgroundColor: 'white'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 font-light text-sm">
              Hotel Management System © {new Date().getFullYear()}
            </p>
            <p className="text-gray-600 font-light text-sm">
              Manager Dashboard v1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;
