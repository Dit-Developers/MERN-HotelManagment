import React, { useState, useEffect } from 'react';

function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [housekeeping, setHousekeeping] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Filter states
  const [dateFilter, setDateFilter] = useState('today');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const API_URL = 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

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

  // Fetch all data on component mount
  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, []);

  // Fetch specific data on tab change
  useEffect(() => {
    if (token && activeTab !== 'dashboard') {
      fetchTabData(activeTab);
    }
  }, [activeTab]);

  // Fetch all data for dashboard
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch bookings
      const bookingsRes = await fetch(`${API_URL}/booking/all-bookings`, { headers });
      const bookingsData = await bookingsRes.json();
      setBookings(Array.isArray(bookingsData?.allBookings) ? bookingsData.allBookings : 
                  Array.isArray(bookingsData) ? bookingsData : []);
      
      // Fetch revenue data (payments)
      const revenueRes = await fetch(`${API_URL}/payment/get-all-payments`, { headers });
      const revenueData = await revenueRes.json();
      setRevenueData(Array.isArray(revenueData?.allPayments) ? revenueData.allPayments : 
                     Array.isArray(revenueData) ? revenueData : []);
      
      // Fetch service requests for housekeeping
      const housekeepingRes = await fetch(`${API_URL}/service-requests`, { headers });
      const housekeepingData = await housekeepingRes.json();
      const requests = Array.isArray(housekeepingData?.serviceRequests) ? 
                      housekeepingData.serviceRequests : 
                      Array.isArray(housekeepingData) ? housekeepingData : [];
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
  };

  // Fetch data for specific tab
  const fetchTabData = async (tab) => {
    setLoading(true);
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      switch(tab) {
        case 'bookings':
          const bookingsRes = await fetch(`${API_URL}/booking/all-bookings`, { headers });
          const bookingsData = await bookingsRes.json();
          setBookings(Array.isArray(bookingsData?.allBookings) ? bookingsData.allBookings : 
                     Array.isArray(bookingsData) ? bookingsData : []);
          break;
        
        case 'revenue':
          const revenueRes = await fetch(`${API_URL}/payment/get-all-payments`, { headers });
          const revenueData = await revenueRes.json();
          setRevenueData(Array.isArray(revenueData?.allPayments) ? revenueData.allPayments : 
                        Array.isArray(revenueData) ? revenueData : []);
          break;
        
        case 'housekeeping':
          const housekeepingRes = await fetch(`${API_URL}/service-requests`, { headers });
          const housekeepingData = await housekeepingRes.json();
          const requests = Array.isArray(housekeepingData?.serviceRequests) ? 
                          housekeepingData.serviceRequests : 
                          Array.isArray(housekeepingData) ? housekeepingData : [];
          const housekeepingRequests = requests.filter(req => 
            req.serviceType === 'housekeeping' || 
            req.serviceType === 'room_cleaning' ||
            (req.serviceType && req.serviceType.toLowerCase().includes('clean'))
          );
          setHousekeeping(housekeepingRequests);
          break;
        
        case 'feedback':
          const feedbackRes = await fetch(`${API_URL}/reviews/get-all-reviews`, { headers });
          const feedbackData = await feedbackRes.json();
          setFeedbacks(Array.isArray(feedbackData?.getReviews) ? feedbackData.getReviews : 
                      Array.isArray(feedbackData) ? feedbackData : []);
          break;
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

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

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // Render content based on active tab
  const renderContent = () => {
    if (loading && activeTab === 'dashboard') return <div style={styles.loading}>Loading dashboard...</div>;

    switch(activeTab) {
      case 'dashboard':
        const dashboardStats = calculateDashboardStats(); // Changed variable name
        return (
          <div style={styles.dashboard}>
            <h3>Manager Dashboard Overview</h3>
            <div style={styles.stats}>
              <div style={styles.statCard}>
                <h4>Total Bookings</h4>
                <p>{dashboardStats.totalBookings}</p>
              </div>
              <div style={styles.statCard}>
                <h4>Active Bookings</h4>
                <p>{dashboardStats.activeBookings}</p>
              </div>
              <div style={styles.statCard}>
                <h4>Total Revenue</h4>
                <p>${dashboardStats.totalRevenue}</p>
              </div>
              <div style={styles.statCard}>
                <h4>Pending Requests</h4>
                <p>{dashboardStats.pendingRequests}</p>
              </div>
            </div>

            <div style={styles.quickActions}>
              <h4>Quick Actions</h4>
              <div style={styles.actionGrid}>
                <button style={styles.actionBtn} onClick={() => setActiveTab('bookings')}>
                  📅 View Bookings
                </button>
                <button style={styles.actionBtn} onClick={() => setActiveTab('revenue')}>
                  💰 View Revenue
                </button>
                <button style={styles.actionBtn} onClick={() => setActiveTab('housekeeping')}>
                  🧹 Monitor Cleaning
                </button>
                <button style={styles.actionBtn} onClick={() => setActiveTab('feedback')}>
                  ⭐ View Feedback
                </button>
                <button style={styles.actionBtn} onClick={refreshData}>
                  🔄 Refresh Data
                </button>
              </div>
            </div>

            <div style={styles.recentActivity}>
              <h4>Recent Activity</h4>
              <div style={styles.activityList}>
                <div style={styles.activityItem}>
                  <strong>Latest Bookings</strong>
                  <p>
                    {(Array.isArray(bookings) && bookings.length > 0) ? 
                      bookings.slice(0, 3).map(b => `#${b._id?.slice(-6)}`).join(', ') : 
                      'No recent bookings'}
                  </p>
                </div>
                <div style={styles.activityItem}>
                  <strong>Recent Revenue</strong>
                  <p>
                    {(Array.isArray(revenueData) && revenueData.length > 0) ? 
                      `$${revenueData.slice(0, 3).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0).toFixed(2)} total` : 
                      'No recent payments'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'bookings':
        const filteredBookings = filterBookingsByStatus();
        return (
          <div>
            <div style={styles.headerRow}>
              <h3>Manage Bookings</h3>
              <div style={styles.filterSection}>
                <select 
                  style={styles.filterSelect} 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="checked-in">Checked-in</option>
                  <option value="checked-out">Checked-out</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button onClick={refreshData} style={styles.refreshBtn}>🔄 Refresh</button>
              </div>
            </div>

            <div style={styles.listContainer}>
              <h4>All Bookings ({filteredBookings.length})</h4>
              {loading ? <div style={styles.loading}>Loading bookings...</div> : 
               filteredBookings.length === 0 ? (
                <div style={styles.noData}>No bookings found</div>
              ) : (
                filteredBookings.map(b => (
                  <div key={b._id || Math.random()} style={styles.itemCard}>
                    <div style={styles.itemContent}>
                      <div>
                        <strong>Booking #{b._id ? b._id.slice(-6) : 'N/A'}</strong>
                        <p>Guest ID: {b.guestId || 'N/A'}</p>
                        <p>Room: {b.roomId || 'N/A'}</p>
                        <p>
                          {b.checkinDate ? new Date(b.checkinDate).toLocaleDateString() : 'N/A'} - 
                          {b.checkoutDate ? new Date(b.checkoutDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div style={styles.statusSection}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: 
                            b.bookingStatus === 'checked-in' ? '#4CAF50' :
                            b.bookingStatus === 'confirmed' ? '#2196F3' :
                            b.bookingStatus === 'pending' ? '#FF9800' :
                            b.bookingStatus === 'checked-out' ? '#9C27B0' : '#F44336'
                        }}>
                          {b.bookingStatus || 'unknown'}
                        </span>
                        <select 
                          style={styles.statusSelect} 
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
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'revenue':
        const filteredRevenue = filterRevenueByDate();
        const revenueStats = calculateRevenue(); // Changed variable name
        return (
          <div>
            <div style={styles.headerRow}>
              <h3>Revenue Reports</h3>
              <div style={styles.filterSection}>
                <select 
                  style={styles.filterSelect} 
                  value={dateFilter} 
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="all">All Time</option>
                </select>
                <button onClick={refreshData} style={styles.refreshBtn}>🔄 Refresh</button>
              </div>
            </div>

            <div style={styles.revenueStats}>
              <div style={styles.revenueCard}>
                <h4>Total Revenue</h4>
                <p style={styles.revenueAmount}>${revenueStats.total}</p>
              </div>
              <div style={styles.revenueCard}>
                <h4>Completed Transactions</h4>
                <p>{revenueStats.completed}</p>
              </div>
              <div style={styles.revenueCard}>
                <h4>Pending Transactions</h4>
                <p>{revenueStats.pending}</p>
              </div>
              <div style={styles.revenueCard}>
                <h4>Total Transactions</h4>
                <p>{revenueStats.totalTransactions}</p>
              </div>
            </div>

            <div style={styles.listContainer}>
              <h4>Payment Details ({filteredRevenue.length})</h4>
              {loading ? <div style={styles.loading}>Loading payments...</div> : 
               filteredRevenue.length === 0 ? (
                <div style={styles.noData}>No payment records found</div>
              ) : (
                <div>
                  <div style={styles.tableHeader}>
                    <span style={styles.tableCell}>ID</span>
                    <span style={styles.tableCell}>Amount</span>
                    <span style={styles.tableCell}>Method</span>
                    <span style={styles.tableCell}>Status</span>
                    <span style={styles.tableCell}>Date</span>
                  </div>
                  {filteredRevenue.map(p => (
                    <div key={p._id || Math.random()} style={styles.tableRow}>
                      <span style={styles.tableCell}>#{p._id ? p._id.slice(-6) : 'N/A'}</span>
                      <span style={styles.tableCell}>${parseFloat(p.amount || 0).toFixed(2)}</span>
                      <span style={styles.tableCell}>{p.paymentMethod || 'N/A'}</span>
                      <span style={{
                        ...styles.tableCell,
                        color: p.status === 'completed' ? '#4CAF50' : 
                               p.status === 'pending' ? '#FF9800' : '#F44336'
                      }}>
                        {p.status || 'unknown'}
                      </span>
                      <span style={styles.tableCell}>
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'housekeeping':
        return (
          <div>
            <div style={styles.headerRow}>
              <h3>Housekeeping Monitor</h3>
              <button onClick={refreshData} style={styles.refreshBtn}>🔄 Refresh</button>
            </div>

            <div style={styles.listContainer}>
              <h4>Cleaning Requests ({Array.isArray(housekeeping) ? housekeeping.length : 0})</h4>
              {loading ? <div style={styles.loading}>Loading housekeeping requests...</div> : 
               !Array.isArray(housekeeping) || housekeeping.length === 0 ? (
                <div style={styles.noData}>No housekeeping requests found</div>
              ) : (
                housekeeping.map(h => (
                  <div key={h._id || Math.random()} style={styles.itemCard}>
                    <div style={styles.itemContent}>
                      <div>
                        <strong>Room {h.roomNumber || 'N/A'}</strong>
                        <p>Type: {h.serviceType || 'N/A'}</p>
                        <p>{h.description || 'No description'}</p>
                        <p>Priority: <span style={{
                          color: h.priority === 'urgent' ? '#F44336' :
                                 h.priority === 'high' ? '#FF9800' :
                                 h.priority === 'normal' ? '#4CAF50' : '#2196F3'
                        }}>{h.priority || 'normal'}</span></p>
                      </div>
                      <div style={styles.statusSection}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: 
                            h.status === 'completed' ? '#4CAF50' :
                            h.status === 'in_progress' ? '#2196F3' :
                            h.status === 'pending' ? '#FF9800' : '#F44336'
                        }}>
                          {h.status || 'pending'}
                        </span>
                        <select 
                          style={styles.statusSelect} 
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
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'feedback':
        return (
          <div>
            <div style={styles.headerRow}>
              <h3>Customer Feedback</h3>
              <button onClick={refreshData} style={styles.refreshBtn}>🔄 Refresh</button>
            </div>

            <div style={styles.listContainer}>
              <h4>All Reviews ({Array.isArray(feedbacks) ? feedbacks.length : 0})</h4>
              {loading ? <div style={styles.loading}>Loading feedback...</div> : 
               !Array.isArray(feedbacks) || feedbacks.length === 0 ? (
                <div style={styles.noData}>No reviews found</div>
              ) : (
                feedbacks.map(r => (
                  <div key={r._id || Math.random()} style={styles.feedbackCard}>
                    <div style={styles.feedbackHeader}>
                      <strong>Review #{r._id ? r._id.slice(-6) : 'N/A'}</strong>
                      <span style={styles.date}>
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <p style={styles.feedbackText}>"{r.remarks || 'No remarks provided'}"</p>
                    <div style={styles.feedbackFooter}>
                      <span>User: {r.userId || 'Unknown'}</span>
                      <div style={styles.rating}>
                        {[...Array(5)].map((_, i) => (
                          <span key={i} style={{
                            color: i < (r.rating || 0) ? '#FFD700' : '#ccc',
                            fontSize: '20px'
                          }}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      default:
        return <div>Select a menu item</div>;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Hotel Manager Dashboard</h2>
        <div style={styles.userInfo}>
          <span>Welcome, {user?.fullName}!</span>
          <span style={styles.role}>Role: Manager</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}

      <div style={styles.layout}>
        <div style={styles.sidebar}>
          <button 
            style={activeTab === 'dashboard' ? styles.activeTab : styles.tab} 
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            style={activeTab === 'bookings' ? styles.activeTab : styles.tab} 
            onClick={() => setActiveTab('bookings')}
          >
            📅 Bookings
          </button>
          <button 
            style={activeTab === 'revenue' ? styles.activeTab : styles.tab} 
            onClick={() => setActiveTab('revenue')}
          >
            💰 Revenue Reports
          </button>
          <button 
            style={activeTab === 'housekeeping' ? styles.activeTab : styles.tab} 
            onClick={() => setActiveTab('housekeeping')}
          >
            🧹 Housekeeping
          </button>
          <button 
            style={activeTab === 'feedback' ? styles.activeTab : styles.tab} 
            onClick={() => setActiveTab('feedback')}
          >
            ⭐ Customer Feedback
          </button>
        </div>

        <div style={styles.content}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap'
  },
  role: {
    backgroundColor: '#3498db',
    padding: '5px 10px',
    borderRadius: '4px',
    fontSize: '14px'
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  errorMessage: {
    backgroundColor: '#ffeaea',
    color: '#d32f2f',
    padding: '12px 20px',
    margin: '0 20px 20px',
    borderRadius: '4px',
    borderLeft: '4px solid #d32f2f'
  },
  successMessage: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '12px 20px',
    margin: '0 20px 20px',
    borderRadius: '4px',
    borderLeft: '4px solid #2e7d32'
  },
  layout: {
    display: 'flex',
    minHeight: 'calc(100vh - 80px)'
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#34495e',
    padding: '20px 0'
  },
  tab: {
    display: 'block',
    width: '100%',
    padding: '15px 20px',
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    textAlign: 'left',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    borderLeft: '4px solid transparent'
  },
  activeTab: {
    display: 'block',
    width: '100%',
    padding: '15px 20px',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    textAlign: 'left',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    borderLeft: '4px solid #3498db'
  },
  content: {
    flex: '1',
    padding: '30px',
    overflowY: 'auto'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666'
  },
  dashboard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #dee2e6',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  quickActions: {
    marginTop: '30px'
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginTop: '15px'
  },
  actionBtn: {
    padding: '15px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  },
  recentActivity: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  activityList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '10px'
  },
  activityItem: {
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '6px',
    border: '1px solid #dee2e6'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  filterSection: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  filterSelect: {
    padding: '8px 15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  refreshBtn: {
    padding: '8px 15px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  listContainer: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  noData: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
    fontSize: '16px'
  },
  itemCard: {
    padding: '15px',
    border: '1px solid #eee',
    borderRadius: '6px',
    marginBottom: '10px',
    backgroundColor: '#fafafa'
  },
  itemContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px'
  },
  statusSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    minWidth: '150px'
  },
  statusBadge: {
    padding: '5px 10px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  statusSelect: {
    padding: '5px 10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    minWidth: '120px'
  },
  revenueStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  revenueCard: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #dee2e6'
  },
  revenueAmount: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2e7d32'
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    marginBottom: '10px',
    fontWeight: 'bold'
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
    padding: '10px',
    borderBottom: '1px solid #eee'
  },
  tableCell: {
    padding: '5px'
  },
  feedbackCard: {
    padding: '20px',
    border: '1px solid #eee',
    borderRadius: '8px',
    marginBottom: '15px',
    backgroundColor: '#fff'
  },
  feedbackHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    flexWrap: 'wrap',
    gap: '10px'
  },
  feedbackText: {
    fontSize: '16px',
    color: '#333',
    margin: '10px 0'
  },
  feedbackFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '15px',
    fontSize: '14px',
    color: '#666',
    flexWrap: 'wrap',
    gap: '10px'
  },
  date: {
    fontSize: '14px',
    color: '#999'
  },
  rating: {
    display: 'flex',
    gap: '5px'
  }
};

export default ManagerDashboard;