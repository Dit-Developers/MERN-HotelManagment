import React, { useState, useEffect } from 'react';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [newUser, setNewUser] = useState({ 
    fullName: '', 
    username: '', 
    email: '', 
    password: '', 
    phone: '', 
    role: 'guest', 
    status: 'active' 
  });
  const [newRoom, setNewRoom] = useState({ 
    roomNumber: '', 
    roomType: '', 
    floor: '', 
    bedCount: 1, 
    hasAC: false, 
    hasWIFI: false, 
    hasTV: '', 
    pricePerNight: '', 
    isAvailable: true, 
    roomStatus: 'available' 
  });
  const [newBooking, setNewBooking] = useState({ 
    guestId: '', 
    roomId: '', 
    bookingDate: '', 
    checkinDate: '', 
    checkoutDate: '', 
    bookingStatus: 'pending' 
  });
  const [newPayment, setNewPayment] = useState({ 
    userId: '', 
    bookingId: '', 
    roomId: '', 
    amount: 0, 
    paymentMethod: 'cash', 
    status: 'pending' 
  });
  const [newReview, setNewReview] = useState({ 
    userId: '', 
    remarks: '' 
  });
  const [newServiceRequest, setNewServiceRequest] = useState({ 
    userId: '', 
    roomNumber: '', 
    serviceType: 'housekeeping', 
    description: '', 
    priority: 'normal', 
    status: 'pending' 
  });
  
  // Edit states
  const [editingUser, setEditingUser] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [editingServiceRequest, setEditingServiceRequest] = useState(null);
  
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

      // Fetch users
      const usersRes = await fetch(`${API_URL}/get-all-users`, { headers });
      const usersData = await usersRes.json();
      setUsers(Array.isArray(usersData?.allUsers) ? usersData.allUsers : 
              Array.isArray(usersData) ? usersData : []);
      
      // Fetch rooms
      const roomsRes = await fetch(`${API_URL}/room/all-rooms`, { headers });
      const roomsData = await roomsRes.json();
      setRooms(Array.isArray(roomsData) ? roomsData : []);
      
      // Fetch bookings
      const bookingsRes = await fetch(`${API_URL}/booking/all-bookings`, { headers });
      const bookingsData = await bookingsRes.json();
      setBookings(Array.isArray(bookingsData?.allBookings) ? bookingsData.allBookings :
                 Array.isArray(bookingsData) ? bookingsData : []);
      
      // Fetch payments
      const paymentsRes = await fetch(`${API_URL}/payment/get-all-payments`, { headers });
      const paymentsData = await paymentsRes.json();
      setPayments(Array.isArray(paymentsData?.allPayments) ? paymentsData.allPayments :
                 Array.isArray(paymentsData) ? paymentsData : []);
      
      // Fetch reviews
      const reviewsRes = await fetch(`${API_URL}/reviews/get-all-reviews`, { headers });
      const reviewsData = await reviewsRes.json();
      setReviews(Array.isArray(reviewsData?.getReviews) ? reviewsData.getReviews :
                Array.isArray(reviewsData) ? reviewsData : []);
      
      // Fetch service requests
      const servicesRes = await fetch(`${API_URL}/service-requests`, { headers });
      const servicesData = await servicesRes.json();
      setServiceRequests(Array.isArray(servicesData?.serviceRequests) ? servicesData.serviceRequests :
                        Array.isArray(servicesData) ? servicesData : []);

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
        case 'users':
          const usersRes = await fetch(`${API_URL}/get-all-users`, { headers });
          const usersData = await usersRes.json();
          setUsers(Array.isArray(usersData?.allUsers) ? usersData.allUsers : 
                  Array.isArray(usersData) ? usersData : []);
          break;
        
        case 'rooms':
          const roomsRes = await fetch(`${API_URL}/room/all-rooms`, { headers });
          const roomsData = await roomsRes.json();
          setRooms(Array.isArray(roomsData) ? roomsData : []);
          break;
        
        case 'bookings':
          const bookingsRes = await fetch(`${API_URL}/booking/all-bookings`, { headers });
          const bookingsData = await bookingsRes.json();
          setBookings(Array.isArray(bookingsData?.allBookings) ? bookingsData.allBookings :
                     Array.isArray(bookingsData) ? bookingsData : []);
          break;
        
        case 'payments':
          const paymentsRes = await fetch(`${API_URL}/payment/get-all-payments`, { headers });
          const paymentsData = await paymentsRes.json();
          setPayments(Array.isArray(paymentsData?.allPayments) ? paymentsData.allPayments :
                     Array.isArray(paymentsData) ? paymentsData : []);
          break;
        
        case 'reviews':
          const reviewsRes = await fetch(`${API_URL}/reviews/get-all-reviews`, { headers });
          const reviewsData = await reviewsRes.json();
          setReviews(Array.isArray(reviewsData?.getReviews) ? reviewsData.getReviews :
                    Array.isArray(reviewsData) ? reviewsData : []);
          break;
        
        case 'services':
          const servicesRes = await fetch(`${API_URL}/service-requests`, { headers });
          const servicesData = await servicesRes.json();
          setServiceRequests(Array.isArray(servicesData?.serviceRequests) ? servicesData.serviceRequests :
                           Array.isArray(servicesData) ? servicesData : []);
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
      refreshData(); // Refresh all data after successful operation
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Calculate dashboard statistics - SAFE VERSION
  const calculateDashboardStats = () => {
    // Ensure all variables are arrays
    const paymentsArray = Array.isArray(payments) ? payments : [];
    const bookingsArray = Array.isArray(bookings) ? bookings : [];
    const roomsArray = Array.isArray(rooms) ? rooms : [];
    const serviceRequestsArray = Array.isArray(serviceRequests) ? serviceRequests : [];
    const usersArray = Array.isArray(users) ? users : [];
    const reviewsArray = Array.isArray(reviews) ? reviews : [];

    const totalRevenue = paymentsArray.reduce((sum, p) => {
      const amount = parseFloat(p.amount) || 0;
      return sum + amount;
    }, 0);
    
    const activeBookings = bookingsArray.filter(b => 
      b.bookingStatus === 'confirmed' || 
      b.bookingStatus === 'checked-in' || 
      b.bookingStatus === 'pending'
    ).length;
    
    const pendingPayments = paymentsArray.filter(p => p.status === 'pending').length;
    const pendingServiceRequests = serviceRequestsArray.filter(sr => sr.status === 'pending').length;
    
    const availableRooms = roomsArray.filter(r => 
      r.roomStatus === 'available' && r.isAvailable === true
    ).length;

    return {
      totalUsers: usersArray.length,
      totalRooms: roomsArray.length,
      activeBookings,
      totalRevenue,
      pendingPayments,
      pendingServiceRequests,
      availableRooms,
      totalReviews: reviewsArray.length
    };
  };

  // CRUD for Users
  const createUser = async (e) => {
    e.preventDefault();
    await apiCall('POST', '/register', newUser);
    setNewUser({ fullName: '', username: '', email: '', password: '', phone: '', role: 'guest', status: 'active' });
  };

  const updateUser = async (e) => {
    e.preventDefault();
    await apiCall('PUT', `/update/${editingUser._id}`, editingUser);
    setEditingUser(null);
  };

  const deleteUser = async (id) => {
    if (window.confirm('Delete this user?')) {
      await apiCall('DELETE', `/delete-user/${id}`);
    }
  };

  // CRUD for Rooms
  const createRoom = async (e) => {
    e.preventDefault();
    await apiCall('POST', '/room/create-room', newRoom);
    setNewRoom({ roomNumber: '', roomType: '', floor: '', bedCount: 1, hasAC: false, hasWIFI: false, hasTV: '', pricePerNight: '', isAvailable: true, roomStatus: 'available' });
  };

  const updateRoom = async (e) => {
    e.preventDefault();
    await apiCall('PUT', `/room/update-room/${editingRoom._id}`, editingRoom);
    setEditingRoom(null);
  };

  const deleteRoom = async (id) => {
    if (window.confirm('Delete this room?')) {
      await apiCall('DELETE', `/room/delete-room/${id}`);
    }
  };

  // CRUD for Bookings
  const createBooking = async (e) => {
    e.preventDefault();
    await apiCall('POST', '/booking/create-booking', newBooking);
    setNewBooking({ guestId: '', roomId: '', bookingDate: '', checkinDate: '', checkoutDate: '', bookingStatus: 'pending' });
  };

  const updateBookingStatus = async (id, status) => {
    await apiCall('PUT', `/booking/update-booking-status/${id}`, { bookingStatus: status });
  };

  // CRUD for Payments
  const createPayment = async (e) => {
    e.preventDefault();
    await apiCall('POST', '/payment/process-payment', newPayment);
    setNewPayment({ userId: '', bookingId: '', roomId: '', amount: 0, paymentMethod: 'cash', status: 'pending' });
  };

  const updatePaymentStatus = async (id, status) => {
    await apiCall('PUT', `/payment/update-payment-status/${id}`, { status });
  };

  // CRUD for Reviews
  const createReview = async (e) => {
    e.preventDefault();
    await apiCall('POST', '/reviews/create-review', newReview);
    setNewReview({ userId: '', remarks: '' });
  };

  const deleteReview = async (id) => {
    if (window.confirm('Delete this review?')) {
      await apiCall('DELETE', '/reviews/delete-review', { reviewId: id });
    }
  };

  // CRUD for Service Requests
  const createServiceRequest = async (e) => {
    e.preventDefault();
    await apiCall('POST', '/service-requests/create', newServiceRequest);
    setNewServiceRequest({ userId: '', roomNumber: '', serviceType: 'housekeeping', description: '', priority: 'normal', status: 'pending' });
  };

  const updateServiceStatus = async (id, status) => {
    await apiCall('PUT', `/service-requests/${id}/status`, { status });
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
        const stats = calculateDashboardStats();
        
        return (
          <div style={styles.dashboard}>
            <h3>Hotel Admin Dashboard</h3>
            <p>Welcome back, <strong>{user.fullName}</strong>!</p>
            
            <div style={styles.stats}>
              <div style={styles.statCard}>
                <h4>Total Users</h4>
                <p>{stats.totalUsers}</p>
              </div>
              <div style={styles.statCard}>
                <h4>Total Rooms</h4>
                <p>{stats.totalRooms}</p>
                <small>Available: {stats.availableRooms}</small>
              </div>
              <div style={styles.statCard}>
                <h4>Active Bookings</h4>
                <p>{stats.activeBookings}</p>
                <small>Total: {bookings.length || 0}</small>
              </div>
              <div style={styles.statCard}>
                <h4>Total Revenue</h4>
                <p>${stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>

            <div style={styles.stats}>
              <div style={styles.statCard}>
                <h4>Pending Payments</h4>
                <p>{stats.pendingPayments}</p>
              </div>
              <div style={styles.statCard}>
                <h4>Service Requests</h4>
                <p>{stats.pendingServiceRequests} pending</p>
                <small>Total: {serviceRequests.length || 0}</small>
              </div>
              <div style={styles.statCard}>
                <h4>Reviews</h4>
                <p>{stats.totalReviews}</p>
              </div>
              <div style={styles.statCard}>
                <h4>Quick Actions</h4>
                <div style={styles.quickActions}>
                  <button onClick={refreshData} style={styles.actionBtn}>🔄 Refresh Data</button>
                  <button onClick={() => setActiveTab('rooms')} style={styles.actionBtn}>🏨 Manage Rooms</button>
                </div>
              </div>
            </div>

            <div style={styles.recentActivity}>
              <h4>Recent Activity</h4>
              <div style={styles.activityList}>
                <div style={styles.activityItem}>
                  <strong>Latest Bookings</strong>
                  <p>{(Array.isArray(bookings) ? bookings.slice(0, 3).map(b => `#${b._id?.slice(-6)}`).join(', ') : 'No recent bookings') || 'No recent bookings'}</p>
                </div>
                <div style={styles.activityItem}>
                  <strong>Recent Payments</strong>
                  <p>{(Array.isArray(payments) ? payments.slice(0, 3).map(p => `$${p.amount}`).join(', ') : 'No recent payments') || 'No recent payments'}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div>
            <h3>Manage Users</h3>
            <button onClick={refreshData} style={styles.refreshBtn}>🔄 Refresh</button>
            
            {editingUser ? (
              <form onSubmit={updateUser} style={styles.form}>
                <h4>Edit User</h4>
                <input style={styles.input} placeholder="Full Name" value={editingUser.fullName} onChange={e => setEditingUser({...editingUser, fullName: e.target.value})} required />
                <input style={styles.input} placeholder="Username" value={editingUser.username} onChange={e => setEditingUser({...editingUser, username: e.target.value})} required />
                <input style={styles.input} type="email" placeholder="Email" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} required />
                <input style={styles.input} placeholder="Phone" value={editingUser.phone} onChange={e => setEditingUser({...editingUser, phone: e.target.value})} />
                <select style={styles.input} value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value})}>
                  <option value="guest">Guest</option>
                  <option value="admin">Admin</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                </select>
                <select style={styles.input} value={editingUser.status} onChange={e => setEditingUser({...editingUser, status: e.target.value})}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
                <div style={styles.formButtons}>
                  <button type="submit" style={styles.submitBtn}>Update</button>
                  <button type="button" style={styles.cancelBtn} onClick={() => setEditingUser(null)}>Cancel</button>
                </div>
              </form>
            ) : (
              <form onSubmit={createUser} style={styles.form}>
                <h4>Create New User</h4>
                <input style={styles.input} placeholder="Full Name" value={newUser.fullName} onChange={e => setNewUser({...newUser, fullName: e.target.value})} required />
                <input style={styles.input} placeholder="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} required />
                <input style={styles.input} type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required />
                <input style={styles.input} type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required />
                <input style={styles.input} placeholder="Phone" value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} />
                <select style={styles.input} value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                  <option value="guest">Guest</option>
                  <option value="admin">Admin</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                </select>
                <button type="submit" style={styles.submitBtn}>Create User</button>
              </form>
            )}

            <div style={styles.listContainer}>
              <h4>All Users ({Array.isArray(users) ? users.length : 0})</h4>
              {loading ? <div style={styles.loading}>Loading users...</div> : 
               !Array.isArray(users) || users.length === 0 ? 
               <div style={styles.noData}>No users found</div> : 
               users.map(u => (
                <div key={u._id} style={styles.itemCard}>
                  <div>
                    <strong>{u.fullName}</strong>
                    <p>{u.email}</p>
                    <p>Role: {u.role} | Status: {u.status}</p>
                    <small>ID: {u._id}</small>
                  </div>
                  <div style={styles.actionButtons}>
                    <button style={styles.editBtn} onClick={() => setEditingUser({...u})}>Edit</button>
                    <select style={styles.statusSelect} value={u.status} onChange={e => apiCall('PUT', `/update-status/${u._id}`, { status: e.target.value })}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                    <button style={styles.deleteBtn} onClick={() => deleteUser(u._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'rooms':
        return (
          <div>
            <h3>Manage Rooms</h3>
            <button onClick={refreshData} style={styles.refreshBtn}>🔄 Refresh</button>
            
            {editingRoom ? (
              <form onSubmit={updateRoom} style={styles.form}>
                <h4>Edit Room</h4>
                <input style={styles.input} placeholder="Room Number" value={editingRoom.roomNumber} onChange={e => setEditingRoom({...editingRoom, roomNumber: e.target.value})} required />
                <input style={styles.input} placeholder="Room Type" value={editingRoom.roomType} onChange={e => setEditingRoom({...editingRoom, roomType: e.target.value})} required />
                <input style={styles.input} placeholder="Price per Night" value={editingRoom.pricePerNight} onChange={e => setEditingRoom({...editingRoom, pricePerNight: e.target.value})} required />
                <select style={styles.input} value={editingRoom.roomStatus} onChange={e => setEditingRoom({...editingRoom, roomStatus: e.target.value})}>
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="under maintenance">Under Maintenance</option>
                  <option value="cleaning">Cleaning</option>
                </select>
                <div style={styles.formButtons}>
                  <button type="submit" style={styles.submitBtn}>Update</button>
                  <button type="button" style={styles.cancelBtn} onClick={() => setEditingRoom(null)}>Cancel</button>
                </div>
              </form>
            ) : (
              <form onSubmit={createRoom} style={styles.form}>
                <h4>Create New Room</h4>
                <input style={styles.input} placeholder="Room Number" value={newRoom.roomNumber} onChange={e => setNewRoom({...newRoom, roomNumber: e.target.value})} required />
                <input style={styles.input} placeholder="Room Type" value={newRoom.roomType} onChange={e => setNewRoom({...newRoom, roomType: e.target.value})} required />
                <input style={styles.input} placeholder="Price per Night" value={newRoom.pricePerNight} onChange={e => setNewRoom({...newRoom, pricePerNight: e.target.value})} required />
                <select style={styles.input} value={newRoom.roomStatus} onChange={e => setNewRoom({...newRoom, roomStatus: e.target.value})}>
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="under maintenance">Under Maintenance</option>
                  <option value="cleaning">Cleaning</option>
                </select>
                <button type="submit" style={styles.submitBtn}>Create Room</button>
              </form>
            )}

            <div style={styles.listContainer}>
              <h4>All Rooms ({Array.isArray(rooms) ? rooms.length : 0})</h4>
              {loading ? <div style={styles.loading}>Loading rooms...</div> : 
               !Array.isArray(rooms) || rooms.length === 0 ? 
               <div style={styles.noData}>No rooms found</div> : 
               rooms.map(r => (
                <div key={r._id} style={styles.itemCard}>
                  <div>
                    <strong>Room {r.roomNumber}</strong>
                    <p>Type: {r.roomType}</p>
                    <p>Price: ${r.pricePerNight}/night</p>
                    <p>Status: {r.roomStatus}</p>
                  </div>
                  <div style={styles.actionButtons}>
                    <button style={styles.editBtn} onClick={() => setEditingRoom({...r})}>Edit</button>
                    <select style={styles.statusSelect} value={r.roomStatus} onChange={e => apiCall('PUT', `/room/update-room-status/${r._id}`, { status: e.target.value })}>
                      <option value="available">Available</option>
                      <option value="booked">Booked</option>
                      <option value="under maintenance">Under Maintenance</option>
                      <option value="cleaning">Cleaning</option>
                    </select>
                    <button style={styles.deleteBtn} onClick={() => deleteRoom(r._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'bookings':
        return (
          <div>
            <h3>Manage Bookings</h3>
            <button onClick={refreshData} style={styles.refreshBtn}>🔄 Refresh</button>
            
            <form onSubmit={createBooking} style={styles.form}>
              <h4>Create New Booking</h4>
              <input style={styles.input} placeholder="Guest ID" value={newBooking.guestId} onChange={e => setNewBooking({...newBooking, guestId: e.target.value})} required />
              <input style={styles.input} placeholder="Room ID" value={newBooking.roomId} onChange={e => setNewBooking({...newBooking, roomId: e.target.value})} required />
              <input style={styles.input} type="date" placeholder="Check-in Date" value={newBooking.checkinDate} onChange={e => setNewBooking({...newBooking, checkinDate: e.target.value})} required />
              <input style={styles.input} type="date" placeholder="Check-out Date" value={newBooking.checkoutDate} onChange={e => setNewBooking({...newBooking, checkoutDate: e.target.value})} required />
              <select style={styles.input} value={newBooking.bookingStatus} onChange={e => setNewBooking({...newBooking, bookingStatus: e.target.value})}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked-in">Checked-in</option>
                <option value="checked-out">Checked-out</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button type="submit" style={styles.submitBtn}>Create Booking</button>
            </form>

            <div style={styles.listContainer}>
              <h4>All Bookings ({Array.isArray(bookings) ? bookings.length : 0})</h4>
              {loading ? <div style={styles.loading}>Loading bookings...</div> : 
               !Array.isArray(bookings) || bookings.length === 0 ? 
               <div style={styles.noData}>No bookings found</div> : 
               bookings.map(b => (
                <div key={b._id} style={styles.itemCard}>
                  <div>
                    <strong>Booking #{b._id?.slice(-6)}</strong>
                    <p>Guest: {b.guestId}</p>
                    <p>Room: {b.roomId}</p>
                    <p>Check-in: {new Date(b.checkinDate).toLocaleDateString()}</p>
                    <p>Check-out: {new Date(b.checkoutDate).toLocaleDateString()}</p>
                    <p>Status: {b.bookingStatus}</p>
                  </div>
                  <div>
                    <select style={styles.statusSelect} value={b.bookingStatus} onChange={e => updateBookingStatus(b._id, e.target.value)}>
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
          </div>
        );

      case 'payments':
        return (
          <div>
            <h3>Manage Payments</h3>
            <button onClick={refreshData} style={styles.refreshBtn}>🔄 Refresh</button>
            
            <form onSubmit={createPayment} style={styles.form}>
              <h4>Create New Payment</h4>
              <input style={styles.input} placeholder="User ID" value={newPayment.userId} onChange={e => setNewPayment({...newPayment, userId: e.target.value})} required />
              <input style={styles.input} placeholder="Booking ID" value={newPayment.bookingId} onChange={e => setNewPayment({...newPayment, bookingId: e.target.value})} required />
              <input style={styles.input} type="number" placeholder="Amount" value={newPayment.amount} onChange={e => setNewPayment({...newPayment, amount: e.target.value})} required />
              <select style={styles.input} value={newPayment.paymentMethod} onChange={e => setNewPayment({...newPayment, paymentMethod: e.target.value})}>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="cheque">Cheque</option>
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="online">Online</option>
              </select>
              <select style={styles.input} value={newPayment.status} onChange={e => setNewPayment({...newPayment, status: e.target.value})}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
              <button type="submit" style={styles.submitBtn}>Create Payment</button>
            </form>

            <div style={styles.listContainer}>
              <h4>All Payments ({Array.isArray(payments) ? payments.length : 0})</h4>
              {loading ? <div style={styles.loading}>Loading payments...</div> : 
               !Array.isArray(payments) || payments.length === 0 ? 
               <div style={styles.noData}>No payments found</div> : 
               payments.map(p => (
                <div key={p._id} style={styles.itemCard}>
                  <div>
                    <strong>Payment #{p._id?.slice(-6)}</strong>
                    <p>Amount: ${p.amount}</p>
                    <p>Method: {p.paymentMethod}</p>
                    <p>Status: {p.status}</p>
                    <p>User: {p.userId}</p>
                    <p>Booking: {p.bookingId}</p>
                  </div>
                  <div>
                    <select style={styles.statusSelect} value={p.status} onChange={e => updatePaymentStatus(p._id, e.target.value)}>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div>
            <h3>Manage Reviews</h3>
            <button onClick={refreshData} style={styles.refreshBtn}>🔄 Refresh</button>
            
            <form onSubmit={createReview} style={styles.form}>
              <h4>Create New Review</h4>
              <input style={styles.input} placeholder="User ID" value={newReview.userId} onChange={e => setNewReview({...newReview, userId: e.target.value})} required />
              <textarea style={styles.textarea} placeholder="Remarks" value={newReview.remarks} onChange={e => setNewReview({...newReview, remarks: e.target.value})} required />
              <button type="submit" style={styles.submitBtn}>Create Review</button>
            </form>

            <div style={styles.listContainer}>
              <h4>All Reviews ({Array.isArray(reviews) ? reviews.length : 0})</h4>
              {loading ? <div style={styles.loading}>Loading reviews...</div> : 
               !Array.isArray(reviews) || reviews.length === 0 ? 
               <div style={styles.noData}>No reviews found</div> : 
               reviews.map(r => (
                <div key={r._id} style={styles.itemCard}>
                  <div>
                    <strong>Review #{r._id?.slice(-6)}</strong>
                    <p>User: {r.userId}</p>
                    <p>{r.remarks}</p>
                    <small>Date: {new Date(r.createdAt).toLocaleDateString()}</small>
                  </div>
                  <div>
                    <button style={styles.deleteBtn} onClick={() => deleteReview(r._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'services':
        return (
          <div>
            <h3>Manage Service Requests</h3>
            <button onClick={refreshData} style={styles.refreshBtn}>🔄 Refresh</button>
            
            <form onSubmit={createServiceRequest} style={styles.form}>
              <h4>Create New Service Request</h4>
              <input style={styles.input} placeholder="User ID" value={newServiceRequest.userId} onChange={e => setNewServiceRequest({...newServiceRequest, userId: e.target.value})} required />
              <input style={styles.input} placeholder="Room Number" value={newServiceRequest.roomNumber} onChange={e => setNewServiceRequest({...newServiceRequest, roomNumber: e.target.value})} required />
              <select style={styles.input} value={newServiceRequest.serviceType} onChange={e => setNewServiceRequest({...newServiceRequest, serviceType: e.target.value})}>
                <option value="housekeeping">Housekeeping</option>
                <option value="room_service">Room Service</option>
                <option value="laundry">Laundry</option>
                <option value="maintenance">Maintenance</option>
                <option value="room_cleaning">Room Cleaning</option>
                <option value="food_service">Food Service</option>
              </select>
              <textarea style={styles.textarea} placeholder="Description" value={newServiceRequest.description} onChange={e => setNewServiceRequest({...newServiceRequest, description: e.target.value})} required />
              <select style={styles.input} value={newServiceRequest.priority} onChange={e => setNewServiceRequest({...newServiceRequest, priority: e.target.value})}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <button type="submit" style={styles.submitBtn}>Create Request</button>
            </form>

            <div style={styles.listContainer}>
              <h4>All Service Requests ({Array.isArray(serviceRequests) ? serviceRequests.length : 0})</h4>
              {loading ? <div style={styles.loading}>Loading service requests...</div> : 
               !Array.isArray(serviceRequests) || serviceRequests.length === 0 ? 
               <div style={styles.noData}>No service requests found</div> : 
               serviceRequests.map(sr => (
                <div key={sr._id} style={styles.itemCard}>
                  <div>
                    <strong>{sr.serviceType}</strong>
                    <p>Room: {sr.roomNumber}</p>
                    <p>{sr.description}</p>
                    <p>Priority: {sr.priority}</p>
                    <p>Status: {sr.status}</p>
                  </div>
                  <div>
                    <select style={styles.statusSelect} value={sr.status} onChange={e => updateServiceStatus(sr._id, e.target.value)}>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
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
        <h2>Hotel Admin Dashboard</h2>
        <div style={styles.userInfo}>
          <span>Welcome, {user?.fullName}!</span>
          <span style={styles.role}>Role: {user?.role}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}

      <div style={styles.layout}>
        <div style={styles.sidebar}>
          <button style={activeTab === 'dashboard' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
          <button style={activeTab === 'users' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('users')}>👥 Users</button>
          <button style={activeTab === 'rooms' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('rooms')}>🏨 Rooms</button>
          <button style={activeTab === 'bookings' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('bookings')}>📅 Bookings</button>
          <button style={activeTab === 'payments' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('payments')}>💰 Payments</button>
          <button style={activeTab === 'reviews' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('reviews')}>⭐ Reviews</button>
          <button style={activeTab === 'services' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('services')}>🛎️ Services</button>
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
    border: '1px solid #dee2e6'
  },
  quickActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '10px'
  },
  actionBtn: {
    padding: '8px 12px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
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
  refreshBtn: {
    padding: '8px 15px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '20px'
  },
  form: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box'
  },
  textarea: {
    display: 'block',
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box',
    minHeight: '100px',
    fontFamily: 'Arial, sans-serif',
    resize: 'vertical'
  },
  formButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px'
  },
  submitBtn: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px'
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px'
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    border: '1px solid #eee',
    borderRadius: '6px',
    marginBottom: '10px',
    backgroundColor: '#fafafa'
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  editBtn: {
    padding: '6px 12px',
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  deleteBtn: {
    padding: '6px 12px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  statusSelect: {
    padding: '6px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: 'white'
  }
};

export default AdminDashboard;