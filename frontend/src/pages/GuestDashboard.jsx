import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaDollarSign, 
  FaStar, 
  FaChartLine, 
  FaBed, 
  FaConciergeBell, 
  FaUtensils,
  FaBell,
  FaCog,
  FaChevronRight,
  FaUserCircle,
  FaArrowUp,
  FaArrowDown,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaSwimmingPool,
  FaWifi,
  FaParking,
  FaSpa,
  FaWineGlassAlt,
  FaKey,
  FaClipboardList,
  FaCommentAlt,
  FaTools,
  FaSignOutAlt,
  FaHome,
  FaEye,
  FaPlus,
  FaList,
  FaEdit,
  FaUser
} from 'react-icons/fa';
import FormStatus from '../component/FormStatus';
import { API_URL } from '../config/api';

function GuestDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("viewRooms");
  const [rooms, setRooms] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [myServiceRequests, setMyServiceRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    username: "",
    phone: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    preferences: ""
  });

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    roomId: "",
    bookingDate: "",
    checkinDate: "",
    checkoutDate: "",
  });

  // Service request form state
  const [serviceForm, setServiceForm] = useState({
    serviceType: "",
    description: "",
    roomNumber: "",
    priority: "",
  });

  // Feedback form state
  const [feedbackForm, setFeedbackForm] = useState({
    remarks: "",
  });

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

  // Updated tab styles
  const tabBaseClasses = "px-6 py-3 text-sm font-medium rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase";
  const tabInactiveClasses = "text-gray-700 hover:text-gray-900 font-light border border-gray-300";
  const tabActiveClasses = "text-white font-normal shadow-lg";
  
  const inputClasses = "w-full rounded-sm border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 font-light transition-all duration-300 bg-white/50 backdrop-blur-sm";
  const textareaClasses = "w-full rounded-sm border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 font-light resize-y transition-all duration-300 bg-white/50 backdrop-blur-sm";
  const submitButtonClasses = "w-full px-6 py-3 text-sm font-medium text-white rounded-sm transition-all duration-300 transform hover:scale-105 tracking-wider uppercase hover:shadow-lg relative overflow-hidden";
  const cardClasses = "rounded-sm border border-gray-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg transition-all duration-500 hover:border-gray-300";
  const listContainerClasses = "mt-6 space-y-4";

  const getRoomImage = (roomType) => {
    const type = (roomType || '').toLowerCase();
    if (type.includes('single')) {
      return 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80';
    }
    if (type.includes('double')) {
      return 'https://images.unsplash.com/photo-1501117716987-c8e1ecb2108a?auto=format&fit=crop&w=1200&q=80';
    }
    if (type.includes('suite') || type.includes('deluxe')) {
      return 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80';
    }
    if (type.includes('family')) {
      return 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80';
    }
    return 'https://images.unsplash.com/photo-1501117716987-c8e1ecb2108a?auto=format&fit=crop&w=1200&q=80';
  };

  const getUserInitials = (name) => {
    if (!name) {
      return "";
    }
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const validateBookingForm = () => {
    if (
      !bookingForm.roomId ||
      !bookingForm.bookingDate ||
      !bookingForm.checkinDate ||
      !bookingForm.checkoutDate
    ) {
      setMessage("Please fill all booking fields.");
      return false;
    }

    const bookingDateValue = new Date(bookingForm.bookingDate);
    const checkinDateValue = new Date(bookingForm.checkinDate);
    const checkoutDateValue = new Date(bookingForm.checkoutDate);

    if (
      Number.isNaN(bookingDateValue.getTime()) ||
      Number.isNaN(checkinDateValue.getTime()) ||
      Number.isNaN(checkoutDateValue.getTime())
    ) {
      setMessage("Please enter valid booking and stay dates.");
      return false;
    }

    if (checkinDateValue < bookingDateValue) {
      setMessage("Check-in date cannot be before booking date.");
      return false;
    }

    if (checkoutDateValue <= checkinDateValue) {
      setMessage("Check-out date must be after check-in date.");
      return false;
    }

    return true;
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    if (userData) {
      setProfileForm({
        fullName: userData.fullName || "",
        username: userData.username || "",
        phone: userData.phone || "",
        email: userData.email || "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        preferences: userData.preferences || ""
      });
      fetchRooms();
      fetchMyBookings();
      fetchMyServiceRequests();
    }
  }, []);

  // Fetch available rooms
  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/room/all-rooms`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRooms(response.data.findRooms || []);
    } catch (error) {
      console.log("Error fetching rooms:", error);
    }
  };

  // Fetch ONLY current user's bookings
  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user"));
      
      if (!token || !userData) {
        return;
      }

      const bookingsResponse = await axios.get(
        `${API_URL}/booking/my-bookings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let userBookings = [];
      if (Array.isArray(bookingsResponse.data?.bookings)) {
        userBookings = bookingsResponse.data.bookings;
      } else if (Array.isArray(bookingsResponse.data)) {
        userBookings = bookingsResponse.data;
      }

      // Fetch all rooms to get room details
      const roomsResponse = await axios.get(
        `${API_URL}/room/all-rooms`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const rooms = roomsResponse.data.findRooms || [];

      // Merge room details into user's bookings
      const bookingsWithRoomDetails = userBookings.map((booking) => {
        const room = rooms.find((r) => r._id === booking.roomId);
        return {
          ...booking,
          room: room || null,
        };
      });

      setMyBookings(bookingsWithRoomDetails);
    } catch (error) {
      console.log(
        "Error fetching bookings:",
        error.response?.data || error.message
      );
    }
  };

  const fetchMyServiceRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await axios.get(
        `${API_URL}/service-requests/my-requests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const requests = Array.isArray(response.data?.serviceRequests)
        ? response.data.serviceRequests
        : Array.isArray(response.data)
        ? response.data
        : [];

      setMyServiceRequests(requests);
    } catch (error) {
      console.log(
        "Error fetching service requests:",
        error.response?.data || error.message
      );
    }
  };

  // Handle booking submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const isValid = validateBookingForm();
    if (!isValid) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user"));
      
      await axios.post(
        `${API_URL}/booking/create-booking`,
        {
          guestId: userData?._id,
          roomId: bookingForm.roomId,
          bookingDate: bookingForm.bookingDate,
          checkinDate: bookingForm.checkinDate,
          checkoutDate: bookingForm.checkoutDate,
          bookingStatus: "pending",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Booking created successfully!");
      setBookingForm({
        roomId: "",
        bookingDate: "",
        checkinDate: "",
        checkoutDate: "",
      });
      fetchMyBookings(); // Refresh user's bookings
      fetchRooms(); // Refresh rooms list
    } catch (error) {
      setMessage(error.response?.data?.message || "Booking failed");
    }
    setLoading(false);
  };

  // Handle service request submission
  const handleServiceSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (
      !serviceForm.serviceType ||
      !serviceForm.description ||
      !serviceForm.roomNumber
    ) {
      setMessage("Please fill all required fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user"));
      
      if (!token || !userData) {
        setMessage("You must be logged in to submit a request.");
        setLoading(false);
        return;
      }

      await axios.post(
        `${API_URL}/service-requests/create`,
        {
          userId: userData._id, // Add current user ID
          serviceType: serviceForm.serviceType,
          description: serviceForm.description,
          roomNumber: serviceForm.roomNumber,
          priority: serviceForm.priority || "normal",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Service request submitted!");
      setServiceForm({
        serviceType: "",
        description: "",
        roomNumber: "",
        priority: "",
      });
      fetchMyServiceRequests();
    } catch (error) {
      console.error(error);

      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Service request failed";

      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle feedback submission
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user"));
      
      await axios.post(
        `${API_URL}/reviews/create-review`,
        {
          userId: userData?._id,
          remarks: feedbackForm.remarks,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Thank you for your feedback!");
      setFeedbackForm({ remarks: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Feedback submission failed");
    }
    setLoading(false);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const emailValue = profileForm.email ? profileForm.email.trim() : "";
    if (!emailValue) {
      setMessage("Email is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (profileForm.newPassword || profileForm.confirmNewPassword || profileForm.currentPassword) {
      if (!profileForm.newPassword || !profileForm.confirmNewPassword) {
        setMessage("Please fill both new password and confirmation.");
        return;
      }
      if (profileForm.newPassword !== profileForm.confirmNewPassword) {
        setMessage("New password and confirmation do not match.");
        return;
      }
      if (!profileForm.currentPassword) {
        setMessage("Current password is required to change password.");
        return;
      }
      const passwordValue = profileForm.newPassword;
      const hasMinLength = passwordValue.length >= 8;
      const hasLetter = /[A-Za-z]/.test(passwordValue);
      const hasNumber = /[0-9]/.test(passwordValue);
      if (!hasMinLength || !hasLetter || !hasNumber) {
        setMessage("New password must be at least 8 characters and include letters and numbers.");
        return;
      }
    }

    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      if (!token || !user) {
        setMessage("You must be logged in to update your profile.");
        setLoading(false);
        return;
      }

      const payload = {
        fullName: profileForm.fullName,
        username: profileForm.username,
        phone: profileForm.phone,
        email: profileForm.email,
        preferences: profileForm.preferences
      };

      if (profileForm.newPassword) {
        payload.currentPassword = profileForm.currentPassword;
        payload.newPassword = profileForm.newPassword;
      }

      const response = await axios.put(
        `${API_URL}/profile`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setProfileForm(prev => ({
          ...prev,
          fullName: response.data.user.fullName || "",
          username: response.data.user.username || "",
          phone: response.data.user.phone || "",
          email: response.data.user.email || "",
          preferences: response.data.user.preferences || "",
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: ""
        }));
      }

      setMessage(response.data?.message || "Profile updated successfully");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to update profile";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToWebsite = () => {
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: customStyles.navy[900] }}>
        <div className="text-center">
          <div className="text-white font-serif text-xl mb-4">Loading your experience...</div>
          <div className="w-16 h-1 mx-auto" style={{ background: `linear-gradient(to right, ${customStyles.gold[600]}, transparent)` }}></div>
        </div>
      </div>
    );
  }

  const tabButtons = [
    { id: "viewRooms", label: "View Rooms", icon: <FaEye className="inline mr-2" /> },
    { id: "makeBooking", label: "Make Booking", icon: <FaPlus className="inline mr-2" /> },
    { id: "myBookings", label: "My Bookings", icon: <FaClipboardList className="inline mr-2" /> },
    { id: "myRequests", label: "My Requests", icon: <FaList className="inline mr-2" /> },
    { id: "requestService", label: "Request Service", icon: <FaTools className="inline mr-2" /> },
    { id: "giveFeedback", label: "Give Feedback", icon: <FaCommentAlt className="inline mr-2" /> },
    { id: "profile", label: "My Profile", icon: <FaUser className="inline mr-2" /> },
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
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                <div 
                  className="p-3 rounded-full"
                  style={{ backgroundColor: `${customStyles.gold[600]}20` }}
                >
                  <FaUserCircle className="text-2xl" style={{ color: customStyles.gold[600] }} />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-light text-white mb-1 tracking-tight">
                    Welcome, <span style={{ color: customStyles.gold[500] }}>{user.fullName}</span>
                  </h2>
                  <p className="text-gray-300 font-light text-sm tracking-widest uppercase">Guest Dashboard</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleBackToWebsite}
              className="group px-6 py-3 text-white font-medium rounded-sm transition-all duration-300 transform hover:scale-105 text-sm tracking-wider uppercase relative overflow-hidden border"
              style={{
                borderColor: customStyles.gold[600],
                backgroundColor: "transparent"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = customStyles.gold[600];
                e.currentTarget.style.borderColor = customStyles.gold[600];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = customStyles.gold[600];
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <FaHome />
                Back to Website
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            className={cardClasses}
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">My Bookings</p>
                <p className="text-2xl font-light" style={{ color: customStyles.navy[900] }}>
                  {myBookings.length}
                </p>
              </div>
              <FaCalendarAlt className="text-2xl" style={{ color: customStyles.navy[600] }} />
            </div>
          </div>
          
          <div 
            className={cardClasses}
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">Active Requests</p>
                <p className="text-2xl font-light" style={{ color: customStyles.navy[900] }}>
                  {myServiceRequests.length}
                </p>
              </div>
              <FaConciergeBell className="text-2xl" style={{ color: customStyles.gold[600] }} />
            </div>
          </div>
          
          <div 
            className={cardClasses}
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">Available Rooms</p>
                <p className="text-2xl font-light" style={{ color: customStyles.navy[900] }}>
                  {rooms.filter(room => room.isAvailable).length}
                </p>
              </div>
              <FaBed className="text-2xl" style={{ color: customStyles.navy[600] }} />
            </div>
          </div>
          
          <div 
            className={cardClasses}
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs font-light tracking-widest uppercase mb-2">Member Since</p>
                <p className="text-xl font-light" style={{ color: customStyles.navy[900] }}>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('default', { month: 'short', year: 'numeric' }) : 'Recent'}
                </p>
              </div>
              <FaStar className="text-2xl" style={{ color: customStyles.gold[600] }} />
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {tabButtons.map((tab) => (
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
                        borderColor: customStyles.gold[600]
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
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        <FormStatus
          type={message && (message.includes("success") || message.includes("Thank you") || message.includes("submitted")) ? "success" : "error"}
          message={message}
          onClose={() => setMessage("")}
        />

        {/* Content Area */}
        <div 
          className="rounded-sm border p-6 backdrop-blur-sm transition-all duration-500"
          style={{ 
            backgroundColor: 'white',
            borderColor: customStyles.navy[200]
          }}
        >
          {/* View Rooms Tab */}
          {activeTab === "viewRooms" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-light text-gray-900 mb-2 tracking-tight">
                    <span style={{ color: customStyles.navy[900] }}>Available</span> Rooms
                  </h3>
                  <p className="text-gray-600 font-light text-sm">
                    Discover our luxurious accommodations
                  </p>
                </div>
                <span 
                  className="text-xs font-light tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${customStyles.gold[600]}20`,
                    color: customStyles.gold[700]
                  }}
                >
                  {rooms.filter(room => room.isAvailable).length} Available
                </span>
              </div>
              
              {rooms.length === 0 ? (
                <div className="text-center py-12">
                  <FaBed className="text-4xl mx-auto mb-4" style={{ color: customStyles.navy[300] }} />
                  <p className="text-gray-600 font-light">No rooms available at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms
                    .filter((room) => room.isAvailable)
                    .map((room) => (
                      <div 
                        key={room._id} 
                        className="group relative overflow-hidden rounded-md border bg-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
                        style={{ borderColor: customStyles.navy[200] }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = customStyles.gold[300];
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = customStyles.navy[200];
                        }}
                      >
                        <div className="relative">
                          <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                            <img
                              src={getRoomImage(room.roomType)}
                              alt={`${room.roomType || 'Hotel'} room`}
                              className="w-full h-48 object-cover transform transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                            <span className="px-3 py-1 text-xs font-light uppercase rounded-full bg-white/10 border border-white/30 text-white tracking-wider">
                              {room.roomType || "Room"}
                            </span>
                            <span className="px-3 py-1 text-xs font-light uppercase rounded-full bg-green-500/80 text-white tracking-wider">
                              Available
                            </span>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                            <div>
                              <p className="text-xs font-light text-gray-200 mb-1">Room</p>
                              <p className="text-xl font-light text-white">
                                {room.roomNumber}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-light text-gray-200 mb-1">From</p>
                              <p className="text-lg font-light text-white">
                                ${room.pricePerNight || "N/A"}<span className="text-xs font-light opacity-80"> /night</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="text-center p-3 rounded-sm" style={{ backgroundColor: customStyles.navy[50] }}>
                              <p className="text-xs font-light text-gray-600 mb-1">Beds</p>
                              <p className="font-light" style={{ color: customStyles.navy[900] }}>{room.bedCount || "N/A"}</p>
                            </div>
                            <div className="text-center p-3 rounded-sm" style={{ backgroundColor: customStyles.navy[50] }}>
                              <p className="text-xs font-light text-gray-600 mb-1">Floor</p>
                              <p className="font-light" style={{ color: customStyles.navy[900] }}>{room.floor || "N/A"}</p>
                            </div>
                            <div className="text-center p-3 rounded-sm" style={{ backgroundColor: customStyles.navy[50] }}>
                              <p className="text-xs font-light text-gray-600 mb-1">Status</p>
                              <p className="font-light capitalize" style={{ color: customStyles.navy[900] }}>
                                {room.roomStatus || "available"}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-6">
                            {room.hasAC && (
                              <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                AC
                              </span>
                            )}
                            {room.hasWIFI && (
                              <span className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                                Wi‑Fi
                              </span>
                            )}
                            {room.hasTV && (
                              <span className="px-3 py-1 text-xs rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                                TV
                              </span>
                            )}
                          </div>
                          
                          <button
                            className="w-full group/btn px-4 py-3 text-white font-medium rounded-sm transition-all duration-300 transform group-hover:translate-y-0 hover:scale-105 text-sm tracking-wider uppercase relative overflow-hidden"
                            style={{ backgroundColor: customStyles.gold[600] }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                            onClick={() => {
                              setBookingForm({
                                ...bookingForm,
                                roomId: room._id,
                              });
                              setActiveTab("makeBooking");
                            }}
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              <FaKey /> Book This Room
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Make Booking Tab */}
          {activeTab === "makeBooking" && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-light text-gray-900 mb-3 tracking-tight">
                  Create New <span style={{ color: customStyles.navy[900] }}>Booking</span>
                </h3>
                <p className="text-gray-600 font-light">
                  You are booking as: <strong>{user.fullName}</strong>
                </p>
              </div>
              
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className={cardClasses}>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">
                    Select Room
                  </label>
                  <select
                    value={bookingForm.roomId}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, roomId: e.target.value })
                    }
                    className={inputClasses}
                    required
                    style={{ borderColor: customStyles.navy[200] }}
                  >
                    <option value="">Select a room</option>
                    {rooms
                      .filter((room) => room.isAvailable)
                      .map((room) => (
                        <option key={room._id} value={room._id}>
                          Room {room.roomNumber} - {room.roomType} ($
                          {room.pricePerNight || "N/A"}/night)
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={cardClasses}>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">
                      Booking Date
                    </label>
                    <input
                      type="date"
                      value={bookingForm.bookingDate}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          bookingDate: e.target.value,
                        })
                      }
                      className={inputClasses}
                      required
                      style={{ borderColor: customStyles.navy[200] }}
                    />
                  </div>

                  <div className={cardClasses}>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      value={bookingForm.checkinDate}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          checkinDate: e.target.value,
                        })
                      }
                      className={inputClasses}
                      required
                      style={{ borderColor: customStyles.navy[200] }}
                    />
                  </div>

                  <div className={cardClasses}>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      value={bookingForm.checkoutDate}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          checkoutDate: e.target.value,
                        })
                      }
                      className={inputClasses}
                      required
                      style={{ borderColor: customStyles.navy[200] }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={submitButtonClasses}
                  style={{ backgroundColor: customStyles.gold[600] }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaClock className="animate-spin" /> Processing...
                    </span>
                  ) : (
                    "Book Room"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* My Bookings Tab */}
          {activeTab === "myBookings" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-light text-gray-900 mb-2 tracking-tight">
                    My <span style={{ color: customStyles.navy[900] }}>Bookings</span>
                  </h3>
                  <p className="text-gray-600 font-light text-sm">
                    Showing bookings for: <strong>{user.fullName}</strong>
                  </p>
                </div>
              </div>
              
              <div className={listContainerClasses}>
                {myBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <FaCalendarAlt className="text-4xl mx-auto mb-4" style={{ color: customStyles.navy[300] }} />
                    <p className="text-gray-600 font-light">You have no bookings yet.</p>
                  </div>
                ) : (
                  myBookings.map((booking) => (
                    <div 
                      key={booking._id} 
                      className={`${cardClasses} transform transition-all duration-500 hover:scale-[1.02]`}
                      style={{ 
                        borderLeft: `4px solid ${booking.bookingStatus === 'confirmed' ? customStyles.gold[600] : booking.bookingStatus === 'pending' ? customStyles.navy[400] : '#DC2626'}`
                      }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h4 className="text-base font-normal mb-2" style={{ color: customStyles.navy[900] }}>
                            Booking ID: {booking._id.slice(-8)}
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs font-light text-gray-600 mb-1">Room</p>
                              <p className="font-light">{booking.room?.roomNumber || "N/A"} - {booking.room?.roomType || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-xs font-light text-gray-600 mb-1">Check-in</p>
                              <p className="font-light">{new Date(booking.checkinDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-xs font-light text-gray-600 mb-1">Check-out</p>
                              <p className="font-light">{new Date(booking.checkoutDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-xs font-light text-gray-600 mb-1">Booking Date</p>
                              <p className="font-light">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-light tracking-wider uppercase ${
                            booking.bookingStatus === "confirmed" 
                              ? "bg-green-100 text-green-800"
                              : booking.bookingStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {booking.bookingStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* My Requests Tab */}
          {activeTab === "myRequests" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-light text-gray-900 mb-2 tracking-tight">
                    My <span style={{ color: customStyles.navy[900] }}>Service Requests</span>
                  </h3>
                  <p className="text-gray-600 font-light text-sm">
                    Viewing requests for: <strong>{user.fullName}</strong>
                  </p>
                </div>
              </div>
              
              {myServiceRequests.length === 0 ? (
                <div className="text-center py-12">
                  <FaConciergeBell className="text-4xl mx-auto mb-4" style={{ color: customStyles.navy[300] }} />
                  <p className="text-gray-600 font-light">You have not submitted any service requests yet.</p>
                </div>
              ) : (
                <div className={listContainerClasses}>
                  {myServiceRequests.map((request) => (
                    <div 
                      key={request._id} 
                      className={`${cardClasses} transform transition-all duration-500 hover:scale-[1.02]`}
                      style={{ 
                        borderLeft: `4px solid ${
                          request.status === 'completed' ? customStyles.gold[600] : 
                          request.status === 'in-progress' ? customStyles.navy[400] : 
                          request.priority === 'urgent' ? '#DC2626' : 
                          '#6B7280'
                        }`
                      }}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-base font-normal mb-2" style={{ color: customStyles.navy[900] }}>
                            {request.serviceType}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div>
                              <p className="text-xs font-light text-gray-600 mb-1">Room</p>
                              <p className="font-light">{request.roomNumber}</p>
                            </div>
                            <div>
                              <p className="text-xs font-light text-gray-600 mb-1">Priority</p>
                              <p className="font-light">{request.priority}</p>
                            </div>
                            <div>
                              <p className="text-xs font-light text-gray-600 mb-1">Status</p>
                              <p className="font-light">{request.status}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 font-light mt-2">
                            <span className="font-normal">Description:</span> {request.description}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xs font-light text-gray-600 mb-1">Created</p>
                          <p className="font-light text-sm">
                            {request.createdAt
                              ? new Date(request.createdAt).toLocaleDateString()
                              : "N/A"}
                          </p>
                          {request.completedAt && (
                            <>
                              <p className="text-xs font-light text-gray-600 mb-1 mt-3">Completed</p>
                              <p className="font-light text-sm">
                                {new Date(request.completedAt).toLocaleDateString()}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Request Service Tab */}
          {activeTab === "requestService" && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-light text-gray-900 mb-3 tracking-tight">
                  Request a <span style={{ color: customStyles.navy[900] }}>Service</span>
                </h3>
                <p className="text-gray-600 font-light">
                  Requesting as: <strong>{user.fullName}</strong>
                </p>
              </div>
              
              <form onSubmit={handleServiceSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={cardClasses}>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">
                      Service Type
                    </label>
                    <select
                      value={serviceForm.serviceType}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          serviceType: e.target.value,
                        })
                      }
                      className={inputClasses}
                      required
                      style={{ borderColor: customStyles.navy[200] }}
                    >
                      <option value="">Select service</option>
                      <option value="room_cleaning">Room Cleaning</option>
                      <option value="food_service">Food Service</option>
                      <option value="laundry">Laundry</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className={cardClasses}>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">
                      Your Room Number
                    </label>
                    <input
                      type="text"
                      value={serviceForm.roomNumber}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          roomNumber: e.target.value,
                        })
                      }
                      className={inputClasses}
                      placeholder="Enter your room number"
                      required
                      style={{ borderColor: customStyles.navy[200] }}
                    />
                  </div>
                </div>

                <div className={cardClasses}>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">
                    Priority
                  </label>
                  <select
                    value={serviceForm.priority}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        priority: e.target.value,
                      })
                    }
                    className={inputClasses}
                    style={{ borderColor: customStyles.navy[200] }}
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div className={cardClasses}>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">
                    Service Description
                  </label>
                  <textarea
                    value={serviceForm.description}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        description: e.target.value,
                      })
                    }
                    className={textareaClasses}
                    rows="4"
                    placeholder="Describe the service you need..."
                    required
                    style={{ borderColor: customStyles.navy[200] }}
                  />
                </div>

                <button
                  type="submit"
                  className={submitButtonClasses}
                  style={{ backgroundColor: customStyles.gold[600] }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaClock className="animate-spin" /> Submitting...
                    </span>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Give Feedback Tab */}
          {activeTab === "giveFeedback" && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-light text-gray-900 mb-3 tracking-tight">
                  Share Your <span style={{ color: customStyles.navy[900] }}>Experience</span>
                </h3>
                <p className="text-gray-600 font-light">
                  Feedback from: <strong>{user.fullName}</strong>
                </p>
              </div>
              
              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                <div className={cardClasses}>
                  <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">
                    Your Feedback
                  </label>
                  <textarea
                    value={feedbackForm.remarks}
                    onChange={(e) =>
                      setFeedbackForm({
                        ...feedbackForm,
                        remarks: e.target.value,
                      })
                    }
                    className={textareaClasses}
                    rows="6"
                    placeholder="Share your experience with us..."
                    required
                    style={{ borderColor: customStyles.navy[200] }}
                  />
                </div>

                <button
                  type="submit"
                  className={submitButtonClasses}
                  style={{ backgroundColor: customStyles.gold[600] }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaClock className="animate-spin" /> Submitting...
                    </span>
                  ) : (
                    "Submit Feedback"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6">
                  <div
                    className="flex items-center justify-center rounded-full w-20 h-20 md:w-24 md:h-24 text-2xl md:text-3xl font-semibold shadow-sm"
                    style={{ 
                      backgroundColor: customStyles.navy[900],
                      color: customStyles.gold[400]
                    }}
                  >
                    {getUserInitials(user?.fullName || user?.username || "")}
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                    <div className="border rounded-sm px-4 py-3 bg-white/80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-light tracking-widest uppercase text-gray-500">
                          Guest
                        </span>
                        <FaUserCircle className="text-gray-400" />
                      </div>
                      <p className="text-sm font-medium" style={{ color: customStyles.navy[900] }}>
                        {user?.fullName || user?.username || "Guest"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="border rounded-sm px-4 py-3 bg-white/80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-light tracking-widest uppercase text-gray-500">
                          Account
                        </span>
                        <FaKey className="text-gray-400" />
                      </div>
                      <p className="text-sm font-medium" style={{ color: customStyles.navy[900] }}>
                        {user?.status || "active"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Role: {user?.role || "guest"}
                      </p>
                    </div>
                    <div className="border rounded-sm px-4 py-3 bg-white/80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-light tracking-widest uppercase text-gray-500">
                          Stays
                        </span>
                        <FaBed className="text-gray-400" />
                      </div>
                      <p className="text-sm font-medium" style={{ color: customStyles.navy[900] }}>
                        {myBookings.length}
                      </p>
                      <p className="text-xs text-gray-500">
                        Total bookings
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={cardClasses}>
                <div className="mb-6">
                  <h3 className="text-xl font-light text-gray-900 mb-1 tracking-tight">
                    Personal Information
                  </h3>
                  <p className="text-gray-600 font-light text-sm">
                    Keep your contact details up to date so we can better serve you.
                  </p>
                </div>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.fullName}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            fullName: e.target.value,
                          })
                        }
                        className={inputClasses}
                        required
                        style={{ borderColor: customStyles.navy[200] }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">
                        Username
                      </label>
                      <input
                        type="text"
                        value={profileForm.username}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            username: e.target.value,
                          })
                        }
                        className={inputClasses}
                        required
                        style={{ borderColor: customStyles.navy[200] }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            phone: e.target.value,
                          })
                        }
                        className={inputClasses}
                        style={{ borderColor: customStyles.navy[200] }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            email: e.target.value,
                          })
                        }
                        className={inputClasses}
                        required
                        style={{ borderColor: customStyles.navy[200] }}
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t" style={{ borderColor: customStyles.navy[100] }}>
                    <h4 className="text-lg font-light mb-1" style={{ color: customStyles.navy[900] }}>
                      Change Password
                    </h4>
                    <p className="text-xs text-gray-500 mb-4">
                      Leave these fields empty if you do not want to change your password.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={profileForm.currentPassword}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              currentPassword: e.target.value,
                            })
                          }
                          className={inputClasses}
                          style={{ borderColor: customStyles.navy[200] }}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={profileForm.newPassword}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              newPassword: e.target.value,
                            })
                          }
                          className={inputClasses}
                          minLength="6"
                          style={{ borderColor: customStyles.navy[200] }}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={profileForm.confirmNewPassword}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              confirmNewPassword: e.target.value,
                            })
                          }
                          className={inputClasses}
                          minLength="6"
                          style={{ borderColor: customStyles.navy[200] }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">
                        Role
                      </label>
                      <input
                        type="text"
                        value={user.role}
                        className={inputClasses}
                        disabled
                        style={{ 
                          borderColor: customStyles.navy[200],
                          backgroundColor: customStyles.navy[50]
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">
                        Account Status
                      </label>
                      <input
                        type="text"
                        value={user.status}
                        className={inputClasses}
                        disabled
                        style={{ 
                          borderColor: customStyles.navy[200],
                          backgroundColor: customStyles.navy[50]
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-3 tracking-wider uppercase">
                      Preferences
                    </label>
                    <textarea
                      value={profileForm.preferences}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          preferences: e.target.value,
                        })
                      }
                      className={textareaClasses}
                      rows="3"
                      placeholder="E.g. high floor, non-smoking room, late checkout"
                      style={{ borderColor: customStyles.navy[200] }}
                    />
                  </div>

                  <button
                    type="submit"
                    className={submitButtonClasses}
                    style={{ backgroundColor: customStyles.gold[600] }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[700]}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = customStyles.gold[600]}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <FaClock className="animate-spin" /> Saving...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </form>
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
              Need help? <span style={{ color: customStyles.navy[900] }}>Contact Support</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestDashboard;
