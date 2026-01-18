import React, { useState, useEffect } from 'react';
import { 
  FaUserPlus,
  FaCalendarPlus,
  FaSignInAlt,
  FaSignOutAlt as FaSignOut,
  FaFileInvoiceDollar,
  FaUsers,
  FaBed,
  FaCalendarCheck,
  FaPrint,
  FaSyncAlt,
  FaUserCircle,
  FaChevronRight,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaHome,
  FaHotel,
  FaMoneyBillWave,
  FaReceipt,
  FaKey,
  FaClock,
  FaDoorOpen,
  FaDoorClosed,
  FaEye,
  FaIdCard
} from 'react-icons/fa';
import FormStatus from '../component/FormStatus';
import { API_URL } from '../config/api';

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
  const [payments, setPayments] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [lastInvoice, setLastInvoice] = useState(null);
  const [settings, setSettings] = useState({
    defaultTaxRate: 0,
    defaultDiscountRate: 0
  });
  
  const [selectedGuest, setSelectedGuest] = useState(null);
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
  const tabBaseClasses = "px-6 py-3 text-sm font-light tracking-wider uppercase transition-all duration-300 rounded-sm border";
  const tabActiveClasses = "font-normal shadow-lg";
  const tabInactiveClasses = "border-gray-300 text-gray-700 hover:text-gray-900";
  
  const inputClasses = "w-full rounded-sm border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 font-light transition-all duration-300 bg-white/80 backdrop-blur-sm";
  const textareaClasses = "w-full rounded-sm border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 font-light resize-y transition-all duration-300 bg-white/80 backdrop-blur-sm min-h-[100px]";
  const selectClasses = "w-full rounded-sm border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 font-light transition-all duration-300 bg-white/80 backdrop-blur-sm";
  const submitButtonClasses = "w-full mt-4 px-6 py-3 text-sm font-medium text-white rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase relative overflow-hidden hover:shadow-lg";
  const tableContainerClasses = "rounded-sm border bg-white/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg transition-all duration-500";
  const smallButtonClasses = "px-4 py-2.5 text-sm font-medium rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase";

  const isValidEmail = (value) => {
    const email = (value || '').trim();
    if (!email) {
      return false;
    }
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const isValidPhone = (value) => {
    const phone = (value || '').trim();
    const pattern = /^[0-9+\-\s()]{7,20}$/;
    return pattern.test(phone);
  };

  const validateGuestForm = () => {
    if (!guestForm.fullName || !guestForm.fullName.trim()) {
      setError('Full name is required');
      setSuccess('');
      return false;
    }

    if (guestForm.fullName.trim().length < 2) {
      setError('Full name must be at least 2 characters');
      setSuccess('');
      return false;
    }

    if (!guestForm.email || !isValidEmail(guestForm.email)) {
      setError('Please enter a valid email address');
      setSuccess('');
      return false;
    }

    if (!guestForm.phone || !isValidPhone(guestForm.phone)) {
      setError('Please enter a valid phone number');
      setSuccess('');
      return false;
    }

    if (guestForm.password && guestForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      setSuccess('');
      return false;
    }

    return true;
  };

  const validateBookingForm = () => {
    if (!bookingForm.guestId || !bookingForm.roomId) {
      setError('Please select both guest and room');
      setSuccess('');
      return false;
    }

    if (!bookingForm.checkinDate || !bookingForm.checkoutDate) {
      setError('Please select check-in and check-out dates');
      setSuccess('');
      return false;
    }

    const checkin = new Date(bookingForm.checkinDate);
    const checkout = new Date(bookingForm.checkoutDate);

    if (Number.isNaN(checkin.getTime()) || Number.isNaN(checkout.getTime())) {
      setError('Please enter valid dates');
      setSuccess('');
      return false;
    }

    if (checkout <= checkin) {
      setError('Check-out date must be after check-in date');
      setSuccess('');
      return false;
    }

    if (!bookingForm.guestsCount || bookingForm.guestsCount < 1) {
      setError('Number of guests must be at least 1');
      setSuccess('');
      return false;
    }

    return true;
  };

  const validateCheckoutForm = () => {
    if (!checkoutForm.bookingId) {
      setError('Please select a booking to check out');
      setSuccess('');
      return false;
    }

    if (checkoutForm.extraCharges < 0) {
      setError('Extra charges cannot be negative');
      setSuccess('');
      return false;
    }

    return true;
  };

  const validateBillForm = () => {
    if (!billForm.bookingId) {
      setError('Please select a booking to generate bill');
      setSuccess('');
      return false;
    }

    if (billForm.roomCharges <= 0) {
      setError('Room charges must be greater than zero');
      setSuccess('');
      return false;
    }

    if (billForm.serviceCharges < 0) {
      setError('Service charges cannot be negative');
      setSuccess('');
      return false;
    }

    if (billForm.tax < 0 || billForm.tax > 50) {
      setError('Tax percentage must be between 0 and 50');
      setSuccess('');
      return false;
    }

    if (billForm.discount < 0 || billForm.discount > 100) {
      setError('Discount percentage must be between 0 and 100');
      setSuccess('');
      return false;
    }

    const subtotal = billForm.roomCharges + billForm.serviceCharges;
    if (subtotal < 0) {
      setError('Charges cannot result in a negative subtotal');
      setSuccess('');
      return false;
    }

    return true;
  };

  // Load user data on component mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    fetchAllData();
  }, []);
  
  useEffect(() => {
    const handleFocus = () => {
      fetchAllData();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
  
  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchGuests(),
        fetchRooms(),
        fetchBookings(),
        fetchPayments(),
        fetchServiceRequests(),
        fetchSettings()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch guests
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
  
  // Fetch rooms
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
  
  // Fetch bookings
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

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${API_URL}/payment/get-all-payments`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      let paymentsData = [];
      if (Array.isArray(data?.payments)) {
        paymentsData = data.payments;
      } else if (Array.isArray(data)) {
        paymentsData = data;
      }

      setPayments(paymentsData);
    } catch (error) {
      console.log('Error fetching payments:', error);
    }
  };

  const fetchServiceRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/service-requests`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      const requests = Array.isArray(data?.serviceRequests) ? 
        data.serviceRequests : 
        Array.isArray(data) ? data : [];

      setServiceRequests(requests);
    } catch (error) {
      console.log('Error fetching service requests:', error);
    }
  };
  
  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/settings`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      const settingsObj = data?.settings || data;

      if (settingsObj) {
        const defaultTaxRate = typeof settingsObj.defaultTaxRate === 'number'
          ? settingsObj.defaultTaxRate
          : parseFloat(settingsObj.defaultTaxRate) || 0;

        const defaultDiscountRate = typeof settingsObj.defaultDiscountRate === 'number'
          ? settingsObj.defaultDiscountRate
          : parseFloat(settingsObj.defaultDiscountRate) || 0;

        const normalizedSettings = {
          defaultTaxRate,
          defaultDiscountRate
        };

        setSettings(normalizedSettings);

        setBillForm(prev => ({
          ...prev,
          tax: prev.tax || normalizedSettings.defaultTaxRate,
          discount: prev.discount || normalizedSettings.defaultDiscountRate
        }));
      }
    } catch (error) {
      console.log('Error fetching settings:', error);
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
    setError('');
    setSuccess('');

    const isValid = validateGuestForm();
    if (!isValid) {
      return;
    }

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
    setError('');
    setSuccess('');

    const isValid = validateBookingForm();
    if (!isValid) {
      return;
    }

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
    setError('');
    setSuccess('');

    if (!checkinForm.bookingId || !checkinForm.roomId) {
      setError('Please select a booking to check in');
      setSuccess('');
      return;
    }

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
    setError('');
    setSuccess('');

    const isValid = validateCheckoutForm();
    if (!isValid) {
      return;
    }

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
    setError('');
    setSuccess('');

    const isValid = validateBillForm();
    if (!isValid) {
      return;
    }

    setLoading(true);
    
    try {
      const subtotal = billForm.roomCharges + billForm.serviceCharges;
      const taxAmount = (subtotal * billForm.tax) / 100;
      const discountAmount = (subtotal * billForm.discount) / 100;
      const total = subtotal + taxAmount - discountAmount;

      const booking =
        Array.isArray(bookings) && billForm.bookingId
          ? bookings.find((b) => b._id === billForm.bookingId)
          : null;
      
      const paymentResult = await apiCall('POST', '/payment/process-payment', {
        bookingId: billForm.bookingId,
        roomId: booking?.roomId || '',
        amount: total,
        paymentMethod: 'cash',
        status: 'completed'
      });

      setLastInvoice({
        booking,
        payment: paymentResult?.payment || null,
        subtotal,
        taxAmount,
        discountAmount,
        total,
        taxRate: billForm.tax,
        discountRate: billForm.discount
      });
      
      setBillForm({
        bookingId: '',
        roomCharges: 0,
        serviceCharges: 0,
        tax: settings.defaultTaxRate || 0,
        discount: settings.defaultDiscountRate || 0
      });
    } catch (error) {
      console.error('Error generating bill:', error);
    }
    setLoading(false);
  };
  
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const handlePrintInvoice = () => {
    if (!lastInvoice) {
      return;
    }

    const invoiceWindow = window.open('', '_blank', 'width=800,height=600');
    if (!invoiceWindow) {
      return;
    }

    const booking = lastInvoice.booking || {};
    const guest =
      booking && Array.isArray(guests)
        ? guests.find((g) => String(g._id) === String(booking.guestId))
        : null;
    const room =
      booking && Array.isArray(rooms)
        ? rooms.find((r) => String(r._id) === String(booking.roomId))
        : null;
    const subtotal = lastInvoice.subtotal || 0;
    const taxAmount = lastInvoice.taxAmount || 0;
    const discountAmount = lastInvoice.discountAmount || 0;
    const total = lastInvoice.total || 0;
    const taxRate = lastInvoice.taxRate || 0;
    const discountRate = lastInvoice.discountRate || 0;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Invoice</title>
          <style>
            body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 24px; color: #111827; }
            .header { display: flex; justify-content: space-between; margin-bottom: 16px; }
            .title { font-size: 20px; font-weight: 600; }
            .subtitle { color: #4b5563; font-size: 14px; }
            .section-title { font-weight: 600; margin-bottom: 8px; }
            .box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-top: 8px; }
            .row { display: flex; justify-content: space-between; margin-top: 4px; font-size: 14px; }
            .total { font-weight: 700; margin-top: 8px; border-top: 1px dashed #d1d5db; padding-top: 8px; }
            .muted { font-size: 12px; color: #6b7280; margin-top: 16px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">LuxuryStay Hospitality</div>
              <div class="subtitle">Hotel Management System</div>
            </div>
            <div style="text-align: right; font-size: 14px;">
              <div><strong>Invoice Date:</strong> ${new Date().toLocaleDateString()}</div>
              <div><strong>Booking #:</strong> ${booking._id ? booking._id.substring(0, 8) : 'N/A'}</div>
            </div>
          </div>

          <div class="box">
            <div class="section-title">Guest Details</div>
            <div class="row"><span>Name</span><span>${guest && guest.fullName ? guest.fullName : 'N/A'}</span></div>
            <div class="row"><span>Email</span><span>${guest && guest.email ? guest.email : 'N/A'}</span></div>
            <div class="row"><span>Contact</span><span>${guest && guest.phone ? guest.phone : 'N/A'}</span></div>
            <div class="row"><span>Room Number</span><span>${room && room.roomNumber ? room.roomNumber : 'N/A'}</span></div>
          </div>

          <div class="box">
            <div class="section-title">Charges Breakdown</div>
            <div class="row"><span>Room & Service Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
            <div class="row"><span>Tax (${taxRate}%)</span><span>$${taxAmount.toFixed(2)}</span></div>
            <div class="row"><span>Discount (${discountRate}%)</span><span>-$${discountAmount.toFixed(2)}</span></div>
            <div class="row total"><span>Total Amount</span><span>$${total.toFixed(2)}</span></div>
          </div>

          <div class="muted">
            This invoice was generated by LuxuryStay Hospitality. Please keep it for your records.
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    invoiceWindow.document.open();
    invoiceWindow.document.write(html);
    invoiceWindow.document.close();
  };
  
  const currentBooking = lastInvoice?.booking || null;
  const currentGuest =
    currentBooking && Array.isArray(guests)
      ? guests.find((g) => g._id === currentBooking.guestId)
      : null;
  const currentRoom =
    currentBooking && Array.isArray(rooms)
      ? rooms.find((r) => r._id === currentBooking.roomId)
      : null;

  if (!user) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: customStyles.navy[900] }}
      >
        <div className="text-center">
          <div className="text-white font-serif text-xl mb-4">Loading reception dashboard...</div>
          <div className="w-16 h-1 mx-auto" style={{ background: `linear-gradient(to right, ${customStyles.gold[600]}, transparent)` }}></div>
        </div>
      </div>
    );
  }
  
  const isSameId = (a, b) => {
    if (!a || !b) return false;
    const aVal = typeof a === 'object' ? a._id : a;
    const bVal = typeof b === 'object' ? b._id : b;
    if (!aVal || !bVal) return false;
    return String(aVal) === String(bVal);
  };

  // Format date for input fields
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const tabs = [
    { id: 'createGuest', label: 'Create Guest', icon: <FaUserPlus /> },
    { id: 'bookRoom', label: 'Book Room', icon: <FaCalendarPlus /> },
    { id: 'checkin', label: 'Check-in', icon: <FaSignInAlt /> },
    { id: 'checkout', label: 'Check-out', icon: <FaSignOut /> },
    { id: 'generateBill', label: 'Generate Bill', icon: <FaFileInvoiceDollar /> },
    { id: 'viewGuests', label: 'View Guests', icon: <FaUsers /> },
    { id: 'viewRooms', label: 'View Rooms', icon: <FaBed /> },
    { id: 'viewBookings', label: 'View Bookings', icon: <FaCalendarCheck /> },
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
                Hotel <span style={{ color: customStyles.gold[500] }}>Reception</span> Dashboard
              </h1>
              <p className="text-gray-300 font-light text-sm tracking-widest uppercase">Front Desk Management System</p>
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
                    Role: Receptionist
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
                  <FaSignOut />
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            className={tableContainerClasses}
            style={{ borderLeft: `4px solid ${customStyles.gold[600]}` }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderLeftColor = customStyles.navy[600];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderLeftColor = customStyles.gold[600];
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: `${customStyles.gold[600]}20` }}>
                <FaUsers className="text-xl" style={{ color: customStyles.gold[600] }} />
              </div>
            </div>
            <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">Total Guests</p>
            <p className="text-2xl font-light" style={{ color: customStyles.navy[900] }}>{Array.isArray(guests) ? guests.length : 0}</p>
          </div>
          
          <div 
            className={tableContainerClasses}
            style={{ borderLeft: `4px solid ${customStyles.navy[600]}` }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderLeftColor = customStyles.gold[600];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderLeftColor = customStyles.navy[600];
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: `${customStyles.navy[600]}20` }}>
                <FaBed className="text-xl" style={{ color: customStyles.navy[600] }} />
              </div>
            </div>
            <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">Available Rooms</p>
            <p className="text-2xl font-light" style={{ color: customStyles.navy[900] }}>{Array.isArray(availableRooms) ? availableRooms.length : 0}</p>
          </div>
          
          <div 
            className={tableContainerClasses}
            style={{ borderLeft: `4px solid ${customStyles.gold[600]}` }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderLeftColor = customStyles.navy[600];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderLeftColor = customStyles.gold[600];
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: `${customStyles.gold[600]}20` }}>
                <FaCalendarCheck className="text-xl" style={{ color: customStyles.gold[600] }} />
              </div>
            </div>
            <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">Total Bookings</p>
            <p className="text-2xl font-light" style={{ color: customStyles.navy[900] }}>{Array.isArray(bookings) ? bookings.length : 0}</p>
          </div>
          
          <div 
            className={tableContainerClasses}
            style={{ borderLeft: `4px solid ${customStyles.navy[600]}` }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderLeftColor = customStyles.gold[600];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderLeftColor = customStyles.navy[600];
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: `${customStyles.navy[600]}20` }}>
                <FaMoneyBillWave className="text-xl" style={{ color: customStyles.navy[600] }} />
              </div>
            </div>
            <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">Last Invoice</p>
            <p className="text-2xl font-light" style={{ color: customStyles.navy[900] }}>
              ${lastInvoice?.total?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${tabBaseClasses} ${
                  activeTab === tab.id 
                    ? tabActiveClasses 
                    : tabInactiveClasses
                }`}
                style={
                  activeTab === tab.id
                    ? { 
                        backgroundColor: customStyles.gold[600],
                        borderColor: customStyles.gold[600],
                        color: 'white'
                      }
                    : {}
                }
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.color = customStyles.navy[900];
                    e.currentTarget.style.borderColor = customStyles.navy[900];
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.color = '#374151';
                    e.currentTarget.style.borderColor = '#D1D5DB';
                  }
                }}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="flex items-center gap-2">
                  {tab.icon}
                  {tab.label}
                </span>
              </button>
            ))}
            
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="ml-auto group px-4 py-3 text-sm font-medium rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase flex items-center gap-2"
              style={{ 
                backgroundColor: customStyles.navy[900],
                color: 'white'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.navy[800]}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.navy[900]}
            >
              <FaSyncAlt className={`${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
        
        <div className="mt-6">
          {activeTab === 'createGuest' && (
            <div className="bg-white rounded-sm border p-6 shadow-sm backdrop-blur-sm max-w-xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <FaUserPlus className="text-xl" style={{ color: customStyles.gold[600] }} />
                <h3 className="text-xl font-light text-gray-900">Create New Guest</h3>
              </div>
              <form onSubmit={handleCreateGuest} className="space-y-6">
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Full Name *</label>
                  <input
                    type="text"
                    value={guestForm.fullName}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const sanitized = raw.replace(/[^a-zA-Z\s.'-]/g, '');
                      setGuestForm({ ...guestForm, fullName: sanitized });
                    }}
                    className={inputClasses}
                    required
                    style={{ borderColor: customStyles.navy[200] }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Email *</label>
                  <input
                    type="email"
                    value={guestForm.email}
                    onChange={(e) =>
                      setGuestForm({ ...guestForm, email: e.target.value })
                    }
                    className={inputClasses}
                    required
                    style={{ borderColor: customStyles.navy[200] }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Phone *</label>
                  <input
                    type="tel"
                    value={guestForm.phone}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const sanitized = raw.replace(/[^0-9+\-\s()]/g, '');
                      setGuestForm({ ...guestForm, phone: sanitized });
                    }}
                    className={inputClasses}
                    required
                    style={{ borderColor: customStyles.navy[200] }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Address</label>
                  <textarea
                    value={guestForm.address}
                    onChange={(e) =>
                      setGuestForm({ ...guestForm, address: e.target.value })
                    }
                    rows="3"
                    className={textareaClasses}
                    style={{ borderColor: customStyles.navy[200] }}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">ID Type</label>
                    <select
                      value={guestForm.idType}
                      onChange={(e) =>
                        setGuestForm({ ...guestForm, idType: e.target.value })
                      }
                      className={selectClasses}
                      style={{ borderColor: customStyles.navy[200] }}
                    >
                      <option value="passport">Passport</option>
                      <option value="national_id">National ID</option>
                      <option value="driving_license">Driving License</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">ID Number</label>
                    <input
                      type="text"
                      value={guestForm.idNumber}
                      onChange={(e) =>
                        setGuestForm({ ...guestForm, idNumber: e.target.value })
                      }
                      className={inputClasses}
                      style={{ borderColor: customStyles.navy[200] }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Username</label>
                    <input
                      type="text"
                      value={guestForm.username}
                      onChange={(e) =>
                        setGuestForm({
                          ...guestForm,
                          username: e.target.value
                        })
                      }
                      placeholder="Auto-generated from email"
                      className={inputClasses}
                      style={{ borderColor: customStyles.navy[200] }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Password</label>
                    <input
                      type="password"
                      value={guestForm.password}
                      onChange={(e) =>
                        setGuestForm({
                          ...guestForm,
                          password: e.target.value
                        })
                      }
                      className={inputClasses}
                      style={{ borderColor: customStyles.navy[200] }}
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className={submitButtonClasses}
                  style={{ backgroundColor: customStyles.gold[600] }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                >
                  {loading ? 'Creating...' : 'Create Guest'}
                </button>
              </form>
            </div>
          )}
          
          {activeTab === 'bookRoom' && (
            <div className="bg-white rounded-sm border p-6 shadow-sm backdrop-blur-sm max-w-xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <FaCalendarPlus className="text-xl" style={{ color: customStyles.gold[600] }} />
                <h3 className="text-xl font-light text-gray-900">Book a Room</h3>
              </div>
              <form onSubmit={handleCreateBooking} className="space-y-6">
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Select Guest *</label>
                  <select
                    value={bookingForm.guestId}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        guestId: e.target.value
                      })
                    }
                    className={selectClasses}
                    required
                    style={{ borderColor: customStyles.navy[200] }}
                  >
                    <option value="">Select a guest</option>
                    {Array.isArray(guests) &&
                      guests.map((guest) => (
                        <option key={guest._id} value={guest._id}>
                          {guest.fullName} ({guest.email})
                        </option>
                      ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Select Room *</label>
                  <select
                    value={bookingForm.roomId}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        roomId: e.target.value
                      })
                    }
                    className={selectClasses}
                    required
                    style={{ borderColor: customStyles.navy[200] }}
                  >
                    <option value="">Select a room</option>
                    {Array.isArray(availableRooms) &&
                    availableRooms.length > 0 ? (
                      availableRooms.map((room) => (
                        <option key={room._id} value={room._id}>
                          Room {room.roomNumber} - {room.roomType} ($
                          {room.pricePerNight}/night)
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No available rooms
                      </option>
                    )}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Check-in Date *</label>
                    <input
                      type="date"
                      value={bookingForm.checkinDate}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          checkinDate: e.target.value
                        })
                      }
                      className={inputClasses}
                      required
                      style={{ borderColor: customStyles.navy[200] }}
                      min={formatDateForInput(new Date())}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Check-out Date *</label>
                    <input
                      type="date"
                      value={bookingForm.checkoutDate}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          checkoutDate: e.target.value
                        })
                      }
                      className={inputClasses}
                      required
                      style={{ borderColor: customStyles.navy[200] }}
                      min={
                        bookingForm.checkinDate ||
                        formatDateForInput(new Date())
                      }
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Number of Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={bookingForm.guestsCount}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        guestsCount: parseInt(e.target.value, 10) || 1
                      })
                    }
                    className={inputClasses}
                    style={{ borderColor: customStyles.navy[200] }}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className={submitButtonClasses}
                  style={{ backgroundColor: customStyles.gold[600] }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                >
                  {loading ? 'Booking...' : 'Book Room'}
                </button>
              </form>
            </div>
          )}
          
          {activeTab === 'checkin' && (
            <div className="bg-white rounded-sm border p-6 shadow-sm backdrop-blur-sm max-w-xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <FaSignInAlt className="text-xl" style={{ color: customStyles.gold[600] }} />
                <h3 className="text-xl font-light text-gray-900">Check-in Guest</h3>
              </div>
              <form onSubmit={handleCheckin} className="space-y-6">
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Select Booking *</label>
                  <select
                    value={checkinForm.bookingId}
                    onChange={(e) => {
                      const booking = Array.isArray(bookings)
                        ? bookings.find((b) => b._id === e.target.value)
                        : null;
                      setCheckinForm({
                        bookingId: e.target.value,
                        roomId: booking?.roomId || ''
                      });
                    }}
                    className={selectClasses}
                    required
                    style={{ borderColor: customStyles.navy[200] }}
                  >
                    <option value="">Select a booking</option>
                    {Array.isArray(bookings) &&
                      bookings
                        .filter((b) => b.bookingStatus === 'confirmed')
                        .map((booking) => {
                          const room = Array.isArray(rooms)
                            ? rooms.find((r) => r._id === booking.roomId)
                            : null;
                          const roomLabel =
                            (room && room.roomNumber) ||
                            (booking.roomId && booking.roomId.substring(0, 8)) ||
                            'N/A';
                          return (
                            <option key={booking._id} value={booking._id}>
                              Booking #{booking._id?.substring(0, 8)} - Room {roomLabel}
                            </option>
                          );
                        })}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Room ID</label>
                  <input
                    type="text"
                    value={checkinForm.roomId}
                    readOnly
                    className="w-full rounded-sm border px-4 py-3 text-sm bg-gray-50 text-gray-700 cursor-not-allowed border-gray-300 font-light"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !checkinForm.bookingId}
                  className={submitButtonClasses}
                  style={{ backgroundColor: customStyles.gold[600] }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                >
                  {loading ? 'Processing...' : 'Check-in Guest'}
                </button>
              </form>
            </div>
          )}
          
          {activeTab === 'checkout' && (
            <div className="bg-white rounded-sm border p-6 shadow-sm backdrop-blur-sm max-w-xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <FaSignOut className="text-xl" style={{ color: customStyles.gold[600] }} />
                <h3 className="text-xl font-light text-gray-900">Check-out Guest</h3>
              </div>
              <form onSubmit={handleCheckout} className="space-y-6">
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Select Booking *</label>
                  <select
                    value={checkoutForm.bookingId}
                    onChange={(e) => {
                      const booking = Array.isArray(bookings)
                        ? bookings.find((b) => b._id === e.target.value)
                        : null;
                      setCheckoutForm({
                        bookingId: e.target.value,
                        roomId: booking?.roomId || ''
                      });
                    }}
                    className={selectClasses}
                    required
                    style={{ borderColor: customStyles.navy[200] }}
                  >
                    <option value="">Select a booking</option>
                    {Array.isArray(bookings) &&
                      bookings
                        .filter((b) => b.bookingStatus === 'checked-in')
                        .map((booking) => {
                          const room = Array.isArray(rooms)
                            ? rooms.find((r) => r._id === booking.roomId)
                            : null;
                          const roomLabel =
                            (room && room.roomNumber) ||
                            (booking.roomId && booking.roomId.substring(0, 8)) ||
                            'N/A';
                          return (
                            <option key={booking._id} value={booking._id}>
                              Booking #{booking._id?.substring(0, 8)} - Room {roomLabel}
                            </option>
                          );
                        })}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Room ID</label>
                  <input
                    type="text"
                    value={checkoutForm.roomId}
                    readOnly
                    className="w-full rounded-sm border px-4 py-3 text-sm bg-gray-50 text-gray-700 cursor-not-allowed border-gray-300 font-light"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Extra Charges ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={checkoutForm.extraCharges}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        extraCharges: parseFloat(e.target.value) || 0
                      })
                    }
                    className={inputClasses}
                    style={{ borderColor: customStyles.navy[200] }}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !checkoutForm.bookingId}
                  className={submitButtonClasses}
                  style={{ backgroundColor: customStyles.gold[600] }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                >
                  {loading ? 'Processing...' : 'Check-out Guest'}
                </button>
              </form>
            </div>
          )}
          
          {activeTab === 'generateBill' && (
            <div className="bg-white rounded-sm border p-6 shadow-sm backdrop-blur-sm max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <FaFileInvoiceDollar className="text-xl" style={{ color: customStyles.gold[600] }} />
                <h3 className="text-xl font-light text-gray-900">Generate Bill</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <form onSubmit={handleGenerateBill} className="space-y-6">
                    <div>
                      <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Select Booking *</label>
                      <select
                        value={billForm.bookingId}
                        onChange={(e) =>
                          setBillForm({ ...billForm, bookingId: e.target.value })
                        }
                        className={selectClasses}
                        required
                        style={{ borderColor: customStyles.navy[200] }}
                      >
                        <option value="">Select a booking</option>
                        {Array.isArray(bookings) &&
                          bookings
                            .filter((b) => b.bookingStatus === 'checked-out')
                            .map((booking) => {
                              const room = Array.isArray(rooms)
                                ? rooms.find((r) => r._id === booking.roomId)
                                : null;
                              const roomLabel =
                                (room && room.roomNumber) ||
                                (booking.roomId && booking.roomId.substring(0, 8)) ||
                                'N/A';
                              return (
                                <option key={booking._id} value={booking._id}>
                                  Booking #{booking._id?.substring(0, 8)} - Room {roomLabel}
                                </option>
                              );
                            })}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Room Charges ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={billForm.roomCharges}
                        onChange={(e) =>
                          setBillForm({
                            ...billForm,
                            roomCharges: parseFloat(e.target.value) || 0
                          })
                        }
                        className={inputClasses}
                        required
                        style={{ borderColor: customStyles.navy[200] }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Service Charges ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={billForm.serviceCharges}
                        onChange={(e) =>
                          setBillForm({
                            ...billForm,
                            serviceCharges: parseFloat(e.target.value) || 0
                          })
                        }
                        className={inputClasses}
                        style={{ borderColor: customStyles.navy[200] }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Tax (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          step="0.1"
                          value={billForm.tax}
                          onChange={(e) =>
                            setBillForm({
                              ...billForm,
                              tax: parseFloat(e.target.value) || 0
                            })
                          }
                          className={inputClasses}
                          style={{ borderColor: customStyles.navy[200] }}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Discount (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={billForm.discount}
                          onChange={(e) =>
                            setBillForm({
                              ...billForm,
                              discount: parseFloat(e.target.value) || 0
                            })
                          }
                          className={inputClasses}
                          style={{ borderColor: customStyles.navy[200] }}
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className={submitButtonClasses}
                      style={{ backgroundColor: customStyles.gold[600] }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                    >
                      {loading ? 'Generating...' : 'Generate Bill'}
                    </button>
                  </form>
                </div>

                {lastInvoice && (
                  <div className="bg-white rounded-sm border p-6 shadow-sm" style={{ borderColor: customStyles.navy[200] }}>
                    <h4 className="text-lg font-light text-gray-900 mb-4">
                      Invoice <span style={{ color: customStyles.navy[900] }}>Preview</span>
                    </h4>
                    <div className="space-y-6">
                      <div>
                        <div className="flex flex-wrap justify-between mb-4">
                          <div>
                            <p className="font-light" style={{ color: customStyles.navy[900] }}>LuxuryStay Hospitality</p>
                            <p className="text-gray-600 font-light text-sm">Hotel Management System</p>
                          </div>
                          <div className="text-right">
                            <p className="font-light text-sm"><span className="font-normal">Invoice Date:</span> {new Date().toLocaleDateString()}</p>
                            <p className="font-light text-sm">
                              <span className="font-normal">Booking #:</span>{" "}
                              {lastInvoice.booking?._id?.substring(0, 8) || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4 p-4 rounded-sm" style={{ backgroundColor: customStyles.navy[50] }}>
                          <p className="font-light text-sm mb-2" style={{ color: customStyles.navy[900] }}>Guest Details</p>
                          <p className="text-gray-700 font-light text-sm">
                            Name: {currentGuest?.fullName || "N/A"}
                          </p>
                          <p className="text-gray-700 font-light text-sm">
                            Email: {currentGuest?.email || "N/A"}
                          </p>
                          <p className="text-gray-700 font-light text-sm">
                            Contact: {currentGuest?.phone || "N/A"}
                          </p>
                          <p className="text-gray-700 font-light text-sm">
                            Room Number: {currentRoom?.roomNumber || "N/A"}
                          </p>
                        </div>

                        <div className="p-4 rounded-sm" style={{ backgroundColor: customStyles.gold[50] }}>
                          <p className="font-light text-sm mb-3" style={{ color: customStyles.navy[900] }}>Charges Breakdown</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-light">Room & Service Subtotal</span>
                              <span className="font-light">${lastInvoice.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="font-light">Tax ({lastInvoice.taxRate}%)</span>
                              <span className="font-light">${lastInvoice.taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="font-light">Discount ({lastInvoice.discountRate}%)</span>
                              <span className="font-light">- ${lastInvoice.discountAmount.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-dashed border-gray-300 my-2" />
                            <div className="flex justify-between text-base font-light" style={{ color: customStyles.navy[900] }}>
                              <span>Total Amount</span>
                              <span>${lastInvoice.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between mt-4 gap-3">
                        <p className="text-xs text-gray-500 font-light">
                          This invoice can be printed or saved as PDF.
                        </p>
                        <button
                          type="button"
                          onClick={handlePrintInvoice}
                          className="px-4 py-2.5 text-sm font-medium rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase"
                          style={{ 
                            backgroundColor: customStyles.navy[900],
                            color: 'white'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.navy[800]}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.navy[900]}
                        >
                          <span className="flex items-center gap-2">
                            <FaPrint />
                            Print Invoice
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'viewGuests' && (() => {
            const guestsArray = Array.isArray(guests) ? guests : [];
            const guestBookings = selectedGuest && Array.isArray(bookings)
              ? bookings.filter(b => isSameId(b.guestId, selectedGuest._id))
              : [];
            const guestPayments = selectedGuest && Array.isArray(payments)
              ? payments.filter(p => 
                  isSameId(p.userId, selectedGuest._id) || 
                  isSameId(p.guestId, selectedGuest._id)
                )
              : [];
            const guestServiceRequests = selectedGuest && Array.isArray(serviceRequests)
              ? serviceRequests.filter(sr => isSameId(sr.userId, selectedGuest._id))
              : [];

            return (
              <div className="space-y-8">
                <div className={tableContainerClasses}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-light text-gray-900 mb-2">
                        All Guests <span className="text-sm font-normal" style={{ color: customStyles.gold[600] }}>({guestsArray.length})</span>
                      </h3>
                    </div>
                    <button
                      onClick={fetchGuests}
                      disabled={loading}
                      className={smallButtonClasses}
                      style={{ 
                        backgroundColor: customStyles.gold[600],
                        color: 'white'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                    >
                      {loading ? 'Loading...' : 'Refresh'}
                    </button>
                  </div>
                  <div className="mt-2">
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
                          {guestsArray.map((guest) => (
                            <div 
                              key={guest._id}
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
                                      {guest.fullName}
                                    </h4>
                                    <p className="text-sm text-gray-600 font-light">{guest.email}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-700 font-light flex items-center gap-2">
                                  <FaIdCard className="text-gray-500" /> {guest.idType || 'ID'}: {guest.idNumber || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-700 font-light flex items-center gap-2">
                                  <FaClock className="text-gray-500" /> {guest.phone || 'N/A'}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-700 font-light">
                                    <span className="text-xs font-light tracking-wider px-2 py-1 rounded-sm"
                                      style={{ 
                                        backgroundColor: `${customStyles.gold[600]}20`,
                                        color: customStyles.gold[700]
                                      }}
                                    >
                                      {guest.status || 'active'}
                                    </span>
                                  </span>
                                  <button
                                    className="group flex items-center gap-2 px-3 py-2 text-xs font-light tracking-wider uppercase rounded-sm border transition-all duration-300"
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
                                    onClick={() => setSelectedGuest(guest)}
                                  >
                                    <FaEye />
                                    View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {selectedGuest && (
                  <div className={tableContainerClasses}>
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
              </div>
            );
          })()}
          
          {activeTab === 'viewRooms' && (
            <div className={tableContainerClasses}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">
                    All Rooms <span className="text-sm font-normal" style={{ color: customStyles.gold[600] }}>({Array.isArray(rooms) ? rooms.length : 0})</span>
                  </h3>
                </div>
                <button
                  onClick={fetchRooms}
                  disabled={loading}
                  className={smallButtonClasses}
                  style={{ 
                    backgroundColor: customStyles.gold[600],
                    color: 'white'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
              {loading ? (
                <div className="py-20 text-center">
                  <div className="mx-auto w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin" style={{ borderColor: customStyles.gold[600] }}></div>
                  <p className="mt-4 text-gray-600 font-light">Loading rooms...</p>
                </div>
              ) : !Array.isArray(rooms) || rooms.length === 0 ? (
                <div className="text-center py-12">
                  <FaBed className="text-4xl mx-auto mb-4" style={{ color: customStyles.navy[300] }} />
                  <p className="text-gray-600 font-light">No rooms found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {rooms.map((room) => (
                    <div
                      key={room._id}
                      className="rounded-sm border p-5 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300"
                      style={{ borderColor: customStyles.navy[200] }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ 
                              backgroundColor: `${customStyles.gold[600]}20`,
                              color: customStyles.gold[700]
                            }}
                          >
                            <FaBed className="text-lg" />
                          </div>
                          <div>
                            <h4 className="text-base font-light" style={{ color: customStyles.navy[900] }}>
                              Room {room.roomNumber}
                            </h4>
                            <p className="text-sm text-gray-600 font-light">{room.roomType}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-700 font-light">
                          <span className="font-normal" style={{ color: customStyles.gold[700] }}>${room.pricePerNight || 0}</span> / night
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-light tracking-wider px-2 py-1 rounded-sm ${
                            room.roomStatus === 'available'
                              ? 'bg-green-100 text-green-800'
                              : room.roomStatus === 'occupied'
                              ? 'bg-red-100 text-red-800'
                              : room.roomStatus === 'cleaning'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {room.roomStatus || 'available'}
                          </span>
                          <span className={`text-xs font-light tracking-wider px-2 py-1 rounded-sm ${
                            room.isAvailable ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {room.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'viewBookings' && (
            <div className={tableContainerClasses}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">
                    All Bookings <span className="text-sm font-normal" style={{ color: customStyles.gold[600] }}>({Array.isArray(bookings) ? bookings.length : 0})</span>
                  </h3>
                </div>
                <button
                  onClick={fetchBookings}
                  disabled={loading}
                  className={smallButtonClasses}
                  style={{ 
                    backgroundColor: customStyles.gold[600],
                    color: 'white'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
              <div className="mt-2">
                {loading ? (
                  <div className="py-20 text-center">
                    <div className="mx-auto w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin" style={{ borderColor: customStyles.gold[600] }}></div>
                    <p className="mt-4 text-gray-600 font-light">Loading bookings...</p>
                  </div>
                ) : !Array.isArray(bookings) || bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <FaCalendarCheck className="text-4xl mx-auto mb-4" style={{ color: customStyles.navy[300] }} />
                    <p className="text-gray-600 font-light">No bookings found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => (
                      <div 
                        key={booking._id}
                        className="rounded-sm border p-5 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300"
                        style={{ borderColor: customStyles.navy[200] }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-light"
                              style={{ 
                                backgroundColor: `${customStyles.navy[600]}20`,
                                color: customStyles.navy[700]
                              }}
                            >
                              #{booking._id?.substring(0, 6) || 'N/A'}
                            </div>
                            <div>
                              <h4 className="text-base font-light" style={{ color: customStyles.navy[900] }}>
                                Guest: {booking.guestId?.substring(0, 8) || 'N/A'}
                              </h4>
                              <p className="text-sm text-gray-600 font-light">Room: {booking.roomId?.substring(0, 8) || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 font-light">Check-in:</span>
                            <span className="font-light">
                              {booking.checkinDate
                                ? new Date(booking.checkinDate).toLocaleDateString()
                                : 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 font-light">Check-out:</span>
                            <span className="font-light">
                              {booking.checkoutDate
                                ? new Date(booking.checkoutDate).toLocaleDateString()
                                : 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-light tracking-wider px-2 py-1 rounded-sm ${
                              booking.bookingStatus === 'confirmed'
                                ? 'bg-blue-100 text-blue-800'
                                : booking.bookingStatus === 'checked-in'
                                ? 'bg-green-100 text-green-800'
                                : booking.bookingStatus === 'checked-out'
                                ? 'bg-yellow-100 text-yellow-800'
                                : booking.bookingStatus === 'pending'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {booking.bookingStatus}
                            </span>
                            <span className="text-xs text-gray-600 font-light">
                              Guests: {booking.guestsCount || 1}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
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
              Reception Dashboard v1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
  
export default ReceptionDashboard;
