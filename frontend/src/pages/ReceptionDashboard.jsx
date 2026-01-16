import React, { useState, useEffect } from 'react';

function ReceptionDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('createGuest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Guest Form State
  const [guestForm, setGuestForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    idType: 'passport',
    idNumber: '',
    username: '',
    password: 'guest123' // Default password
  });
  
  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    guestId: '',
    roomId: '',
    checkinDate: '',
    checkoutDate: '',
    guestsCount: 1
  });
  
  // Check-in Form State
  const [checkinForm, setCheckinForm] = useState({
    bookingId: '',
    roomId: ''
  });
  
  // Check-out Form State
  const [checkoutForm, setCheckoutForm] = useState({
    bookingId: '',
    extraCharges: 0
  });
  
  // Bill Form State
  const [billForm, setBillForm] = useState({
    bookingId: '',
    roomCharges: 0,
    serviceCharges: 0,
    tax: 0,
    discount: 0
  });
  
  // Data States
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  
  const API_URL = 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  // Load user data on component mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    fetchAllData();
  }, []);
  
  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchGuests(),
        fetchRooms(),
        fetchBookings()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
  
 // Fetch guests - Enhanced with better debugging
const fetchGuests = async () => {
  try {
    if (!token) {
      console.log("No token found");
      return;
    }

    console.log("Fetching guests from:", `${API_URL}/get-all-users`);
    
    const response = await fetch(`${API_URL}/get-all-users`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log("Response status:", response.status);
    
    const data = await response.json();
    console.log("Raw API response for guests:", data);
    
    // Debug: Log the structure of the response
    console.log("Response keys:", Object.keys(data));
    
    // Try different possible data structures
    let allUsers = [];
    
    if (Array.isArray(data)) {
      // Case 1: API returns array directly
      allUsers = data;
      console.log("Data is direct array");
    } else if (Array.isArray(data?.allUsers)) {
      // Case 2: API returns {allUsers: [...]}
      allUsers = data.allUsers;
      console.log("Data found in allUsers property");
    } else if (Array.isArray(data?.users)) {
      // Case 3: API returns {users: [...]}
      allUsers = data.users;
      console.log("Data found in users property");
    } else if (data?.allUsers && typeof data.allUsers === 'object') {
      // Case 4: API returns {allUsers: {data: [...]}}
      if (Array.isArray(data.allUsers.data)) {
        allUsers = data.allUsers.data;
        console.log("Data found in allUsers.data property");
      }
    } else if (data?.data && Array.isArray(data.data)) {
      // Case 5: API returns {data: [...]}
      allUsers = data.data;
      console.log("Data found in data property");
    }
    
    console.log("Parsed allUsers:", allUsers);
    
    // Filter guests only - more flexible filtering
    const guestsOnly = allUsers.filter(user => {
      const userRole = user?.role?.toLowerCase();
      return userRole === 'guest' || !userRole || userRole === 'user';
    });
    
    console.log("Filtered guests:", guestsOnly);
    console.log("Total users found:", allUsers.length);
    console.log("Guests found:", guestsOnly.length);
    
    setGuests(guestsOnly);
  } catch (error) {
    console.log('Error fetching guests:', error.message);
    console.log('Error stack:', error.stack);
  }
};
  
  // Fetch rooms - Fixed to match Admin Dashboard method
  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_URL}/room/all-rooms`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      // Handle different data structures
      let roomsData = [];
      if (Array.isArray(data)) {
        roomsData = data;
      } else if (Array.isArray(data?.findRooms)) {
        roomsData = data.findRooms;
      } else if (Array.isArray(data?.rooms)) {
        roomsData = data.rooms;
      }
      
      console.log("Rooms data received:", data);
      console.log("Rooms parsed:", roomsData);
      
      setRooms(roomsData);
      
      // Filter available rooms
      const available = roomsData.filter(room => 
        (room.isAvailable === true || room.isAvailable === 'true') && 
        room.roomStatus === 'available'
      );
      setAvailableRooms(available);
    } catch (error) {
      console.log('Error fetching rooms:', error);
      setError('Failed to fetch rooms');
    }
  };
  

  // Fetch bookings - Fixed to match Admin Dashboard method
  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_URL}/booking/all-bookings`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      // Handle different data structures
      let bookingsData = [];
      if (Array.isArray(data?.allBookings)) {
        bookingsData = data.allBookings;
      } else if (Array.isArray(data)) {
        bookingsData = data;
      } else if (Array.isArray(data?.bookings)) {
        bookingsData = data.bookings;
      }
      
      console.log("Bookings fetched:", bookingsData);
      setBookings(bookingsData);
    } catch (error) {
      console.log('Error fetching bookings:', error);
      setError('Failed to fetch bookings');
    }
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
      fetchAllData(); // Refresh all data
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Create Guest
  const handleCreateGuest = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await apiCall('POST', '/register', {
        fullName: guestForm.fullName,
        username: guestForm.username || guestForm.email.split('@')[0],
        email: guestForm.email,
        phone: guestForm.phone,
        address: guestForm.address,
        idType: guestForm.idType,
        idNumber: guestForm.idNumber,
        password: guestForm.password,
        role: 'guest',
        status: 'active'
      });
      
      setGuestForm({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        idType: 'passport',
        idNumber: '',
        username: '',
        password: 'guest123'
      });
    } catch (error) {
      console.error('Error creating guest:', error);
    }
    setLoading(false);
  };
  
  // Create Booking
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await apiCall('POST', '/booking/create-booking', {
        guestId: bookingForm.guestId,
        roomId: bookingForm.roomId,
        bookingDate: new Date().toISOString().split('T')[0],
        checkinDate: bookingForm.checkinDate,
        checkoutDate: bookingForm.checkoutDate,
        guestsCount: bookingForm.guestsCount,
        bookingStatus: 'confirmed'
      });
      
      setBookingForm({
        guestId: '',
        roomId: '',
        checkinDate: '',
        checkoutDate: '',
        guestsCount: 1
      });
    } catch (error) {
      console.error('Error creating booking:', error);
    }
    setLoading(false);
  };
  
  // Check-in Guest
  const handleCheckin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Update booking status
      await apiCall('PUT', `/booking/update-booking-status/${checkinForm.bookingId}`, {
        bookingStatus: 'checked-in'
      });
      
      // Update room status
      await apiCall('PUT', `/room/update-room-status/${checkinForm.roomId}`, {
        roomStatus: 'occupied',
        isAvailable: false
      });
    } catch (error) {
      console.error('Error checking in:', error);
    }
    setLoading(false);
  };
  
  // Check-out Guest
  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Update booking status
      await apiCall('PUT', `/booking/update-booking-status/${checkoutForm.bookingId}`, {
        bookingStatus: 'checked-out'
      });
      
      // Update room status to cleaning
      await apiCall('PUT', `/room/update-room-status/${checkoutForm.roomId}`, {
        roomStatus: 'cleaning',
        isAvailable: false
      });
      
      setCheckoutForm({
        bookingId: '',
        extraCharges: 0
      });
    } catch (error) {
      console.error('Error checking out:', error);
    }
    setLoading(false);
  };
  
  // Generate Bill
  const handleGenerateBill = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Calculate total
      const subtotal = billForm.roomCharges + billForm.serviceCharges;
      const taxAmount = (subtotal * billForm.tax) / 100;
      const discountAmount = (subtotal * billForm.discount) / 100;
      const total = subtotal + taxAmount - discountAmount;
      
      // Process payment
      await apiCall('POST', '/payment/process-payment', {
        bookingId: billForm.bookingId,
        amount: total,
        paymentMethod: 'cash',
        status: 'completed'
      });
      
      setBillForm({
        bookingId: '',
        roomCharges: 0,
        serviceCharges: 0,
        tax: 0,
        discount: 0
      });
    } catch (error) {
      console.error('Error generating bill:', error);
    }
    setLoading(false);
  };
  
  // Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };
  
  if (!user) {
    return <div style={styles.loading}>Loading user data...</div>;
  }
  
  // Format date for input fields
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2>Reception Dashboard</h2>
          <p>Welcome, {user.fullName}! ({user.role})</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
      
      {/* Messages */}
      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}
      
      {/* Tabs */}
      <div style={styles.tabs}>
        <button 
          style={activeTab === 'createGuest' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('createGuest')}
        >
          Create Guest
        </button>
        <button 
          style={activeTab === 'bookRoom' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('bookRoom')}
        >
          Book Room
        </button>
        <button 
          style={activeTab === 'checkin' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('checkin')}
        >
          Check-in
        </button>
        <button 
          style={activeTab === 'checkout' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('checkout')}
        >
          Check-out
        </button>
        <button 
          style={activeTab === 'generateBill' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('generateBill')}
        >
          Generate Bill
        </button>
        <button 
          style={activeTab === 'viewGuests' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('viewGuests')}
        >
          View Guests
        </button>
        <button 
          style={activeTab === 'viewRooms' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('viewRooms')}
        >
          View Rooms
        </button>
        <button 
          style={activeTab === 'viewBookings' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('viewBookings')}
        >
          View Bookings
        </button>
        <button 
          style={styles.refreshBtn}
          onClick={fetchAllData}
          disabled={loading}
        >
          {loading ? 'Loading...' : '🔄 Refresh'}
        </button>
      </div>
      
      {/* Content */}
      <div style={styles.content}>
        {/* Create Guest Tab */}
        {activeTab === 'createGuest' && (
          <div style={styles.formContainer}>
            <h3>Create New Guest</h3>
            <form onSubmit={handleCreateGuest}>
              <div style={styles.formGroup}>
                <label>Full Name *</label>
                <input
                  type="text"
                  value={guestForm.fullName}
                  onChange={(e) => setGuestForm({...guestForm, fullName: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label>Email *</label>
                <input
                  type="email"
                  value={guestForm.email}
                  onChange={(e) => setGuestForm({...guestForm, email: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label>Phone *</label>
                <input
                  type="tel"
                  value={guestForm.phone}
                  onChange={(e) => setGuestForm({...guestForm, phone: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label>Address</label>
                <textarea
                  value={guestForm.address}
                  onChange={(e) => setGuestForm({...guestForm, address: e.target.value})}
                  style={styles.textarea}
                  rows="3"
                />
              </div>
              
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label>ID Type</label>
                  <select
                    value={guestForm.idType}
                    onChange={(e) => setGuestForm({...guestForm, idType: e.target.value})}
                    style={styles.input}
                  >
                    <option value="passport">Passport</option>
                    <option value="driving_license">Driving License</option>
                    <option value="national_id">National ID</option>
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label>ID Number</label>
                  <input
                    type="text"
                    value={guestForm.idNumber}
                    onChange={(e) => setGuestForm({...guestForm, idNumber: e.target.value})}
                    style={styles.input}
                  />
                </div>
              </div>
              
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label>Username</label>
                  <input
                    type="text"
                    value={guestForm.username}
                    onChange={(e) => setGuestForm({...guestForm, username: e.target.value})}
                    style={styles.input}
                    placeholder="Auto-generated from email"
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label>Password</label>
                  <input
                    type="password"
                    value={guestForm.password}
                    onChange={(e) => setGuestForm({...guestForm, password: e.target.value})}
                    style={styles.input}
                  />
                </div>
              </div>
              
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Creating...' : 'Create Guest'}
              </button>
            </form>
          </div>
        )}
        
        {/* Book Room Tab */}
        {activeTab === 'bookRoom' && (
          <div style={styles.formContainer}>
            <h3>Book a Room</h3>
            <form onSubmit={handleCreateBooking}>
              <div style={styles.formGroup}>
                <label>Select Guest *</label>
                <select
                  value={bookingForm.guestId}
                  onChange={(e) => setBookingForm({...bookingForm, guestId: e.target.value})}
                  style={styles.input}
                  required
                >
                  <option value="">Select a guest</option>
                  {Array.isArray(guests) && guests.map(guest => (
                    <option key={guest._id} value={guest._id}>
                      {guest.fullName} ({guest.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label>Select Room *</label>
                <select
                  value={bookingForm.roomId}
                  onChange={(e) => setBookingForm({...bookingForm, roomId: e.target.value})}
                  style={styles.input}
                  required
                >
                  <option value="">Select a room</option>
                  {Array.isArray(availableRooms) && availableRooms.length > 0 ? (
                    availableRooms.map(room => (
                      <option key={room._id} value={room._id}>
                        Room {room.roomNumber} - {room.roomType} (${room.pricePerNight}/night)
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No available rooms</option>
                  )}
                </select>
              </div>
              
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label>Check-in Date *</label>
                  <input
                    type="date"
                    value={bookingForm.checkinDate}
                    onChange={(e) => setBookingForm({...bookingForm, checkinDate: e.target.value})}
                    style={styles.input}
                    required
                    min={formatDateForInput(new Date())}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label>Check-out Date *</label>
                  <input
                    type="date"
                    value={bookingForm.checkoutDate}
                    onChange={(e) => setBookingForm({...bookingForm, checkoutDate: e.target.value})}
                    style={styles.input}
                    required
                    min={bookingForm.checkinDate || formatDateForInput(new Date())}
                  />
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <label>Number of Guests</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={bookingForm.guestsCount}
                  onChange={(e) => setBookingForm({...bookingForm, guestsCount: parseInt(e.target.value) || 1})}
                  style={styles.input}
                />
              </div>
              
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Booking...' : 'Book Room'}
              </button>
            </form>
          </div>
        )}
        
        {/* Check-in Tab */}
        {activeTab === 'checkin' && (
          <div style={styles.formContainer}>
            <h3>Check-in Guest</h3>
            <form onSubmit={handleCheckin}>
              <div style={styles.formGroup}>
                <label>Select Booking *</label>
                <select
                  value={checkinForm.bookingId}
                  onChange={(e) => {
                    const booking = Array.isArray(bookings) ? 
                      bookings.find(b => b._id === e.target.value) : null;
                    setCheckinForm({
                      bookingId: e.target.value,
                      roomId: booking?.roomId || ''
                    });
                  }}
                  style={styles.input}
                  required
                >
                  <option value="">Select a booking</option>
                  {Array.isArray(bookings) && bookings
                    .filter(b => b.bookingStatus === 'confirmed')
                    .map(booking => (
                      <option key={booking._id} value={booking._id}>
                        Booking #{booking._id?.substring(0, 8)} - Guest: {booking.guestId}
                      </option>
                    ))
                  }
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label>Room ID</label>
                <input
                  type="text"
                  value={checkinForm.roomId}
                  style={styles.input}
                  readOnly
                />
              </div>
              
              <button type="submit" style={styles.submitBtn} disabled={loading || !checkinForm.bookingId}>
                {loading ? 'Processing...' : 'Check-in Guest'}
              </button>
            </form>
          </div>
        )}
        
        {/* Check-out Tab */}
        {activeTab === 'checkout' && (
          <div style={styles.formContainer}>
            <h3>Check-out Guest</h3>
            <form onSubmit={handleCheckout}>
              <div style={styles.formGroup}>
                <label>Select Booking *</label>
                <select
                  value={checkoutForm.bookingId}
                  onChange={(e) => {
                    const booking = Array.isArray(bookings) ? 
                      bookings.find(b => b._id === e.target.value) : null;
                    setCheckoutForm({
                      bookingId: e.target.value,
                      roomId: booking?.roomId || ''
                    });
                  }}
                  style={styles.input}
                  required
                >
                  <option value="">Select a booking</option>
                  {Array.isArray(bookings) && bookings
                    .filter(b => b.bookingStatus === 'checked-in')
                    .map(booking => (
                      <option key={booking._id} value={booking._id}>
                        Booking #{booking._id?.substring(0, 8)} - Guest: {booking.guestId}
                      </option>
                    ))
                  }
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label>Room ID</label>
                <input
                  type="text"
                  value={checkoutForm.roomId}
                  style={styles.input}
                  readOnly
                />
              </div>
              
              <div style={styles.formGroup}>
                <label>Extra Charges ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={checkoutForm.extraCharges}
                  onChange={(e) => setCheckoutForm({...checkoutForm, extraCharges: parseFloat(e.target.value) || 0})}
                  style={styles.input}
                />
              </div>
              
              <button type="submit" style={styles.submitBtn} disabled={loading || !checkoutForm.bookingId}>
                {loading ? 'Processing...' : 'Check-out Guest'}
              </button>
            </form>
          </div>
        )}
        
        {/* Generate Bill Tab */}
        {activeTab === 'generateBill' && (
          <div style={styles.formContainer}>
            <h3>Generate Bill</h3>
            <form onSubmit={handleGenerateBill}>
              <div style={styles.formGroup}>
                <label>Select Booking *</label>
                <select
                  value={billForm.bookingId}
                  onChange={(e) => setBillForm({...billForm, bookingId: e.target.value})}
                  style={styles.input}
                  required
                >
                  <option value="">Select a booking</option>
                  {Array.isArray(bookings) && bookings
                    .filter(b => b.bookingStatus === 'checked-out')
                    .map(booking => (
                      <option key={booking._id} value={booking._id}>
                        Booking #{booking._id?.substring(0, 8)}
                      </option>
                    ))
                  }
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label>Room Charges ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={billForm.roomCharges}
                  onChange={(e) => setBillForm({...billForm, roomCharges: parseFloat(e.target.value) || 0})}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label>Service Charges ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={billForm.serviceCharges}
                  onChange={(e) => setBillForm({...billForm, serviceCharges: parseFloat(e.target.value) || 0})}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label>Tax (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={billForm.tax}
                    onChange={(e) => setBillForm({...billForm, tax: parseFloat(e.target.value) || 0})}
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label>Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={billForm.discount}
                    onChange={(e) => setBillForm({...billForm, discount: parseFloat(e.target.value) || 0})}
                    style={styles.input}
                  />
                </div>
              </div>
              
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Bill'}
              </button>
            </form>
          </div>
        )}
        
        {/* View Guests Tab */}
        {activeTab === 'viewGuests' && (
          <div>
            <div style={styles.tableHeader}>
              <h3>All Guests ({Array.isArray(guests) ? guests.length : 0})</h3>
              <button onClick={fetchGuests} style={styles.smallBtn} disabled={loading}>
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
            <div style={styles.tableContainer}>
              {loading ? (
                <div style={styles.loading}>Loading guests...</div>
              ) : !Array.isArray(guests) || guests.length === 0 ? (
                <div style={styles.noData}>No guests found</div>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.tableTh}>Name</th>
                      <th style={styles.tableTh}>Email</th>
                      <th style={styles.tableTh}>Phone</th>
                      <th style={styles.tableTh}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guests.map(guest => (
                      <tr key={guest._id}>
                        <td style={styles.tableTd}>{guest.fullName}</td>
                        <td style={styles.tableTd}>{guest.email}</td>
                        <td style={styles.tableTd}>{guest.phone}</td>
                        <td style={styles.tableTd}>{guest.status || 'active'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
        
        {/* View Rooms Tab */}
        {activeTab === 'viewRooms' && (
          <div>
            <div style={styles.tableHeader}>
              <h3>All Rooms ({Array.isArray(rooms) ? rooms.length : 0})</h3>
              <button onClick={fetchRooms} style={styles.smallBtn} disabled={loading}>
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
            {loading ? (
              <div style={styles.loading}>Loading rooms...</div>
            ) : !Array.isArray(rooms) || rooms.length === 0 ? (
              <div style={styles.noData}>No rooms found</div>
            ) : (
              <div style={styles.roomsGrid}>
                {rooms.map(room => (
                  <div key={room._id} style={styles.roomCard}>
                    <h4>Room {room.roomNumber}</h4>
                    <p>Type: {room.roomType}</p>
                    <p>Price: ${room.pricePerNight || 0}/night</p>
                    <p>Status: 
                      <span style={{
                        color: room.roomStatus === 'available' ? 'green' :
                               room.roomStatus === 'occupied' ? 'red' :
                               room.roomStatus === 'cleaning' ? 'orange' : 'gray'
                      }}>
                        {' ' + (room.roomStatus || 'available')}
                      </span>
                    </p>
                    <p>Available: {room.isAvailable ? 'Yes' : 'No'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* View Bookings Tab */}
        {activeTab === 'viewBookings' && (
          <div>
            <div style={styles.tableHeader}>
              <h3>All Bookings ({Array.isArray(bookings) ? bookings.length : 0})</h3>
              <button onClick={fetchBookings} style={styles.smallBtn} disabled={loading}>
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
            <div style={styles.tableContainer}>
              {loading ? (
                <div style={styles.loading}>Loading bookings...</div>
              ) : !Array.isArray(bookings) || bookings.length === 0 ? (
                <div style={styles.noData}>No bookings found</div>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.tableTh}>Booking ID</th>
                      <th style={styles.tableTh}>Guest</th>
                      <th style={styles.tableTh}>Check-in</th>
                      <th style={styles.tableTh}>Check-out</th>
                      <th style={styles.tableTh}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <tr key={booking._id}>
                        <td style={styles.tableTd}>{booking._id?.substring(0, 8) || 'N/A'}</td>
                        <td style={styles.tableTd}>{booking.guestId || 'N/A'}</td>
                        <td style={styles.tableTd}>{booking.checkinDate ? new Date(booking.checkinDate).toLocaleDateString() : 'N/A'}</td>
                        <td style={styles.tableTd}>{booking.checkoutDate ? new Date(booking.checkoutDate).toLocaleDateString() : 'N/A'}</td>
                        <td style={{
                          ...styles.tableTd,
                          color: booking.bookingStatus === 'confirmed' ? 'blue' :
                                 booking.bookingStatus === 'checked-in' ? 'green' :
                                 booking.bookingStatus === 'checked-out' ? 'orange' : 'gray'
                        }}>
                          {booking.bookingStatus}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
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
  tabs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    padding: '20px',
    backgroundColor: 'white',
    borderBottom: '2px solid #eee'
  },
  tab: {
    padding: '10px 20px',
    backgroundColor: '#ecf0f1',
    border: '1px solid #bdc3c7',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  activeTab: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  refreshBtn: {
    padding: '10px 20px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginLeft: 'auto'
  },
  content: {
    padding: '20px'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666'
  },
  formContainer: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  formGroup: {
    marginBottom: '15px'
  },
  formRow: {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: '80px'
  },
  submitBtn: {
    padding: '12px 30px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%',
    marginTop: '10px'
  },
  smallBtn: {
    padding: '8px 15px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  tableContainer: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableTh: {
    backgroundColor: '#34495e',
    color: 'white',
    padding: '12px',
    textAlign: 'left',
    border: '1px solid #ddd'
  },
  tableTd: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
    border: '1px solid #ddd'
  },
  roomsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px'
  },
  roomCard: {
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa'
  },
  noData: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
    fontSize: '16px'
  }
};

export default ReceptionDashboard;