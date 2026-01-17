import React, { useState, useEffect } from "react";
import axios from "axios";

function GuestDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("viewRooms");
  const [rooms, setRooms] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  // Load user data on component mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    if (userData) {
      fetchRooms();
      fetchMyBookings();
    }
  }, []);

  // Fetch available rooms
  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/room/all-rooms",
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

      // Fetch all bookings
      const bookingsResponse = await axios.get(
        "http://localhost:5000/api/booking/all-bookings",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let allBookings = bookingsResponse.data.allBookings || [];
      
      // Filter bookings to show only current user's bookings
      const userBookings = allBookings.filter(
        (booking) => booking.guestId === userData._id
      );

      // Fetch all rooms to get room details
      const roomsResponse = await axios.get(
        "http://localhost:5000/api/room/all-rooms",
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

  // Handle booking submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user"));
      
      const response = await axios.post(
        "http://localhost:5000/api/booking/create-booking",
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

      const response = await axios.post(
        "http://localhost:5000/api/service-requests/create",
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

      setMessage(response.data.message || "Service request submitted!");
      setServiceForm({
        serviceType: "",
        description: "",
        roomNumber: "",
        priority: "",
      });
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
      
      const response = await axios.post(
        "http://localhost:5000/api/reviews/create-review",
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

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2>Welcome, {user.fullName}!</h2>
        <p>Guest Dashboard - Hotel Management System</p>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      {/* Tabs Navigation */}
      <div style={styles.tabs}>
        <button
          style={activeTab === "viewRooms" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("viewRooms")}
        >
          View Rooms
        </button>
        <button
          style={activeTab === "makeBooking" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("makeBooking")}
        >
          Make Booking
        </button>
        <button
          style={activeTab === "myBookings" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("myBookings")}
        >
          My Bookings
        </button>
        <button
          style={activeTab === "requestService" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("requestService")}
        >
          Request Service
        </button>
        <button
          style={activeTab === "giveFeedback" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("giveFeedback")}
        >
          Give Feedback
        </button>
        <button
          style={activeTab === "profile" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("profile")}
        >
          My Profile
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div
          style={
            message.includes("success") || message.includes("Thank you")
              ? styles.successMessage
              : styles.errorMessage
          }
        >
          {message}
        </div>
      )}

      {/* Tab Content */}
      <div style={styles.content}>
        {/* View Rooms Tab - Shows all available rooms */}
        {activeTab === "viewRooms" && (
          <div>
            <h3>Available Rooms</h3>
            {rooms.length === 0 ? (
              <p>No rooms available at the moment.</p>
            ) : (
              <div style={styles.roomGrid}>
                {rooms
                  .filter((room) => room.isAvailable)
                  .map((room) => (
                    <div key={room._id} style={styles.roomCard}>
                      <h4>Room {room.roomNumber}</h4>
                      <p>Type: {room.roomType}</p>
                      <p>Price: ${room.pricePerNight || "N/A"}/night</p>
                      <p>Beds: {room.bedCount || "N/A"}</p>
                      <p>Floor: {room.floor || "N/A"}</p>
                      <p>Status: {room.roomStatus}</p>
                      <button
                        style={styles.bookBtn}
                        onClick={() => {
                          setBookingForm({
                            ...bookingForm,
                            roomId: room._id,
                          });
                          setActiveTab("makeBooking");
                        }}
                      >
                        Book This Room
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Make Booking Tab */}
        {activeTab === "makeBooking" && (
          <div style={styles.formContainer}>
            <h3>Make a Booking</h3>
            <p>You are booking as: <strong>{user.fullName}</strong></p>
            <form onSubmit={handleBookingSubmit}>
              <div style={styles.formGroup}>
                <label>Select Room:</label>
                <select
                  value={bookingForm.roomId}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, roomId: e.target.value })
                  }
                  style={styles.input}
                  required
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

              <div style={styles.formGroup}>
                <label>Booking Date:</label>
                <input
                  type="date"
                  value={bookingForm.bookingDate}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      bookingDate: e.target.value,
                    })
                  }
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label>Check-in Date:</label>
                <input
                  type="date"
                  value={bookingForm.checkinDate}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      checkinDate: e.target.value,
                    })
                  }
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label>Check-out Date:</label>
                <input
                  type="date"
                  value={bookingForm.checkoutDate}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      checkoutDate: e.target.value,
                    })
                  }
                  style={styles.input}
                  required
                />
              </div>

              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? "Booking..." : "Book Room"}
              </button>
            </form>
          </div>
        )}

        {/* My Bookings Tab - Shows ONLY current user's bookings */}
        {activeTab === "myBookings" && (
          <div>
            <h3>My Bookings</h3>
            <p>Showing bookings for: <strong>{user.fullName}</strong></p>
            <div style={styles.bookingsList}>
              {myBookings.length === 0 ? (
                <p>You have no bookings yet.</p>
              ) : (
                myBookings.map((booking) => (
                  <div key={booking._id} style={styles.bookingCard}>
                    <h4>Booking ID: {booking._id.slice(-6)}</h4>
                    <p>
                      <strong>Room:</strong> {booking.room?.roomNumber || "N/A"} -{" "}
                      {booking.room?.roomType || "N/A"}
                    </p>
                    <p>
                      <strong>Check-in:</strong>{" "}
                      {new Date(booking.checkinDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Check-out:</strong>{" "}
                      {new Date(booking.checkoutDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Booking Date:</strong>{" "}
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        style={{
                          color:
                            booking.bookingStatus === "confirmed"
                              ? "green"
                              : booking.bookingStatus === "pending"
                              ? "orange"
                              : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {booking.bookingStatus}
                      </span>
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Request Service Tab */}
        {activeTab === "requestService" && (
          <div style={styles.formContainer}>
            <h3>Request a Service</h3>
            <p>Requesting as: <strong>{user.fullName}</strong></p>
            <form onSubmit={handleServiceSubmit}>
              <div style={styles.formGroup}>
                <label>Service Type:</label>
                <select
                  value={serviceForm.serviceType}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      serviceType: e.target.value,
                    })
                  }
                  style={styles.input}
                  required
                >
                  <option value="">Select service</option>
                  <option value="room_cleaning">Room Cleaning</option>
                  <option value="food_service">Food Service</option>
                  <option value="laundry">Laundry</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label>Your Room Number:</label>
                <input
                  type="text"
                  value={serviceForm.roomNumber}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      roomNumber: e.target.value,
                    })
                  }
                  style={styles.input}
                  placeholder="Enter your room number"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label>Service Description:</label>
                <textarea
                  value={serviceForm.description}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      description: e.target.value,
                    })
                  }
                  style={styles.textarea}
                  rows="4"
                  placeholder="Describe the service you need..."
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label>Priority:</label>
                <select
                  value={serviceForm.priority}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      priority: e.target.value,
                    })
                  }
                  style={styles.input}
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
        )}

        {/* Give Feedback Tab */}
        {activeTab === "giveFeedback" && (
          <div style={styles.formContainer}>
            <h3>Give Feedback</h3>
            <p>Feedback from: <strong>{user.fullName}</strong></p>
            <form onSubmit={handleFeedbackSubmit}>
              <div style={styles.formGroup}>
                <label>Your Feedback:</label>
                <textarea
                  value={feedbackForm.remarks}
                  onChange={(e) =>
                    setFeedbackForm({
                      ...feedbackForm,
                      remarks: e.target.value,
                    })
                  }
                  style={styles.textarea}
                  rows="6"
                  placeholder="Share your experience with us..."
                  required
                />
              </div>

              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          </div>
        )}

        {/* Profile Tab - Shows current user's profile */}
        {activeTab === "profile" && (
          <div style={styles.profileContainer}>
            <h3>My Profile</h3>
            <div style={styles.profileCard}>
              <p>
                <strong>Full Name:</strong> {user.fullName}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone || "Not provided"}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
              <p>
                <strong>Account Status:</strong> {user.status}
              </p>
              <p>
                <strong>User ID:</strong> {user._id}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "20px",
    borderBottom: "2px solid #007bff",
    flexWrap: "wrap",
  },
  logoutBtn: {
    padding: "8px 16px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  tabs: {
    display: "flex",
    gap: "10px",
    margin: "20px 0",
    flexWrap: "wrap",
  },
  tab: {
    padding: "10px 20px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  activeTab: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  content: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    minHeight: "400px",
  },
  roomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  roomCard: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  bookBtn: {
    marginTop: "10px",
    padding: "8px 16px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
    fontSize: "14px",
  },
  formContainer: {
    maxWidth: "500px",
    margin: "0 auto",
  },
  formGroup: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
    resize: "vertical",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
  },
  submitBtn: {
    padding: "12px 24px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
  },
  bookingsList: {
    marginTop: "20px",
  },
  bookingCard: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "15px",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  profileContainer: {
    maxWidth: "500px",
    margin: "0 auto",
  },
  profileCard: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  successMessage: {
    padding: "10px",
    backgroundColor: "#d4edda",
    color: "#155724",
    borderRadius: "4px",
    marginBottom: "20px",
    textAlign: "center",
    border: "1px solid #c3e6cb",
  },
  errorMessage: {
    padding: "10px",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    borderRadius: "4px",
    marginBottom: "20px",
    textAlign: "center",
    border: "1px solid #f5c6cb",
  },
};

export default GuestDashboard;