import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaTachometerAlt,
  FaUsers,
  FaBed,
  FaCalendarAlt,
  FaDollarSign,
  FaStar,
  FaConciergeBell,
  FaCog,
  FaSignOutAlt,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaPlus,
  FaSyncAlt,
  FaChartLine,
  FaHotel,
  FaUserCheck,
  FaMoneyBillWave,
  FaCommentDots,
  FaBell,
  FaChevronRight,
  FaUserCircle,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import FormStatus from '../component/FormStatus';
import { API_URL } from '../config/api';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
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
    remarks: ''
  });
  const [newServiceRequest, setNewServiceRequest] = useState({
    userId: '',
    roomNumber: '',
    serviceType: 'room_cleaning',
    description: '',
    priority: 'normal',
    status: 'pending'
  });

  const [settingsForm, setSettingsForm] = useState({
    defaultTaxRate: 10,
    defaultDiscountRate: 0
  });

  // Edit states
  const [editingUser, setEditingUser] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });
  const [user] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
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
  
  const inputClasses = "w-full rounded-sm border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 font-light transition-all duration-300 bg-white/80 backdrop-blur-sm";
  const textareaClasses = "w-full rounded-sm border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 font-light resize-y transition-all duration-300 bg-white/80 backdrop-blur-sm min-h-[100px]";
  const selectClasses = "w-full rounded-sm border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 font-light transition-all duration-300 bg-white/80 backdrop-blur-sm";
  const smallSelectClasses = "rounded-sm border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 font-light transition-all duration-300";
  const cardClasses = "rounded-sm border bg-white/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg transition-all duration-500";
  const roomTypeOptions = [
    "Single",
    "Double",
    "Deluxe",
    "Suite",
    "Family",
    "Presidential"
  ];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

  const isValidEmail = (value) => {
    const email = (value || '').trim();
    if (!email) {
      return false;
    }
    return emailRegex.test(email);
  };

  const isValidPhone = (value) => {
    const phone = (value || '').trim();
    if (!phone) {
      return true;
    }
    return phoneRegex.test(phone);
  };

  const validateUserData = (data, options = {}) => {
    const requirePassword = options.requirePassword || false;

    if (!data.fullName || !data.fullName.trim()) {
      setError('Full name is required');
      setSuccess('');
      return false;
    }

    if (!data.username || !data.username.trim()) {
      setError('Username is required');
      setSuccess('');
      return false;
    }

    if (!isValidEmail(data.email)) {
      setError('Please enter a valid email address');
      setSuccess('');
      return false;
    }

    if (requirePassword) {
      if (!data.password || data.password.length < 6) {
        setError('Password must be at least 6 characters');
        setSuccess('');
        return false;
      }
    }

    if (!isValidPhone(data.phone)) {
      setError('Please enter a valid phone number');
      setSuccess('');
      return false;
    }

    if (!data.role) {
      setError('Role is required');
      setSuccess('');
      return false;
    }

    return true;
  };

  const validateRoomData = (data) => {
    if (!String(data.roomNumber || '').trim()) {
      setError('Room number is required');
      setSuccess('');
      return false;
    }

    if (!data.roomType || !String(data.roomType).trim()) {
      setError('Room type is required');
      setSuccess('');
      return false;
    }

    const bedCount = parseInt(data.bedCount, 10);
    if (!Number.isFinite(bedCount) || bedCount < 1) {
      setError('Bed count must be at least 1');
      setSuccess('');
      return false;
    }

    const price = parseFloat(data.pricePerNight);
    if (!Number.isFinite(price) || price <= 0) {
      setError('Price per night must be greater than zero');
      setSuccess('');
      return false;
    }

    return true;
  };

  const validateBookingData = (data) => {
    if (!data.guestId || !data.roomId) {
      setError('Guest and room are required for a booking');
      setSuccess('');
      return false;
    }

    if (!data.checkinDate || !data.checkoutDate) {
      setError('Check-in and check-out dates are required');
      setSuccess('');
      return false;
    }

    const checkin = new Date(data.checkinDate);
    const checkout = new Date(data.checkoutDate);

    if (Number.isNaN(checkin.getTime()) || Number.isNaN(checkout.getTime())) {
      setError('Please enter valid booking dates');
      setSuccess('');
      return false;
    }

    if (checkout <= checkin) {
      setError('Check-out date must be after check-in date');
      setSuccess('');
      return false;
    }

    return true;
  };

  const validatePaymentData = (data) => {
    if (!data.userId || !data.bookingId) {
      setError('User and booking are required for a payment');
      setSuccess('');
      return false;
    }

    const amount = parseFloat(data.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Payment amount must be greater than zero');
      setSuccess('');
      return false;
    }

    return true;
  };

  const validateReviewData = (data) => {
    if (!data.remarks || !data.remarks.trim()) {
      setError('Review remarks cannot be empty');
      setSuccess('');
      return false;
    }

    if (data.remarks.trim().length < 5) {
      setError('Review remarks must be at least 5 characters');
      setSuccess('');
      return false;
    }

    return true;
  };

  const validateServiceRequestData = (data) => {
    if (!data.userId) {
      setError('User is required for a service request');
      setSuccess('');
      return false;
    }

    if (!data.roomNumber || !String(data.roomNumber).trim()) {
      setError('Room number is required for a service request');
      setSuccess('');
      return false;
    }

    if (!data.serviceType || !String(data.serviceType).trim()) {
      setError('Service type is required');
      setSuccess('');
      return false;
    }

    if (!data.description || !data.description.trim()) {
      setError('Service description cannot be empty');
      setSuccess('');
      return false;
    }

    return true;
  };

  const validateSettingsForm = () => {
    const tax = parseFloat(settingsForm.defaultTaxRate);
    const discount = parseFloat(settingsForm.defaultDiscountRate);

    if (!Number.isFinite(tax) || tax < 0 || tax > 50) {
      setError('Default tax rate must be between 0 and 50');
      setSuccess('');
      return false;
    }

    if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
      setError('Default discount rate must be between 0 and 100');
      setSuccess('');
      return false;
    }

    return true;
  };

  const fetchAllData = useCallback(async () => {
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
      setRooms(roomsData.findRooms || []);

      // Fetch bookings
      const bookingsRes = await fetch(`${API_URL}/booking/all-bookings`, { headers });
      const bookingsData = await bookingsRes.json();
      setBookings(Array.isArray(bookingsData?.allBookings) ? bookingsData.allBookings :
        Array.isArray(bookingsData) ? bookingsData : []);

      // Fetch payments
      const paymentsRes = await fetch(`${API_URL}/payment/get-all-payments`, { headers });
      const paymentsData = await paymentsRes.json();
      setPayments(Array.isArray(paymentsData?.payments) ? paymentsData.payments :
        Array.isArray(paymentsData) ? paymentsData : []);

      // Fetch reviews
      const reviewsRes = await fetch(`${API_URL}/reviews/get-all-reviews`, { headers });
      const reviewsData = await reviewsRes.json();
      setReviews(Array.isArray(reviewsData?.getReviews) ? reviewsData.getReviews :
        Array.isArray(reviewsData) ? reviewsData : []);

      const servicesRes = await fetch(`${API_URL}/service-requests`, { headers });
      const servicesData = await servicesRes.json();
      setServiceRequests(Array.isArray(servicesData?.serviceRequests) ? servicesData.serviceRequests :
        Array.isArray(servicesData) ? servicesData : []);

      const contactRes = await fetch(`${API_URL}/contact-messages`, { headers });
      const contactData = await contactRes.json();
      const messagesArray = Array.isArray(contactData?.messages)
        ? contactData.messages
        : Array.isArray(contactData)
        ? contactData
        : [];
      setContactMessages(messagesArray);

      const settingsRes = await fetch(`${API_URL}/settings`, { headers });
      const settingsData = await settingsRes.json();
      const settingsObj = settingsData?.settings || settingsData;

      if (settingsObj) {
        const defaultTaxRate = typeof settingsObj.defaultTaxRate === 'number'
          ? settingsObj.defaultTaxRate
          : parseFloat(settingsObj.defaultTaxRate) || 0;

        const defaultDiscountRate = typeof settingsObj.defaultDiscountRate === 'number'
          ? settingsObj.defaultDiscountRate
          : parseFloat(settingsObj.defaultDiscountRate) || 0;

        setSettingsForm(prev => ({
          ...prev,
          defaultTaxRate,
          defaultDiscountRate
        }));
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchTabData = useCallback(async (tab) => {
    setLoading(true);
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      switch (tab) {
        case 'users': {
          const usersRes = await fetch(`${API_URL}/get-all-users`, { headers });
          const usersData = await usersRes.json();
          setUsers(Array.isArray(usersData?.allUsers) ? usersData.allUsers :
            Array.isArray(usersData) ? usersData : []);
          break;
        }

        case 'rooms': {
          const roomsRes = await fetch(`${API_URL}/room/all-rooms`, { headers });
          const roomsData = await roomsRes.json();
          setRooms(roomsData.findRooms || []);
          break;
        }

        case 'bookings': {
          const bookingsRes = await fetch(`${API_URL}/booking/all-bookings`, { headers });
          const bookingsData = await bookingsRes.json();
          setBookings(Array.isArray(bookingsData?.allBookings) ? bookingsData.allBookings :
            Array.isArray(bookingsData) ? bookingsData : []);
          break;
        }

        case 'payments': {
          const paymentsRes = await fetch(`${API_URL}/payment/get-all-payments`, { headers });
          const paymentsData = await paymentsRes.json();
          setPayments(Array.isArray(paymentsData?.payments) ? paymentsData.payments :
            Array.isArray(paymentsData) ? paymentsData : []);
          break;
        }

        case 'reviews': {
          const reviewsRes = await fetch(`${API_URL}/reviews/get-all-reviews`, { headers });
          const reviewsData = await reviewsRes.json();
          setReviews(Array.isArray(reviewsData?.getReviews) ? reviewsData.getReviews :
            Array.isArray(reviewsData) ? reviewsData : []);
          break;
        }

        case 'services': {
          const servicesRes = await fetch(`${API_URL}/service-requests`, { headers });
          const servicesData = await servicesRes.json();
          setServiceRequests(Array.isArray(servicesData?.serviceRequests) ? servicesData.serviceRequests :
            Array.isArray(servicesData) ? servicesData : []);
          break;
        }

        case 'settings': {
          const settingsRes = await fetch(`${API_URL}/settings`, { headers });
          const settingsData = await settingsRes.json();
          const settingsObj = settingsData?.settings || settingsData;

          const contactRes = await fetch(`${API_URL}/contact-messages`, { headers });
          const contactData = await contactRes.json();
          const messagesArray = Array.isArray(contactData?.messages)
            ? contactData.messages
            : Array.isArray(contactData)
            ? contactData
            : [];

          setContactMessages(messagesArray);

          if (settingsObj) {
            const defaultTaxRate = typeof settingsObj.defaultTaxRate === 'number'
              ? settingsObj.defaultTaxRate
              : parseFloat(settingsObj.defaultTaxRate) || 0;

            const defaultDiscountRate = typeof settingsObj.defaultDiscountRate === 'number'
              ? settingsObj.defaultDiscountRate
              : parseFloat(settingsObj.defaultDiscountRate) || 0;

            setSettingsForm(prev => ({
              ...prev,
              defaultTaxRate,
              defaultDiscountRate
            }));
          }

          break;
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [token]);

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
      refreshData(); // Refresh all data after successful operation
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Calculate dashboard statistics
  const calculateDashboardStats = () => {
    const paymentsArray = Array.isArray(payments) ? payments : [];
    const bookingsArray = Array.isArray(bookings) ? bookings : [];
    const roomsArray = Array.isArray(rooms) ? rooms : [];
    const serviceRequestsArray = Array.isArray(serviceRequests) ? serviceRequests : [];
    const usersArray = Array.isArray(users) ? users : [];
    const reviewsArray = Array.isArray(reviews) ? reviews : [];

    // Total Cost - Sum of ALL payments
    const totalCost = paymentsArray.reduce((sum, p) => {
      const amount = parseFloat(p.amount) || 0;
      return sum + amount;
    }, 0);

    // Revenue Earned - Only from "completed" payments
    const revenueEarned = paymentsArray.reduce((sum, p) => {
      const amount = parseFloat(p.amount) || 0;
      return p.status === 'completed' ? sum + amount : sum;
    }, 0);

    const activeBookings = bookingsArray.filter(b =>
      b.bookingStatus === 'confirmed' ||
      b.bookingStatus === 'checked-in' ||
      b.bookingStatus === 'pending'
    ).length;

    const pendingPayments = paymentsArray.filter(p => p.status === 'pending').length;
    const completedPayments = paymentsArray.filter(p => p.status === 'completed').length;
    const pendingServiceRequests = serviceRequestsArray.filter(sr => sr.status === 'pending').length;

    const availableRooms = roomsArray.filter(r =>
      r.roomStatus === 'available'
    ).length;

    const totalRooms = roomsArray.length || 0;
    const occupancyRate = totalRooms > 0 ? ((activeBookings / totalRooms) * 100) : 0;

    const totalRoomNights = bookingsArray.reduce((nights, booking) => {
      if (!booking.checkinDate || !booking.checkoutDate) {
        return nights;
      }

      const checkin = new Date(booking.checkinDate);
      const checkout = new Date(booking.checkoutDate);
      const diffTime = checkout.getTime() - checkin.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (!Number.isFinite(diffDays) || diffDays <= 0) {
        return nights;
      }

      return nights + diffDays;
    }, 0);

    const averageDailyRate = totalRoomNights > 0 ? revenueEarned / totalRoomNights : 0;
    const revenuePerAvailableRoom = totalRooms > 0 ? revenueEarned / totalRooms : 0;

    return {
      totalUsers: usersArray.length,
      totalRooms,
      activeBookings,
      occupancyRate,
      totalCost,
      revenueEarned,
      pendingRevenue: totalCost - revenueEarned,
      pendingPayments,
      completedPayments,
      pendingServiceRequests,
      availableRooms,
      totalReviews: reviewsArray.length,
      totalRoomNights,
      averageDailyRate,
      revenuePerAvailableRoom
    };
  };

  // Get user name by ID
  const getUserName = (userId) => {
    if (!userId) return 'Unknown User';
    
    if (typeof userId === 'object') {
      return userId.fullName || `User ${userId._id?.slice(-6)}`;
    }
    
    const userObj = Array.isArray(users) ? users.find(u => u._id === userId) : null;
    return userObj ? userObj.fullName : `User ${userId?.slice(-6)}`;
  };

  const isSameId = (a, b) => {
    if (!a || !b) return false;
    const aVal = typeof a === 'object' ? a._id : a;
    const bVal = typeof b === 'object' ? b._id : b;
    if (!aVal || !bVal) return false;
    return String(aVal) === String(bVal);
  };

  const renderSelectedGuestDetails = () => {
    if (!selectedGuest) return null;

    const guestBookings = Array.isArray(bookings)
      ? bookings.filter(b => isSameId(b.guestId, selectedGuest._id))
      : [];
    const guestPayments = Array.isArray(payments)
      ? payments.filter(p => 
          isSameId(p.userId, selectedGuest._id) ||
          isSameId(p.guestId, selectedGuest._id)
        )
      : [];
    const guestServiceRequests = Array.isArray(serviceRequests)
      ? serviceRequests.filter(sr => isSameId(sr.userId, selectedGuest._id))
      : [];

    return (
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
    );
  };

  // Get booking ID safely
  // Get latest bookings with user info
  const getLatestBookings = () => {
    if (!Array.isArray(bookings) || bookings.length === 0) {
      return [];
    }
    
    return bookings
      .sort((a, b) => new Date(b.createdAt || b.checkinDate) - new Date(a.createdAt || a.checkinDate))
      .slice(0, 3)
      .map(booking => ({
        id: booking._id?.slice(-6) || 'N/A',
        userName: getUserName(booking.guestId),
        status: booking.bookingStatus || 'unknown',
        price: booking.totalAmount || 'N/A'
      }));
  };

  // Get latest payments
  const getLatestPayments = () => {
    if (!Array.isArray(payments) || payments.length === 0) {
      return [];
    }
    
    return payments
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map(payment => ({
        id: payment._id?.slice(-6) || 'N/A',
        amount: payment.amount || 0,
        status: payment.status || 'unknown',
        userName: getUserName(payment.userId)
      }));
  };

  // CRUD for Users
  const createUser = async (e) => {
    e.preventDefault();
    if (!validateUserData(newUser, { requirePassword: true })) {
      return;
    }
    await apiCall('POST', '/register', newUser);
    setNewUser({ fullName: '', username: '', email: '', password: '', phone: '', role: 'guest', status: 'active' });
  };

  const updateUser = async (e) => {
    e.preventDefault();
    if (!validateUserData(editingUser || {}, { requirePassword: false })) {
      return;
    }
    await apiCall('PUT', `/update/${editingUser._id}`, editingUser);
    setEditingUser(null);
  };

  const deleteUser = (id) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete User',
      message: 'Are you sure you want to delete this user?',
      onConfirm: async () => {
        await apiCall('DELETE', `/delete-user/${id}`);
      }
    });
  };

  // CRUD for Rooms
  const createRoom = async (e) => {
    e.preventDefault();
    if (!validateRoomData(newRoom)) {
      return;
    }
    await apiCall('POST', '/room/create-room', newRoom);
    setNewRoom({ roomNumber: '', roomType: '', floor: '', bedCount: 1, hasAC: false, hasWIFI: false, hasTV: '', pricePerNight: '', isAvailable: true, roomStatus: 'available' });
  };

  const updateRoom = async (e) => {
    e.preventDefault();
    if (!validateRoomData(editingRoom || {})) {
      return;
    }
    await apiCall('PUT', `/room/update-room/${editingRoom._id}`, editingRoom);
    setEditingRoom(null);
  };

  const deleteRoom = (id) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Room',
      message: 'Are you sure you want to delete this room?',
      onConfirm: async () => {
        await apiCall('DELETE', `/room/delete-room/${id}`);
      }
    });
  };

  // CRUD for Bookings
  const createBooking = async (e) => {
    e.preventDefault();
    if (!validateBookingData(newBooking)) {
      return;
    }
    await apiCall('POST', '/booking/create-booking', newBooking);
    setNewBooking({ guestId: '', roomId: '', bookingDate: '', checkinDate: '', checkoutDate: '', bookingStatus: 'pending' });
  };

  const updateBookingStatus = async (id, status) => {
    await apiCall('PUT', `/booking/update-booking-status/${id}`, { bookingStatus: status });
  };

  // CRUD for Payments
  const createPayment = async (e) => {
    e.preventDefault();
    if (!validatePaymentData(newPayment)) {
      return;
    }
    await apiCall('POST', '/payment/process-payment', newPayment);
    setNewPayment({ userId: '', bookingId: '', roomId: '', amount: 0, paymentMethod: 'cash', status: 'pending' });
  };

  const updatePaymentStatus = async (id, status) => {
    await apiCall('PUT', `/payment/update-payment-status/${id}`, { status });
  };

  // CRUD for Reviews
  const updateReviewStatus = async (id, status) => {
    await apiCall('PUT', `/reviews/update-review-status/${id}`, { status });
  };

  const createReview = async (e) => {
    e.preventDefault();
    if (!validateReviewData(newReview)) {
      return;
    }
    const payload = {
      userId: user?._id,
      remarks: newReview.remarks
    };
    if (!payload.userId) {
      setError('Admin user information is missing');
      setSuccess('');
      return;
    }
    await apiCall('POST', '/reviews/create-review', payload);
    setNewReview({ remarks: '' });
  };

  const deleteReview = (id) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Review',
      message: 'Are you sure you want to delete this review?',
      onConfirm: async () => {
        await apiCall('DELETE', `/reviews/delete-review/${id}`);
      }
    });
  };

  // CRUD for Service Requests
  const createServiceRequest = async (e) => {
    e.preventDefault();
    if (!validateServiceRequestData(newServiceRequest)) {
      return;
    }
    await apiCall('POST', '/service-requests/create', newServiceRequest);
    setNewServiceRequest({ userId: '', roomNumber: '', serviceType: 'room_cleaning', description: '', priority: 'normal', status: 'pending' });
  };

  const updateServiceStatus = async (id, status) => {
    await apiCall('PUT', `/service-requests/${id}/status`, { status });
  };

  const updateSettings = async (e) => {
    e.preventDefault();
    if (!validateSettingsForm()) {
      return;
    }

    const payload = {
      defaultTaxRate: parseFloat(settingsForm.defaultTaxRate) || 0,
      defaultDiscountRate: parseFloat(settingsForm.defaultDiscountRate) || 0
    };

    await apiCall('PUT', '/settings', payload);
  };

  const deleteContactMessage = (id) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Contact Message',
      message: 'Are you sure you want to delete this contact message?',
      onConfirm: async () => {
        await apiCall('DELETE', `/contact-messages/${id}`);
      }
    });
  };

  const handleConfirmDelete = async () => {
    if (confirmState.onConfirm) {
      await confirmState.onConfirm();
    }
    setConfirmState({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null
    });
  };

  const handleCancelDelete = () => {
    setConfirmState({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null
    });
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
        const stats = calculateDashboardStats();
        const latestBookings = getLatestBookings();
        const latestPayments = getLatestPayments();

        return (
          <div className="space-y-8">
            {/* Welcome Header */}
            <div className={cardClasses}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-2xl font-serif font-light text-gray-900 mb-2">
                    Welcome, <span style={{ color: customStyles.gold[600] }}>{user.fullName}</span>
                  </h1>
                  <p className="text-gray-600 font-light">
                    Hotel Management System Dashboard
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

            {renderSelectedGuestDetails()}

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
                    <FaUserCheck className="text-xl" style={{ color: customStyles.navy[600] }} />
                  </div>
                  <span 
                    className="text-xs font-light tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${customStyles.navy[600]}20`,
                      color: customStyles.navy[700]
                    }}
                  >
                    +12.5%
                  </span>
                </div>
                <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">Total Users</p>
                <p className="text-2xl font-light" style={{ color: customStyles.navy[900] }}>{stats.totalUsers}</p>
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
                    <FaHotel className="text-xl" style={{ color: customStyles.gold[600] }} />
                  </div>
                  <span 
                    className="text-xs font-light tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${customStyles.gold[600]}20`,
                      color: customStyles.gold[700]
                    }}
                  >
                    {stats.occupancyRate.toFixed(1)}% Occupancy
                  </span>
                </div>
                <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">Total Rooms</p>
                <p className="text-2xl font-light" style={{ color: customStyles.navy[900] }}>{stats.totalRooms}</p>
                <p className="text-xs text-gray-600 font-light mt-2">Available: {stats.availableRooms}</p>
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
                    <FaCalendarAlt className="text-xl" style={{ color: customStyles.navy[600] }} />
                  </div>
                  <span 
                    className="text-xs font-light tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${customStyles.navy[600]}20`,
                      color: customStyles.navy[700]
                    }}
                  >
                    Active
                  </span>
                </div>
                <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">Active Bookings</p>
                <p className="text-2xl font-light" style={{ color: customStyles.navy[900] }}>{stats.activeBookings}</p>
                <p className="text-xs text-gray-600 font-light mt-2">Total: {bookings.length || 0}</p>
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
                    <FaMoneyBillWave className="text-xl" style={{ color: customStyles.gold[600] }} />
                  </div>
                  <span 
                    className="text-xs font-light tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${customStyles.gold[600]}20`,
                      color: customStyles.gold[700]
                    }}
                  >
                    +18.7%
                  </span>
                </div>
                <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">Revenue Earned</p>
                <p className="text-2xl font-light" style={{ color: customStyles.navy[900] }}>${stats.revenueEarned.toFixed(2)}</p>
                <p className="text-xs text-gray-600 font-light mt-2">Total: ${stats.totalCost.toFixed(2)}</p>
              </div>
            </div>

            {/* Financial Overview */}
            <div className={cardClasses}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-light text-gray-900">
                  Financial <span style={{ color: customStyles.navy[900] }}>Overview</span>
                </h3>
                <button 
                  onClick={() => setActiveTab('payments')}
                  className="group flex items-center gap-2 text-sm font-light tracking-wider uppercase"
                  style={{ color: customStyles.navy[900] }}
                  onMouseEnter={(e) => e.currentTarget.style.color = customStyles.gold[700]}
                  onMouseLeave={(e) => e.currentTarget.style.color = customStyles.navy[900]}
                >
                  View All
                  <FaChevronRight className="transform group-hover:translate-x-1 transition-transform duration-300 text-xs" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-5 rounded-sm" style={{ backgroundColor: customStyles.navy[50] }}>
                  <div className="text-lg font-light mb-2" style={{ color: customStyles.navy[900] }}>
                    ${stats.revenueEarned.toFixed(2)}
                  </div>
                  <p className="text-xs font-light tracking-widest uppercase text-gray-600">Completed Payments</p>
                  <p className="text-xs text-gray-600 font-light mt-2">Count: {stats.completedPayments}</p>
                </div>
                
                <div className="text-center p-5 rounded-sm" style={{ backgroundColor: customStyles.gold[50] }}>
                  <div className="text-lg font-light mb-2" style={{ color: customStyles.gold[700] }}>
                    ${stats.pendingRevenue.toFixed(2)}
                  </div>
                  <p className="text-xs font-light tracking-widest uppercase text-gray-600">Pending Revenue</p>
                  <p className="text-xs text-gray-600 font-light mt-2">Count: {stats.pendingPayments}</p>
                </div>
                
                <div className="text-center p-5 rounded-sm" style={{ backgroundColor: customStyles.navy[50] }}>
                  <div className="text-lg font-light mb-2" style={{ color: customStyles.navy[900] }}>
                    ${stats.averageDailyRate.toFixed(2)}
                  </div>
                  <p className="text-xs font-light tracking-widest uppercase text-gray-600">Avg Daily Rate</p>
                  <p className="text-xs text-gray-600 font-light mt-2">Room Nights: {stats.totalRoomNights}</p>
                </div>
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
                
                {latestBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 font-light">No recent bookings</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {latestBookings.map((booking, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-4 rounded-sm border transition-all duration-300 hover:bg-white/50"
                        style={{ borderColor: customStyles.navy[200] }}
                      >
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-light"
                              style={{ 
                                backgroundColor: `${customStyles.navy[600]}20`,
                                color: customStyles.navy[700]
                              }}
                            >
                              {booking.id}
                            </div>
                            <div>
                              <p className="text-sm font-light" style={{ color: customStyles.navy[900] }}>{booking.userName}</p>
                              <p className="text-xs text-gray-600 font-light">${booking.price}</p>
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-light tracking-wider ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={cardClasses}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-light text-gray-900">
                    Recent <span style={{ color: customStyles.navy[900] }}>Payments</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('payments')}
                    className="group flex items-center gap-2 text-sm font-light tracking-wider uppercase"
                    style={{ color: customStyles.navy[900] }}
                    onMouseEnter={(e) => e.currentTarget.style.color = customStyles.gold[700]}
                    onMouseLeave={(e) => e.currentTarget.style.color = customStyles.navy[900]}
                  >
                    View All
                    <FaChevronRight className="transform group-hover:translate-x-1 transition-transform duration-300 text-xs" />
                  </button>
                </div>
                
                {latestPayments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 font-light">No recent payments</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {latestPayments.map((payment, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-4 rounded-sm border transition-all duration-300 hover:bg-white/50"
                        style={{ borderColor: customStyles.navy[200] }}
                      >
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-light"
                              style={{ 
                                backgroundColor: `${customStyles.gold[600]}20`,
                                color: customStyles.gold[700]
                              }}
                            >
                              ${payment.amount}
                            </div>
                            <div>
                              <p className="text-sm font-light" style={{ color: customStyles.navy[900] }}>{payment.userName}</p>
                              <p className="text-xs text-gray-600 font-light">Payment #{payment.id}</p>
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-light tracking-wider ${
                          payment.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }

      case 'users':
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-serif font-light text-gray-900 mb-2">
                  Manage <span style={{ color: customStyles.navy[900] }}>Users</span>
                </h2>
                <p className="text-gray-600 font-light">
                  Administer user accounts and permissions
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
                  Refresh
                </button>
              </div>
            </div>

            {editingUser ? (
              <form onSubmit={updateUser} className={cardClasses}>
                <div className="flex items-center gap-3 mb-6">
                  <FaEdit className="text-xl" style={{ color: customStyles.gold[600] }} />
                  <h3 className="text-xl font-light text-gray-900">Edit User</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Full Name</label>
                    <input
                      className={inputClasses}
                      placeholder="Full Name"
                      value={editingUser.fullName}
                      onChange={e => {
                        const raw = e.target.value;
                        const sanitized = raw.replace(/[^a-zA-Z\s.'-]/g, '');
                        setEditingUser({ ...editingUser, fullName: sanitized });
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Username</label>
                    <input
                      className={inputClasses}
                      placeholder="Username"
                      value={editingUser.username}
                      onChange={e => setEditingUser({ ...editingUser, username: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Email</label>
                    <input
                      className={inputClasses}
                      type="email"
                      placeholder="Email"
                      value={editingUser.email}
                      onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Phone</label>
                    <input
                      className={inputClasses}
                      placeholder="Phone"
                      value={editingUser.phone}
                      onChange={e => {
                        const raw = e.target.value;
                        const sanitized = raw.replace(/[^0-9+\-\s()]/g, '');
                        setEditingUser({ ...editingUser, phone: sanitized });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Role</label>
                    <select
                      className={selectClasses}
                      value={editingUser.role}
                      onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                    >
                      <option value="guest">Guest</option>
                      <option value="admin">Admin</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="manager">Manager</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Status</label>
                    <select
                      className={selectClasses}
                      value={editingUser.status}
                      onChange={e => setEditingUser({ ...editingUser, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
                <div className="mt-8 flex gap-4">
                  <button 
                    type="submit" 
                    className="group px-6 py-3 text-sm font-medium text-white rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase relative overflow-hidden"
                    style={{ backgroundColor: customStyles.gold[600] }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                  >
                    Update User
                  </button>
                  <button
                    type="button"
                    className="px-6 py-3 text-sm font-medium rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase border"
                    style={{ 
                      borderColor: customStyles.navy[900],
                      color: customStyles.navy[900]
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = customStyles.navy[900];
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = customStyles.navy[900];
                    }}
                    onClick={() => setEditingUser(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={createUser} className={cardClasses}>
                <div className="flex items-center gap-3 mb-6">
                  <FaPlus className="text-xl" style={{ color: customStyles.gold[600] }} />
                  <h3 className="text-xl font-light text-gray-900">Create New User</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Full Name</label>
                    <input
                      className={inputClasses}
                      placeholder="Full Name"
                      value={newUser.fullName}
                      onChange={e => {
                        const raw = e.target.value;
                        const sanitized = raw.replace(/[^a-zA-Z\s.'-]/g, '');
                        setNewUser({ ...newUser, fullName: sanitized });
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Username</label>
                    <input
                      className={inputClasses}
                      placeholder="Username"
                      value={newUser.username}
                      onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Email</label>
                    <input
                      className={inputClasses}
                      type="email"
                      placeholder="Email"
                      value={newUser.email}
                      onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Password</label>
                    <input
                      className={inputClasses}
                      type="password"
                      placeholder="Password"
                      value={newUser.password}
                      onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Phone</label>
                    <input
                      className={inputClasses}
                      placeholder="Phone"
                      value={newUser.phone}
                      onChange={e => {
                        const raw = e.target.value;
                        const sanitized = raw.replace(/[^0-9+\-\s()]/g, '');
                        setNewUser({ ...newUser, phone: sanitized });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Role</label>
                    <select
                      className={selectClasses}
                      value={newUser.role}
                      onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                    >
                      <option value="guest">Guest</option>
                      <option value="admin">Admin</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="manager">Manager</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="group mt-8 px-6 py-3 text-sm font-medium text-white rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase relative overflow-hidden"
                  style={{ backgroundColor: customStyles.gold[600] }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                >
                  Create User
                </button>
              </form>
            )}

            <div className={cardClasses}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">
                    All Users <span className="text-sm font-normal" style={{ color: customStyles.gold[600] }}>({Array.isArray(users) ? users.length : 0})</span>
                  </h3>
                </div>
              </div>
              
              {loading ? (
                <div className="py-20 text-center">
                  <div className="mx-auto w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin" style={{ borderColor: customStyles.gold[600] }}></div>
                  <p className="mt-4 text-gray-600 font-light">Loading users...</p>
                </div>
              ) : !Array.isArray(users) || users.length === 0 ? (
                <div className="text-center py-12">
                  <FaUsers className="text-4xl mx-auto mb-4" style={{ color: customStyles.navy[300] }} />
                  <p className="text-gray-600 font-light">No users found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map(u => (
                    <div 
                      key={u._id} 
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
                          <FaUserCircle className="text-xl" />
                        </div>
                        <div>
                          <h4 className="text-base font-light mb-1" style={{ color: customStyles.navy[900] }}>
                            {u.fullName}
                          </h4>
                          <p className="text-sm text-gray-600 font-light">{u.email}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs font-light tracking-wider px-2 py-1 rounded-sm"
                              style={{ 
                                backgroundColor: `${customStyles.gold[600]}20`,
                                color: customStyles.gold[700]
                              }}
                            >
                              {u.role}
                            </span>
                            <span className={`text-xs font-light tracking-wider px-2 py-1 rounded-sm ${
                              u.status === 'active' 
                                ? 'bg-green-100 text-green-800'
                                : u.status === 'inactive'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {u.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {(u.role === 'guest' || u.role === 'user') && (
                          <button
                            className="group/btn flex items-center gap-2 px-3 py-2 text-sm font-light tracking-wider uppercase rounded-sm transition-all duration-300"
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
                            onClick={() => setSelectedGuest(u)}
                          >
                            <FaEye /> View Details
                          </button>
                        )}
                        <button
                          className="group/btn flex items-center gap-2 px-3 py-2 text-sm font-light tracking-wider uppercase rounded-sm transition-all duration-300"
                          style={{ 
                            borderColor: customStyles.gold[600],
                            color: customStyles.gold[600]
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = customStyles.gold[600];
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = customStyles.gold[600];
                          }}
                          onClick={() => setEditingUser({ ...u })}
                        >
                          <FaEdit /> Edit
                        </button>
                        <select
                          className={smallSelectClasses}
                          value={u.status}
                          onChange={e =>
                            apiCall('PUT', `/update-status/${u._id}`, {
                              status: e.target.value
                            })
                          }
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                        <button
                          className="group/btn flex items-center gap-2 px-3 py-2 text-sm font-light tracking-wider uppercase rounded-sm transition-all duration-300"
                          style={{ 
                            borderColor: '#DC2626',
                            color: '#DC2626'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#DC2626';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#DC2626';
                          }}
                          onClick={() => deleteUser(u._id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {renderSelectedGuestDetails()}
          </div>
        );

      case 'rooms':
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-serif font-light text-gray-900 mb-2">
                  Manage <span style={{ color: customStyles.navy[900] }}>Rooms</span>
                </h2>
                <p className="text-gray-600 font-light">
                  Administer hotel rooms and availability
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
                  Refresh
                </button>
              </div>
            </div>

            {editingRoom ? (
              <form onSubmit={updateRoom} className={cardClasses}>
                <div className="flex items-center gap-3 mb-6">
                  <FaEdit className="text-xl" style={{ color: customStyles.gold[600] }} />
                  <h3 className="text-xl font-light text-gray-900">Edit Room</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Room Number</label>
                    <input
                      className={inputClasses}
                      placeholder="Room Number"
                      value={editingRoom.roomNumber}
                      onChange={e => {
                        const raw = e.target.value;
                        const sanitized = raw.replace(/[^0-9]/g, '');
                        setEditingRoom({ ...editingRoom, roomNumber: sanitized });
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Room Type</label>
                    <select
                      className={selectClasses}
                      value={editingRoom.roomType}
                      onChange={e => setEditingRoom({ ...editingRoom, roomType: e.target.value })}
                      required
                    >
                      <option value="">Select Room Type</option>
                      {roomTypeOptions.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Price per Night</label>
                    <input
                      className={inputClasses}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Price per Night"
                      value={editingRoom.pricePerNight}
                      onChange={e =>
                        setEditingRoom({ ...editingRoom, pricePerNight: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Status</label>
                    <select
                      className={selectClasses}
                      value={editingRoom.roomStatus}
                      onChange={e => setEditingRoom({ ...editingRoom, roomStatus: e.target.value })}
                    >
                      <option value="available">Available</option>
                      <option value="booked">Booked</option>
                      <option value="under maintenance">Under Maintenance</option>
                      <option value="cleaning">Cleaning</option>
                    </select>
                  </div>
                </div>
                <div className="mt-8 flex gap-4">
                  <button 
                    type="submit" 
                    className="group px-6 py-3 text-sm font-medium text-white rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase relative overflow-hidden"
                    style={{ backgroundColor: customStyles.gold[600] }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                  >
                    Update Room
                  </button>
                  <button
                    type="button"
                    className="px-6 py-3 text-sm font-medium rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase border"
                    style={{ 
                      borderColor: customStyles.navy[900],
                      color: customStyles.navy[900]
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = customStyles.navy[900];
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = customStyles.navy[900];
                    }}
                    onClick={() => setEditingRoom(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={createRoom} className={cardClasses}>
                <div className="flex items-center gap-3 mb-6">
                  <FaPlus className="text-xl" style={{ color: customStyles.gold[600] }} />
                  <h3 className="text-xl font-light text-gray-900">Create New Room</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Room Number</label>
                    <input
                      className={inputClasses}
                      placeholder="Room Number"
                      value={newRoom.roomNumber}
                      onChange={e => {
                        const raw = e.target.value;
                        const sanitized = raw.replace(/[^0-9]/g, '');
                        setNewRoom({ ...newRoom, roomNumber: sanitized });
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Room Type</label>
                    <select
                      className={selectClasses}
                      value={newRoom.roomType}
                      onChange={e => setNewRoom({ ...newRoom, roomType: e.target.value })}
                      required
                    >
                      <option value="">Select Room Type</option>
                      {roomTypeOptions.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Price per Night</label>
                    <input
                      className={inputClasses}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Price per Night"
                      value={newRoom.pricePerNight}
                      onChange={e => setNewRoom({ ...newRoom, pricePerNight: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Status</label>
                    <select
                      className={selectClasses}
                      value={newRoom.roomStatus}
                      onChange={e => setNewRoom({ ...newRoom, roomStatus: e.target.value })}
                    >
                      <option value="available">Available</option>
                      <option value="booked">Booked</option>
                      <option value="under maintenance">Under Maintenance</option>
                      <option value="cleaning">Cleaning</option>
                    </select>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="group mt-8 px-6 py-3 text-sm font-medium text-white rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase relative overflow-hidden"
                  style={{ backgroundColor: customStyles.gold[600] }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                >
                  Create Room
                </button>
              </form>
            )}

            <div className={cardClasses}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">
                    All Rooms <span className="text-sm font-normal" style={{ color: customStyles.gold[600] }}>({Array.isArray(rooms) ? rooms.length : 0})</span>
                  </h3>
                </div>
              </div>
              
              {loading ? (
                <div className="py-20 text-center">
                  <div className="mx-auto w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin" style={{ borderColor: customStyles.gold[600] }}></div>
                  <p className="mt-4 text-gray-600 font-light">Loading rooms...</p>
                </div>
              ) : !Array.isArray(rooms) ? (
                <div className="text-center py-12">
                  <FaExclamationCircle className="text-4xl mx-auto mb-4" style={{ color: '#DC2626' }} />
                  <p className="text-gray-600 font-light">Error loading rooms</p>
                </div>
              ) : rooms.length === 0 ? (
                <div className="text-center py-12">
                  <FaBed className="text-4xl mx-auto mb-4" style={{ color: customStyles.navy[300] }} />
                  <p className="text-gray-600 font-light">No rooms found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rooms.map(r => (
                    <div 
                      key={r._id} 
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
                          <FaBed className="text-xl" />
                        </div>
                        <div>
                          <h4 className="text-base font-light mb-1" style={{ color: customStyles.navy[900] }}>
                            Room {r.roomNumber || 'N/A'}
                          </h4>
                          <p className="text-sm text-gray-600 font-light">Type: {r.roomType || 'Not specified'}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs font-light px-2 py-1 rounded-sm"
                              style={{ 
                                backgroundColor: `${customStyles.navy[600]}20`,
                                color: customStyles.navy[700]
                              }}
                            >
                              ${r.pricePerNight || '0'}/night
                            </span>
                            <span className={`text-xs font-light tracking-wider px-2 py-1 rounded-sm ${
                              r.roomStatus === 'available' 
                                ? 'bg-green-100 text-green-800'
                                : r.roomStatus === 'booked'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {r.roomStatus || 'unknown'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          className="group/btn flex items-center gap-2 px-3 py-2 text-sm font-light tracking-wider uppercase rounded-sm transition-all duration-300"
                          style={{ 
                            borderColor: customStyles.gold[600],
                            color: customStyles.gold[600]
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = customStyles.gold[600];
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = customStyles.gold[600];
                          }}
                          onClick={() => setEditingRoom({ ...r })}
                        >
                          <FaEdit /> Edit
                        </button>
                        <select
                          className={smallSelectClasses}
                          value={r.roomStatus || 'available'}
                          onChange={e =>
                            apiCall('PUT', `/room/update-room-status/${r._id}`, {
                              status: e.target.value
                            })
                          }
                        >
                          <option value="available">Available</option>
                          <option value="occupied">Occupied</option>
                          <option value="booked">Booked</option>
                          <option value="under maintenance">Under Maintenance</option>
                          <option value="cleaning">Cleaning</option>
                        </select>
                        <button
                          className="group/btn flex items-center gap-2 px-3 py-2 text-sm font-light tracking-wider uppercase rounded-sm transition-all duration-300"
                          style={{ 
                            borderColor: '#DC2626',
                            color: '#DC2626'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#DC2626';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#DC2626';
                          }}
                          onClick={() => deleteRoom(r._id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'bookings':
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

            <form onSubmit={createBooking} className={cardClasses}>
              <div className="flex items-center gap-3 mb-6">
                <FaPlus className="text-xl" style={{ color: customStyles.gold[600] }} />
                <h3 className="text-xl font-light text-gray-900">Create New Booking</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Guest</label>
                  <select
                    className={selectClasses}
                    value={newBooking.guestId}
                    onChange={e => setNewBooking({ ...newBooking, guestId: e.target.value })}
                    required
                  >
                    <option value="">Select a guest</option>
                    {Array.isArray(users) &&
                      users
                        .filter(u => u.role === 'guest' || u.role === 'user')
                        .map(u => (
                          <option key={u._id} value={u._id}>
                            {u.fullName || u.username || u.email} ({u.email || u.username || u._id?.slice(-6)})
                          </option>
                        ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Room</label>
                  <select
                    className={selectClasses}
                    value={newBooking.roomId}
                    onChange={e => setNewBooking({ ...newBooking, roomId: e.target.value })}
                    required
                  >
                    <option value="">Select a room</option>
                    {Array.isArray(rooms) &&
                      rooms
                        .filter(room => room.isAvailable)
                        .map(room => (
                          <option key={room._id} value={room._id}>
                            Room {room.roomNumber} - {room.roomType} (${room.pricePerNight || 'N/A'}/night)
                          </option>
                        ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Check-in Date</label>
                  <input
                    className={inputClasses}
                    type="date"
                    placeholder="Check-in Date"
                    value={newBooking.checkinDate}
                    onChange={e => setNewBooking({ ...newBooking, checkinDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Check-out Date</label>
                  <input
                    className={inputClasses}
                    type="date"
                    placeholder="Check-out Date"
                    value={newBooking.checkoutDate}
                    onChange={e => setNewBooking({ ...newBooking, checkoutDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Status</label>
                  <select
                    className={selectClasses}
                    value={newBooking.bookingStatus}
                    onChange={e => setNewBooking({ ...newBooking, bookingStatus: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked-in">Checked-in</option>
                    <option value="checked-out">Checked-out</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <button 
                type="submit" 
                className="group mt-8 px-6 py-3 text-sm font-medium text-white rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase relative overflow-hidden"
                style={{ backgroundColor: customStyles.gold[600] }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
              >
                Create Booking
              </button>
            </form>

            <div className={cardClasses}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">
                    All Bookings <span className="text-sm font-normal" style={{ color: customStyles.gold[600] }}>({Array.isArray(bookings) ? bookings.length : 0})</span>
                  </h3>
                </div>
              </div>
              
              {loading ? (
                <div className="py-20 text-center">
                  <div className="mx-auto w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin" style={{ borderColor: customStyles.gold[600] }}></div>
                  <p className="mt-4 text-gray-600 font-light">Loading bookings...</p>
                </div>
              ) : !Array.isArray(bookings) || bookings.length === 0 ? (
                <div className="text-center py-12">
                  <FaCalendarAlt className="text-4xl mx-auto mb-4" style={{ color: customStyles.navy[300] }} />
                  <p className="text-gray-600 font-light">No bookings found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map(b => (
                    <div 
                      key={b._id} 
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
                          <span className="text-xs font-light">#{b._id?.slice(-6)}</span>
                        </div>
                        <div>
                          <h4 className="text-base font-light mb-1" style={{ color: customStyles.navy[900] }}>
                            {getUserName(b.guestId)}
                          </h4>
                          <p className="text-sm text-gray-600 font-light">Room: {b.roomId}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs font-light px-2 py-1 rounded-sm bg-gray-100 text-gray-800">
                              Check-in: {new Date(b.checkinDate).toLocaleDateString()}
                            </span>
                            <span className="text-xs font-light px-2 py-1 rounded-sm bg-gray-100 text-gray-800">
                              Check-out: {new Date(b.checkoutDate).toLocaleDateString()}
                            </span>
                            <span className={`text-xs font-light tracking-wider px-2 py-1 rounded-sm ${
                              b.bookingStatus === 'confirmed' 
                                ? 'bg-green-100 text-green-800'
                                : b.bookingStatus === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : b.bookingStatus === 'checked-in'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {b.bookingStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <select
                          className={smallSelectClasses}
                          value={b.bookingStatus}
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

      case 'payments':
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-serif font-light text-gray-900 mb-2">
                  Manage <span style={{ color: customStyles.navy[900] }}>Payments</span>
                </h2>
                <p className="text-gray-600 font-light">
                  Administer hotel payments and transactions
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
                  Refresh
                </button>
              </div>
            </div>

            <form onSubmit={createPayment} className={cardClasses}>
              <div className="flex items-center gap-3 mb-6">
                <FaPlus className="text-xl" style={{ color: customStyles.gold[600] }} />
                <h3 className="text-xl font-light text-gray-900">Create New Payment</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Guest</label>
                  <select
                    className={selectClasses}
                    value={newPayment.userId}
                    onChange={e => setNewPayment({ ...newPayment, userId: e.target.value })}
                    required
                  >
                    <option value="">Select a guest</option>
                    {Array.isArray(users) &&
                      users
                        .filter(u => u.role === 'guest' || u.role === 'user')
                        .map(u => (
                          <option key={u._id} value={u._id}>
                            {u.fullName || u.username || u.email} ({u.email || u.username || u._id?.slice(-6)})
                          </option>
                        ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Booking</label>
                  <select
                    className={selectClasses}
                    value={newPayment.bookingId}
                    onChange={e => setNewPayment({ ...newPayment, bookingId: e.target.value })}
                    required
                  >
                    <option value="">Select a booking</option>
                    {Array.isArray(bookings) &&
                      bookings.map(b => {
                        const room = Array.isArray(rooms)
                          ? rooms.find(r => r._id === b.roomId)
                          : null;
                        return (
                          <option key={b._id} value={b._id}>
                            Booking #{b._id?.slice(-6)} - Room {room?.roomNumber || 'N/A'} - {getUserName(b.guestId)}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Amount</label>
                  <input
                    className={inputClasses}
                    type="number"
                    placeholder="Amount"
                    value={newPayment.amount}
                    onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Payment Method</label>
                  <select
                    className={selectClasses}
                    value={newPayment.paymentMethod}
                    onChange={e => setNewPayment({ ...newPayment, paymentMethod: e.target.value })}
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="cheque">Cheque</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="online">Online</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Status</label>
                  <select
                    className={selectClasses}
                    value={newPayment.status}
                    onChange={e => setNewPayment({ ...newPayment, status: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
              <button 
                type="submit" 
                className="group mt-8 px-6 py-3 text-sm font-medium text-white rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase relative overflow-hidden"
                style={{ backgroundColor: customStyles.gold[600] }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
              >
                Create Payment
              </button>
            </form>

            <div className={cardClasses}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">
                    All Payments <span className="text-sm font-normal" style={{ color: customStyles.gold[600] }}>({Array.isArray(payments) ? payments.length : 0})</span>
                  </h3>
                </div>
              </div>
              
              {loading ? (
                <div className="py-20 text-center">
                  <div className="mx-auto w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin" style={{ borderColor: customStyles.gold[600] }}></div>
                  <p className="mt-4 text-gray-600 font-light">Loading payments...</p>
                </div>
              ) : !Array.isArray(payments) || payments.length === 0 ? (
                <div className="text-center py-12">
                  <FaDollarSign className="text-4xl mx-auto mb-4" style={{ color: customStyles.navy[300] }} />
                  <p className="text-gray-600 font-light">No payments found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payments.map(p => (
                    <div 
                      key={p._id} 
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
                          <span className="text-sm font-light">${p.amount}</span>
                        </div>
                        <div>
                          <h4 className="text-base font-light mb-1" style={{ color: customStyles.navy[900] }}>
                            Payment #{p._id?.slice(-6)}
                          </h4>
                          <p className="text-sm text-gray-600 font-light">User: {getUserName(p.userId)}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs font-light px-2 py-1 rounded-sm bg-gray-100 text-gray-800">
                              {p.paymentMethod}
                            </span>
                            <span className={`text-xs font-light tracking-wider px-2 py-1 rounded-sm ${
                              p.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : p.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {p.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <select
                          className={smallSelectClasses}
                          value={p.status}
                          onChange={e => updatePaymentStatus(p._id, e.target.value)}
                        >
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
              )}
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-serif font-light text-gray-900 mb-2">
                  Manage <span style={{ color: customStyles.navy[900] }}>Reviews</span>
                </h2>
                <p className="text-gray-600 font-light">
                  Administer guest reviews and feedback
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
                  Refresh
                </button>
              </div>
            </div>

            <form onSubmit={createReview} className={cardClasses}>
              <div className="flex items-center gap-3 mb-6">
                <FaPlus className="text-xl" style={{ color: customStyles.gold[600] }} />
                <h3 className="text-xl font-light text-gray-900">Create New Review</h3>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Remarks</label>
                  <textarea
                    className={textareaClasses}
                    placeholder="Remarks"
                    value={newReview.remarks}
                    onChange={e => setNewReview({ ...newReview, remarks: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="group mt-8 px-6 py-3 text-sm font-medium text-white rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase relative overflow-hidden"
                style={{ backgroundColor: customStyles.gold[600] }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
              >
                Create Review
              </button>
            </form>

            <div className={cardClasses}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">
                    All Reviews <span className="text-sm font-normal" style={{ color: customStyles.gold[600] }}>({Array.isArray(reviews) ? reviews.length : 0})</span>
                  </h3>
                </div>
              </div>
              
              {loading ? (
                <div className="py-20 text-center">
                  <div className="mx-auto w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin" style={{ borderColor: customStyles.gold[600] }}></div>
                  <p className="mt-4 text-gray-600 font-light">Loading reviews...</p>
                </div>
              ) : !Array.isArray(reviews) || reviews.length === 0 ? (
                <div className="text-center py-12">
                  <FaStar className="text-4xl mx-auto mb-4" style={{ color: customStyles.navy[300] }} />
                  <p className="text-gray-600 font-light">No reviews found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(r => (
                    <div 
                      key={r._id} 
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
                          <FaUserCircle className="text-xl" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-light mb-2" style={{ color: customStyles.navy[900] }}>
                            Review #{r._id?.slice(-6)}
                          </h4>
                          <p className="text-sm text-gray-700 font-light mb-3">{r.remarks}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-light text-gray-600">
                              User: {getUserName(r.userId)}
                            </span>
                            <span className="text-xs font-light text-gray-600">
                              {new Date(r.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-3">
                            <span
                              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-sm"
                              style={{
                                backgroundColor:
                                  r.status === 'approved'
                                    ? `${customStyles.gold[600]}20`
                                    : `${customStyles.navy[200]}40`,
                                color:
                                  r.status === 'approved'
                                    ? customStyles.gold[700]
                                    : customStyles.navy[700]
                              }}
                            >
                              {r.status === 'approved' ? 'Approved by Admin' : 'Pending Approval'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {r.status !== 'approved' && (
                          <button
                            className="group/btn flex items-center gap-2 px-3 py-2 text-sm font-light tracking-wider uppercase rounded-sm transition-all duration-300 mr-2"
                            style={{ 
                              borderColor: customStyles.gold[600],
                              color: customStyles.gold[700]
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = customStyles.gold[600];
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = customStyles.gold[700];
                            }}
                            onClick={() => updateReviewStatus(r._id, 'approved')}
                          >
                            <FaCheckCircle /> Confirm
                          </button>
                        )}
                        <button
                          className="group/btn flex items-center gap-2 px-3 py-2 text-sm font-light tracking-wider uppercase rounded-sm transition-all duration-300"
                          style={{ 
                            borderColor: '#DC2626',
                            color: '#DC2626'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#DC2626';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#DC2626';
                          }}
                          onClick={() => deleteReview(r._id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-serif font-light text-gray-900 mb-2">
                  Manage <span style={{ color: customStyles.navy[900] }}>Services</span>
                </h2>
                <p className="text-gray-600 font-light">
                  Administer service requests
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
                  Refresh
                </button>
              </div>
            </div>

            <form onSubmit={createServiceRequest} className={cardClasses}>
              <div className="flex items-center gap-3 mb-6">
                <FaPlus className="text-xl" style={{ color: customStyles.gold[600] }} />
                <h3 className="text-xl font-light text-gray-900">Create New Service Request</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Room</label>
                  <select
                    className={selectClasses}
                    value={newServiceRequest.roomNumber}
                    onChange={e =>
                      setNewServiceRequest({ ...newServiceRequest, roomNumber: e.target.value })
                    }
                    required
                  >
                    <option value="">Select a room</option>
                    {Array.isArray(rooms) &&
                      rooms.map(room => (
                        <option key={room._id} value={room.roomNumber}>
                          Room {room.roomNumber} - {room.roomType} ({room.roomStatus})
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Service Type</label>
                  <select
                    className={selectClasses}
                    value={newServiceRequest.serviceType}
                    onChange={e =>
                      setNewServiceRequest({ ...newServiceRequest, serviceType: e.target.value })
                    }
                  >
                    <option value="room_cleaning">Room Cleaning</option>
                    <option value="food_service">Food Service</option>
                    <option value="laundry">Laundry</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="wakeup_call">Wakeup Call</option>
                    <option value="transport">Transport</option>
                    <option value="housekeeping">Housekeeping</option>
                    <option value="room_service">Room Service</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Priority</label>
                  <select
                    className={selectClasses}
                    value={newServiceRequest.priority}
                    onChange={e =>
                      setNewServiceRequest({ ...newServiceRequest, priority: e.target.value })
                    }
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Description</label>
                  <textarea
                    className={textareaClasses}
                    placeholder="Description"
                    value={newServiceRequest.description}
                    onChange={e =>
                      setNewServiceRequest({ ...newServiceRequest, description: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="group mt-8 px-6 py-3 text-sm font-medium text-white rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase relative overflow-hidden"
                style={{ backgroundColor: customStyles.gold[600] }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
              >
                Create Request
              </button>
            </form>

            <div className={cardClasses}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">
                    All Service Requests <span className="text-sm font-normal" style={{ color: customStyles.gold[600] }}>({Array.isArray(serviceRequests) ? serviceRequests.length : 0})</span>
                  </h3>
                </div>
              </div>
              
              {loading ? (
                <div className="py-20 text-center">
                  <div className="mx-auto w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin" style={{ borderColor: customStyles.gold[600] }}></div>
                  <p className="mt-4 text-gray-600 font-light">Loading service requests...</p>
                </div>
              ) : !Array.isArray(serviceRequests) || serviceRequests.length === 0 ? (
                <div className="text-center py-12">
                  <FaConciergeBell className="text-4xl mx-auto mb-4" style={{ color: customStyles.navy[300] }} />
                  <p className="text-gray-600 font-light">No service requests found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {serviceRequests.map(sr => (
                    <div 
                      key={sr._id} 
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
                          <FaConciergeBell className="text-xl" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-light mb-1" style={{ color: customStyles.navy[900] }}>
                            {sr.serviceType || 'Unknown Service'}
                          </h4>
                          <p className="text-sm text-gray-600 font-light mb-2">Room: {sr.roomNumber || 'N/A'}</p>
                          <p className="text-sm text-gray-700 font-light mb-3">{sr.description || 'No description'}</p>
                          <div className="flex items-center gap-4">
                            <span className={`text-xs font-light tracking-wider px-2 py-1 rounded-sm ${
                              sr.priority === 'urgent' 
                                ? 'bg-red-100 text-red-800'
                                : sr.priority === 'high'
                                ? 'bg-orange-100 text-orange-800'
                                : sr.priority === 'normal'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {sr.priority}
                            </span>
                            <span className={`text-xs font-light tracking-wider px-2 py-1 rounded-sm ${
                              sr.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : sr.status === 'in_progress'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {sr.status || 'pending'}
                            </span>
                            <span className="text-xs font-light text-gray-600">
                              User: {getUserName(sr.userId)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <select
                          className={smallSelectClasses}
                          value={sr.status || 'pending'}
                          onChange={e => updateServiceStatus(sr._id, e.target.value)}
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

      case 'settings':
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-serif font-light text-gray-900 mb-2">
                  System <span style={{ color: customStyles.navy[900] }}>Settings</span>
                </h2>
                <p className="text-gray-600 font-light">
                  Configure hotel management system settings
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
                  Refresh
                </button>
              </div>
            </div>

            <form onSubmit={updateSettings} className={cardClasses}>
              <div className="flex items-center gap-3 mb-6">
                <FaCog className="text-xl" style={{ color: customStyles.gold[600] }} />
                <h3 className="text-xl font-light text-gray-900">Billing Defaults</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Default Tax Rate (%)</label>
                  <input
                    className={inputClasses}
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={settingsForm.defaultTaxRate}
                    onChange={e =>
                      setSettingsForm({
                        ...settingsForm,
                        defaultTaxRate: parseFloat(e.target.value) || 0
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">Default Discount Rate (%)</label>
                  <input
                    className={inputClasses}
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={settingsForm.defaultDiscountRate}
                    onChange={e =>
                      setSettingsForm({
                        ...settingsForm,
                        defaultDiscountRate: parseFloat(e.target.value) || 0
                      })
                    }
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="group mt-8 px-6 py-3 text-sm font-medium text-white rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase relative overflow-hidden"
                style={{ backgroundColor: customStyles.gold[600] }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
              >
                Save Settings
              </button>
            </form>

            <div className={cardClasses}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">
                    Contact Messages <span className="text-sm font-normal" style={{ color: customStyles.gold[600] }}>({Array.isArray(contactMessages) ? contactMessages.length : 0})</span>
                  </h3>
                  <p className="text-gray-600 font-light text-sm">
                    Messages sent from the public contact page
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="py-20 text-center">
                  <div className="mx-auto w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin" style={{ borderColor: customStyles.gold[600] }}></div>
                  <p className="mt-4 text-gray-600 font-light">Loading contact messages...</p>
                </div>
              ) : !Array.isArray(contactMessages) || contactMessages.length === 0 ? (
                <div className="text-center py-12">
                  <FaCommentDots className="text-4xl mx-auto mb-4" style={{ color: customStyles.navy[300] }} />
                  <p className="text-gray-600 font-light">No contact messages found</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                  {contactMessages.map(msg => (
                    <div
                      key={msg._id}
                      className="group p-5 rounded-sm border transition-all duration-300 hover:bg-white/70 hover:shadow-md"
                      style={{ borderColor: customStyles.navy[200] }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-base font-light" style={{ color: customStyles.navy[900] }}>
                              {msg.subject || 'Contact Message'}
                            </h4>
                            <span className="text-xs font-light text-gray-500">
                              {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 font-light mb-2">
                            {msg.message}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                            <span className="font-medium">
                              {msg.name}
                            </span>
                            <span>•</span>
                            <span>{msg.email}</span>
                            {msg.phone && (
                              <>
                                <span>•</span>
                                <span>{msg.phone}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <button
                          className="flex items-center gap-2 px-3 py-2 text-xs font-light tracking-wider uppercase rounded-sm transition-all duration-300"
                          style={{
                            borderColor: '#DC2626',
                            color: '#DC2626',
                            borderWidth: '1px',
                            borderStyle: 'solid'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#DC2626';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#DC2626';
                          }}
                          onClick={() => deleteContactMessage(msg._id)}
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

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
    { id: 'users', label: 'Users', icon: <FaUsers /> },
    { id: 'rooms', label: 'Rooms', icon: <FaBed /> },
    { id: 'bookings', label: 'Bookings', icon: <FaCalendarAlt /> },
    { id: 'payments', label: 'Payments', icon: <FaDollarSign /> },
    { id: 'reviews', label: 'Reviews', icon: <FaStar /> },
    { id: 'services', label: 'Services', icon: <FaConciergeBell /> },
    { id: 'settings', label: 'Settings', icon: <FaCog /> },
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
                Hotel <span style={{ color: customStyles.gold[500] }}>Admin</span> Dashboard
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
                    Role: {user?.role}
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
              Admin Dashboard v1.0.0
            </p>
          </div>
        </div>
      </div>

      {confirmState.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-sm shadow-lg max-w-sm w-full mx-4 p-6">
            <h3 className="text-lg font-light mb-2" style={{ color: customStyles.navy[900] }}>
              {confirmState.title}
            </h3>
            <p className="text-sm text-gray-600 font-light mb-6">
              {confirmState.message}
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-xs font-light tracking-wider uppercase rounded-sm border transition-all duration-300"
                style={{
                  borderColor: customStyles.navy[300],
                  color: customStyles.navy[700],
                  backgroundColor: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = customStyles.navy[50];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-xs font-light tracking-wider uppercase rounded-sm border transition-all duration-300"
                style={{
                  borderColor: '#DC2626',
                  backgroundColor: '#DC2626',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#B91C1C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#DC2626';
                }}
                onClick={handleConfirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
