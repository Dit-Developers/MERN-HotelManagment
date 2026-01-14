import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ReceptionDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('createGuest');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Guest Form State
  const [guestForm, setGuestForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    idType: 'passport',
    idNumber: ''
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
    roomId: '',
    checkinTime: ''
  });
  
  // Check-out Form State
  const [checkoutForm, setCheckoutForm] = useState({
    bookingId: '',
    checkoutTime: '',
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
  
  // Load user data on component mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchGuests();
    fetchRooms();
    fetchBookings();
  }, []);
  
  // Fetch guests
  const fetchGuests = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await axios.get('http://localhost:5000/api/get-all-users', {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Sirf role='guest' wale users select karein
    const guestsOnly = (response.data.allUsers || []).filter(user => user.role === 'guest');

    console.log("Guests fetched:", guestsOnly); // debug purpose
    setGuests(guestsOnly);
  } catch (error) {
    console.log('Error fetching guests:', error.response?.data || error.message);
  }
};

  
  // Fetch rooms
  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/room/all-rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms(response.data.findRooms || []);
      // Filter available rooms
      const available = response.data.findRooms?.filter(room => 
        room.isAvailable && room.roomStatus === 'available'
      ) || [];
      setAvailableRooms(available);
    } catch (error) {
      console.log('Error fetching rooms:', error);
    }
  };
  
  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/booking/all-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data.allBookings || []);
    } catch (error) {
      console.log('Error fetching bookings:', error);
    }
  };
  
  // Create Guest
  const handleCreateGuest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/register', {
        fullName: guestForm.fullName,
        email: guestForm.email,
        phone: guestForm.phone,
        address: guestForm.address,
        idType: guestForm.idType,
        idNumber: guestForm.idNumber,
        role: 'guest',
        status: 'active'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage('Guest created successfully!');
      setGuestForm({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        idType: 'passport',
        idNumber: ''
      });
      fetchGuests();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create guest');
    }
    setLoading(false);
  };
  
  // Create Booking
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/booking/create-booking', {
        guestId: bookingForm.guestId,
        roomId: bookingForm.roomId,
        bookingDate: new Date().toISOString().split('T')[0],
        checkinDate: bookingForm.checkinDate,
        checkoutDate: bookingForm.checkoutDate,
        guestsCount: bookingForm.guestsCount,
        bookingStatus: 'confirmed'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage('Booking created successfully!');
      setBookingForm({
        guestId: '',
        roomId: '',
        checkinDate: '',
        checkoutDate: '',
        guestsCount: 1
      });
      fetchBookings();
      fetchRooms();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create booking');
    }
    setLoading(false);
  };
  
  // Check-in Guest
  const handleCheckin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Update booking status
      await axios.put(`http://localhost:5000/api/bookings/${checkinForm.bookingId}/status`, {
        bookingStatus: 'checked-in'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update room status
      await axios.put(`http://localhost:5000/api/rooms/${checkinForm.roomId}/status`, {
        status: 'occupied'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage('Check-in successful!');
      setCheckinForm({
        bookingId: '',
        roomId: '',
        checkinTime: ''
      });
      fetchBookings();
      fetchRooms();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Check-in failed');
    }
    setLoading(false);
  };
  
  // Check-out Guest
  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Update booking status
      await axios.put(`http://localhost:5000/api/bookings/${checkoutForm.bookingId}/status`, {
        bookingStatus: 'checked-out'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update room status to cleaning
      await axios.put(`http://localhost:5000/api/rooms/${checkoutForm.roomId}/status`, {
        status: 'cleaning'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage('Check-out successful! Room marked for cleaning.');
      setCheckoutForm({
        bookingId: '',
        checkoutTime: '',
        extraCharges: 0
      });
      fetchBookings();
      fetchRooms();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Check-out failed');
    }
    setLoading(false);
  };
  
  // Generate Bill
  const handleGenerateBill = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // Calculate total
      const subtotal = billForm.roomCharges + billForm.serviceCharges;
      const taxAmount = (subtotal * billForm.tax) / 100;
      const discountAmount = (subtotal * billForm.discount) / 100;
      const total = subtotal + taxAmount - discountAmount;
      
      const token = localStorage.getItem('token');
      
      // Process payment
      const paymentResponse = await axios.post('http://localhost:5000/api/payments/process-payment', {
        bookingId: billForm.bookingId,
        amount: total,
        paymentMethod: 'cash',
        currency: 'USD',
        paymentStatus: 'completed'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Create bill record (you need to create a bills API)
      // await axios.post('http://localhost:5000/api/bills', {
      //   bookingId: billForm.bookingId,
      //   roomCharges: billForm.roomCharges,
      //   serviceCharges: billForm.serviceCharges,
      //   tax: taxAmount,
      //   discount: discountAmount,
      //   total: total,
      //   status: 'paid'
      // }, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      setMessage(`Bill generated successfully! Total: $${total.toFixed(2)}`);
      setBillForm({
        bookingId: '',
        roomCharges: 0,
        serviceCharges: 0,
        tax: 0,
        discount: 0
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to generate bill');
    }
    setLoading(false);
  };
  
  // Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2>Reception Dashboard</h2>
        <p>Welcome, {user.fullName}! ({user.role})</p>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
      
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
      </div>
      
      {/* Message */}
      {message && (
        <div style={message.includes('success') ? styles.successMessage : styles.errorMessage}>
          {message}
        </div>
      )}
      
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
                  {guests.map(guest => (
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
                  {availableRooms.map(room => (
                    <option key={room._id} value={room._id}>
                      Room {room.roomNumber} - {room.roomType} (${room.pricePerNight}/night)
                    </option>
                  ))}
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
                  />
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <label>Number of Guests</label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={bookingForm.guestsCount}
                  onChange={(e) => setBookingForm({...bookingForm, guestsCount: e.target.value})}
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
                    const booking = bookings.find(b => b._id === e.target.value);
                    setCheckinForm({
                      ...checkinForm,
                      bookingId: e.target.value,
                      roomId: booking?.roomId || ''
                    });
                  }}
                  style={styles.input}
                  required
                >
                  <option value="">Select a booking</option>
                  {bookings
                    .filter(b => b.bookingStatus === 'confirmed')
                    .map(booking => (
                      <option key={booking._id} value={booking._id}>
                        Booking #{booking._id.substring(0, 8)} - Guest: {booking.guestId}
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
              
              <div style={styles.formGroup}>
                <label>Check-in Time</label>
                <input
                  type="datetime-local"
                  value={checkinForm.checkinTime}
                  onChange={(e) => setCheckinForm({...checkinForm, checkinTime: e.target.value})}
                  style={styles.input}
                />
              </div>
              
              <button type="submit" style={styles.submitBtn} disabled={loading}>
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
                    const booking = bookings.find(b => b._id === e.target.value);
                    setCheckoutForm({
                      ...checkoutForm,
                      bookingId: e.target.value,
                      roomId: booking?.roomId || ''
                    });
                  }}
                  style={styles.input}
                  required
                >
                  <option value="">Select a booking</option>
                  {bookings
                    .filter(b => b.bookingStatus === 'checked-in')
                    .map(booking => (
                      <option key={booking._id} value={booking._id}>
                        Booking #{booking._id.substring(0, 8)} - Guest: {booking.guestId}
                      </option>
                    ))
                  }
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label>Check-out Time</label>
                <input
                  type="datetime-local"
                  value={checkoutForm.checkoutTime}
                  onChange={(e) => setCheckoutForm({...checkoutForm, checkoutTime: e.target.value})}
                  style={styles.input}
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
              
              <button type="submit" style={styles.submitBtn} disabled={loading}>
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
                  {bookings
                    .filter(b => b.bookingStatus === 'checked-out')
                    .map(booking => (
                      <option key={booking._id} value={booking._id}>
                        Booking #{booking._id.substring(0, 8)}
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
            <h3>All Guests</h3>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map(guest => (
                    <tr key={guest._id}>
                      <td>{guest.fullName}</td>
                      <td>{guest.email}</td>
                      <td>{guest.phone}</td>
                      <td>{guest.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* View Rooms Tab */}
        {activeTab === 'viewRooms' && (
          <div>
            <h3>All Rooms</h3>
            <div style={styles.roomsGrid}>
              {rooms.map(room => (
                <div key={room._id} style={styles.roomCard}>
                  <h4>Room {room.roomNumber}</h4>
                  <p>Type: {room.roomType}</p>
                  <p>Price: ${room.pricePerNight}/night</p>
                  <p>Status: 
                    <span style={{
                      color: room.roomStatus === 'available' ? 'green' :
                             room.roomStatus === 'occupied' ? 'red' :
                             room.roomStatus === 'cleaning' ? 'orange' : 'gray'
                    }}>
                      {room.roomStatus}
                    </span>
                  </p>
                  <p>Available: {room.isAvailable ? 'Yes' : 'No'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* View Bookings Tab */}
        {activeTab === 'viewBookings' && (
          <div>
            <h3>All Bookings</h3>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Guest</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id}>
                      <td>{booking._id.substring(0, 8)}</td>
                      <td>{booking.guestId}</td>
                      <td>{new Date(booking.checkinDate).toLocaleDateString()}</td>
                      <td>{new Date(booking.checkoutDate).toLocaleDateString()}</td>
                      <td style={{
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #ddd'
  },
  logoutBtn: {
    padding: '10px 20px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  tab: {
    padding: '10px 20px',
    backgroundColor: '#ecf0f1',
    border: '1px solid #bdc3c7',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  activeTab: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  content: {
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  formContainer: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  formGroup: {
    marginBottom: '20px'
  },
  formRow: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    resize: 'vertical'
  },
  submitBtn: {
    padding: '12px 30px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%'
  },
  successMessage: {
    padding: '15px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  errorMessage: {
    padding: '15px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  },
  tableTh: {
    backgroundColor: '#34495e',
    color: 'white',
    padding: '12px',
    textAlign: 'left'
  },
  tableTd: {
    padding: '12px',
    borderBottom: '1px solid #ddd'
  },
  roomsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  roomCard: {
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#f8f9fa'
  }
};

export default ReceptionDashboard;