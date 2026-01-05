import { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaUsers, FaBed, FaCalendarAlt, FaFileInvoiceDollar, 
  FaDollarSign, FaCog, FaShieldAlt, FaChartLine, 
  FaClipboardCheck, FaHome, FaUserPlus, FaUserEdit,
  FaTrash, FaEdit, FaSearch, FaFilter, FaDownload,
  FaSync, FaEllipsisV, FaCheckCircle, FaTimesCircle,
  FaExclamationCircle, FaClock, FaPhone, FaEnvelope,
  FaUserTag, FaLock, FaUnlock, FaEye, FaEyeSlash,
  FaCalendarDay, FaMoneyBillWave, FaTasks, FaConciergeBell,
  FaReceipt, FaCreditCard, FaWrench, FaHotel, FaStar
} from 'react-icons/fa';

const API_BASE = "http://localhost:3900";

const Admin = () => {
  const [tab, setTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userRole, setUserRole] = useState("admin");

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const auth = { headers: { Authorization: `Bearer ${token}` } };

  // ========================= DASHBOARD STATS & DATA =========================
  const [stats, setStats] = useState({
    users: 0,
    rooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    bookings: 0,
    activeBookings: 0,
    invoices: 0,
    pendingInvoices: 0,
    revenue: 0,
    monthlyRevenue: 0,
    tasks: 0,
    pendingTasks: 0,
    serviceRequests: 0,
    pendingServices: 0,
    recentBookings: [],
    topRooms: [],
    userActivity: []
  });

  // ========================= USERS =========================
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    Name: "",
    Email: "",
    Password: "",
    Role: "guest",
    Phone: "",
    Address: "",
    Status: "active"
  });
  const [userSearch, setUserSearch] = useState("");
  const [selectedUserRole, setSelectedUserRole] = useState("all");
  const [selectedUserStatus, setSelectedUserStatus] = useState("all");

  // ========================= ROOMS =========================
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({
    RoomNumber: "",
    Type: "Deluxe",
    Price: "",
    Capacity: 2,
    Amenities: ["WiFi", "AC", "TV"],
    Floor: 1,
    Status: "available",
    Description: "",
    MaxOccupancy: 2,
    BedType: "Queen",
    View: "City"
  });
  const [newAmenity, setNewAmenity] = useState("");
  const [roomSearch, setRoomSearch] = useState("");
  const [selectedRoomStatus, setSelectedRoomStatus] = useState("all");
  const [selectedRoomType, setSelectedRoomType] = useState("all");

  // ========================= REPORTS =========================
  const [reports, setReports] = useState({
    revenueReport: [],
    occupancyReport: [],
    userReport: [],
    bookingReport: []
  });
  const [reportType, setReportType] = useState("revenue");
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // ========================= SYSTEM SETTINGS =========================
  const [settings, setSettings] = useState({
    hotelName: "Grand Hotel",
    email: "contact@grandhotel.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, New York, NY 10001",
    checkInTime: "14:00",
    checkOutTime: "12:00",
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
    taxRate: 15,
    currency: "USD",
    maintenanceMode: false,
    autoConfirmBookings: true,
    maxGuestsPerRoom: 4,
    lateCheckoutFee: 50,
    earlyCheckinFee: 30,
    minBookingDays: 1,
    maxBookingDays: 30,
    allowOnlineBooking: true,
    requireIDCheck: true,
    defaultRoomType: "Deluxe"
  });

  // ========================= LOAD ALL DATA =========================
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [usersRes, roomsRes, bookingsRes, paymentsRes, tasksRes, servicesRes, invoicesRes] = await Promise.all([
        axios.get(`${API_BASE}/users`, auth),
        axios.get(`${API_BASE}/rooms`, auth),
        axios.get(`${API_BASE}/bookings`, auth),
        axios.get(`${API_BASE}/payments`, auth),
        axios.get(`${API_BASE}/tasks`, auth),
        axios.get(`${API_BASE}/services`, auth),
        axios.get(`${API_BASE}/invoices`, auth)
      ]);

      const users = usersRes.data;
      const rooms = roomsRes.data;
      const bookings = bookingsRes.data;
      const payments = paymentsRes.data;
      const tasks = tasksRes.data;
      const services = servicesRes.data;
      const invoices = invoicesRes.data;

      // Calculate stats
      const totalRevenue = payments.reduce((sum, p) => sum + (p.Amount || 0), 0);
      const monthlyRevenue = payments
        .filter(p => {
          const paymentDate = new Date(p.PaymentDate);
          const now = new Date();
          return paymentDate.getMonth() === now.getMonth() && 
                 paymentDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, p) => sum + (p.Amount || 0), 0);

      // Recent bookings (last 5)
      const recentBookings = bookings
        .sort((a, b) => new Date(b.createdAt || b.CheckInDate) - new Date(a.createdAt || a.CheckInDate))
        .slice(0, 5);

      // Top rooms by price
      const topRooms = rooms
        .sort((a, b) => (b.Price || 0) - (a.Price || 0))
        .slice(0, 5);

      // User activity (last 5 users)
      const userActivity = users
        .sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt))
        .slice(0, 5);

      setStats({
        users: users.length,
        rooms: rooms.length,
        availableRooms: rooms.filter(r => r.Status === "available").length,
        occupiedRooms: rooms.filter(r => r.Status === "occupied").length,
        bookings: bookings.length,
        activeBookings: bookings.filter(b => ["reserved", "checked-in"].includes(b.Status)).length,
        invoices: invoices.length,
        pendingInvoices: invoices.filter(i => i.PaymentStatus === "pending").length,
        revenue: totalRevenue,
        monthlyRevenue,
        tasks: tasks.length,
        pendingTasks: tasks.filter(t => t.Status === "pending").length,
        serviceRequests: services.length,
        pendingServices: services.filter(s => s.Status === "requested").length,
        recentBookings,
        topRooms,
        userActivity
      });

      setUsers(users);
      setRooms(rooms);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ========================= USER FUNCTIONS =========================
  const handleCreateUser = async () => {
    if (!userForm.Name || !userForm.Email || (!editingUser && !userForm.Password)) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const userData = {
        ...userForm,
        Status: userForm.Status || "active"
      };

      if (editingUser) {
        await axios.put(
          `${API_BASE}/users/Update/${editingUser._id}`,
          userData,
          auth
        );
      } else {
        await axios.post(`${API_BASE}/users/Register`, userData, auth);
      }
      
      await loadDashboardData();
      setEditingUser(null);
      setUserForm({
        Name: "", Email: "", Password: "", Role: "guest",
        Phone: "", Address: "", Status: "active"
      });
      alert("User saved successfully!");
    } catch (error) {
      console.error("Error saving user:", error);
      alert(error.response?.data?.message || "Error saving user");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/users/Delete/${id}`, auth);
      await loadDashboardData();
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      Name: user.Name,
      Email: user.Email,
      Password: "",
      Role: user.Role,
      Phone: user.Phone || "",
      Address: user.Address || "",
      Status: user.Status || "active"
    });
  };

  const handleToggleUserStatus = async (user) => {
    const newStatus = user.Status === "active" ? "inactive" : "active";
    if (!window.confirm(`Change user status to ${newStatus}?`)) return;
    
    try {
      setLoading(true);
      await axios.put(
        `${API_BASE}/users/Update/${user._id}`,
        { ...user, Status: newStatus },
        auth
      );
      await loadDashboardData();
      alert("User status updated!");
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Error updating user status");
    } finally {
      setLoading(false);
    }
  };

  // ========================= ROOM FUNCTIONS =========================
  const handleCreateRoom = async () => {
    if (!roomForm.RoomNumber || !roomForm.Price || !roomForm.Type) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const roomData = {
        ...roomForm,
        Price: Number(roomForm.Price),
        Capacity: Number(roomForm.Capacity),
        Floor: Number(roomForm.Floor),
        MaxOccupancy: Number(roomForm.MaxOccupancy)
      };

      if (editingRoom) {
        await axios.put(
          `${API_BASE}/rooms/Update/${editingRoom._id}`,
          roomData,
          auth
        );
      } else {
        await axios.post(`${API_BASE}/rooms/create`, roomData, auth);
      }
      
      await loadDashboardData();
      setEditingRoom(null);
      setRoomForm({
        RoomNumber: "", Type: "Deluxe", Price: "", Capacity: 2,
        Amenities: ["WiFi", "AC", "TV"], Floor: 1, Status: "available",
        Description: "", MaxOccupancy: 2, BedType: "Queen", View: "City"
      });
      alert("Room saved successfully!");
    } catch (error) {
      console.error("Error saving room:", error);
      alert(error.response?.data?.message || "Error saving room");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    
    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/rooms/Delete/${id}`, auth);
      await loadDashboardData();
      alert("Room deleted successfully!");
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("Error deleting room");
    } finally {
      setLoading(false);
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setRoomForm({
      RoomNumber: room.RoomNumber,
      Type: room.Type,
      Price: room.Price,
      Capacity: room.Capacity,
      Amenities: room.Amenities || ["WiFi", "AC", "TV"],
      Floor: room.Floor,
      Status: room.Status,
      Description: room.Description || "",
      MaxOccupancy: room.MaxOccupancy || 2,
      BedType: room.BedType || "Queen",
      View: room.View || "City"
    });
  };

  const handleToggleRoomStatus = async (room) => {
    const newStatus = room.Status === "available" ? "maintenance" : "available";
    if (!window.confirm(`Change room status to ${newStatus}?`)) return;
    
    try {
      setLoading(true);
      await axios.put(
        `${API_BASE}/rooms/Update/${room._id}`,
        { ...room, Status: newStatus },
        auth
      );
      await loadDashboardData();
      alert("Room status updated!");
    } catch (error) {
      console.error("Error updating room status:", error);
      alert("Error updating room status");
    } finally {
      setLoading(false);
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !roomForm.Amenities.includes(newAmenity.trim())) {
      setRoomForm({
        ...roomForm,
        Amenities: [...roomForm.Amenities, newAmenity.trim()]
      });
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity) => {
    setRoomForm({
      ...roomForm,
      Amenities: roomForm.Amenities.filter(a => a !== amenity)
    });
  };

  // ========================= REPORT FUNCTIONS =========================
  const generateReport = async () => {
    try {
      setLoading(true);
      // In a real app, you would fetch filtered data based on dateRange
      const [bookingsRes, paymentsRes, usersRes, roomsRes] = await Promise.all([
        axios.get(`${API_BASE}/bookings`, auth),
        axios.get(`${API_BASE}/payments`, auth),
        axios.get(`${API_BASE}/users`, auth),
        axios.get(`${API_BASE}/rooms`, auth)
      ]);

      const bookings = bookingsRes.data;
      const payments = paymentsRes.data;
      const users = usersRes.data;
      const rooms = roomsRes.data;

      // Generate reports based on selected type
      let reportData = [];
      switch (reportType) {
        case "revenue":
          reportData = payments.map(p => ({
            Date: new Date(p.PaymentDate).toLocaleDateString(),
            Invoice: p.InvoiceId?.slice(0, 8) || "N/A",
            Amount: p.Amount,
            Method: p.Method,
            Status: "Paid"
          }));
          break;
        case "occupancy":
          reportData = rooms.map(r => ({
            Room: r.RoomNumber,
            Type: r.Type,
            Status: r.Status,
            Price: r.Price,
            Floor: r.Floor,
            Occupancy: Math.floor(Math.random() * 100) + "%"
          }));
          break;
        case "users":
          reportData = users.map(u => ({
            Name: u.Name,
            Email: u.Email,
            Role: u.Role,
            Status: u.Status,
            Created: new Date(u.createdAt || new Date()).toLocaleDateString(),
            LastActive: new Date(u.updatedAt || new Date()).toLocaleDateString()
          }));
          break;
        case "bookings":
          reportData = bookings.map(b => ({
            Guest: b.GuestId?.Name || "N/A",
            Room: b.RoomId?.RoomNumber || "N/A",
            CheckIn: new Date(b.CheckInDate).toLocaleDateString(),
            CheckOut: new Date(b.CheckOutDate).toLocaleDateString(),
            Status: b.Status,
            Amount: `$${Math.floor(Math.random() * 1000) + 100}`
          }));
          break;
      }

      setReports(prev => ({ ...prev, [reportType + "Report"]: reportData }));
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Error generating report");
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    const data = reports[reportType + "Report"];
    if (!data.length) {
      alert("No data to export");
      return;
    }

    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map(row => Object.values(row).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // ========================= SETTINGS FUNCTIONS =========================
  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_BASE}/system/update`, settings, auth);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings");
    } finally {
      setLoading(false);
    }
  };

  // ========================= INITIAL LOAD =========================
  useEffect(() => {
    loadDashboardData();
  }, []);

  // ========================= FILTER FUNCTIONS =========================
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.Name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.Email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.Phone?.toLowerCase().includes(userSearch.toLowerCase());
    
    const matchesRole = selectedUserRole === "all" || user.Role === selectedUserRole;
    const matchesStatus = selectedUserStatus === "all" || user.Status === selectedUserStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = 
      room.RoomNumber?.toLowerCase().includes(roomSearch.toLowerCase()) ||
      room.Type?.toLowerCase().includes(roomSearch.toLowerCase()) ||
      room.Description?.toLowerCase().includes(roomSearch.toLowerCase());
    
    const matchesStatus = selectedRoomStatus === "all" || room.Status === selectedRoomStatus;
    const matchesType = selectedRoomType === "all" || room.Type === selectedRoomType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // ========================= RENDER COMPONENTS =========================
  const renderDashboard = () => (
    <div className="container-fluid">
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">
              <FaChartLine className="me-2" />
              Dashboard Overview
            </h4>
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={loadDashboardData}
              disabled={loading}
            >
              <FaSync className={`me-1 ${loading ? 'fa-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[
          { 
            title: "Total Users", 
            value: stats.users, 
            icon: FaUsers, 
            color: "primary",
            change: "+12%",
            description: "Active system users"
          },
          { 
            title: "Total Rooms", 
            value: stats.rooms, 
            icon: FaBed, 
            color: "success",
            change: "+5%",
            description: "All room types"
          },
          { 
            title: "Available Rooms", 
            value: stats.availableRooms, 
            icon: FaHome, 
            color: "info",
            change: "-2%",
            description: "Ready for booking"
          },
          { 
            title: "Occupied Rooms", 
            value: stats.occupiedRooms, 
            icon: FaClipboardCheck, 
            color: "warning",
            change: "+15%",
            description: "Currently occupied"
          },
          { 
            title: "Total Bookings", 
            value: stats.bookings, 
            icon: FaCalendarAlt, 
            color: "danger",
            change: "+8%",
            description: "All time bookings"
          },
          { 
            title: "Active Bookings", 
            value: stats.activeBookings, 
            icon: FaCalendarDay, 
            color: "purple",
            change: "+3%",
            description: "Current reservations"
          },
          { 
            title: "Total Revenue", 
            value: `$${stats.revenue.toLocaleString()}`, 
            icon: FaDollarSign, 
            color: "success",
            change: "+18%",
            description: "All time revenue"
          },
          { 
            title: "Monthly Revenue", 
            value: `$${stats.monthlyRevenue.toLocaleString()}`, 
            icon: FaMoneyBillWave, 
            color: "info",
            change: "+12%",
            description: "Current month"
          },
          { 
            title: "Pending Tasks", 
            value: stats.pendingTasks, 
            icon: FaTasks, 
            color: "warning",
            change: "-5%",
            description: "Require attention"
          },
          { 
            title: "Service Requests", 
            value: stats.serviceRequests, 
            icon: FaConciergeBell, 
            color: "danger",
            change: "+10%",
            description: "Guest requests"
          },
          { 
            title: "Pending Invoices", 
            value: stats.pendingInvoices, 
            icon: FaReceipt, 
            color: "secondary",
            change: "+7%",
            description: "Awaiting payment"
          },
          { 
            title: "Total Payments", 
            value: stats.revenue > 0 ? Math.floor(stats.revenue / 100) : 0, 
            icon: FaCreditCard, 
            color: "primary",
            change: "+15%",
            description: "Processed payments"
          }
        ].map((stat, index) => (
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6" key={index}>
            <div className={`card border-${stat.color} border-top-0 border-end-0 border-bottom-0 border-4`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">{stat.title}</p>
                    <h4 className="mb-0">{stat.value}</h4>
                    <small className="text-muted">{stat.description}</small>
                  </div>
                  <div className={`avatar-sm rounded-circle bg-${stat.color}-subtle d-flex align-items-center justify-content-center`}>
                    <stat.icon className={`text-${stat.color} fs-4`} />
                  </div>
                </div>
                <div className="mt-3">
                  <span className={`badge bg-${stat.change.startsWith('+') ? 'success' : 'danger'}-subtle text-${stat.change.startsWith('+') ? 'success' : 'danger'} p-1`}>
                    {stat.change} from last month
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="row g-3">
        {/* Recent Bookings */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaCalendarAlt className="me-2" />
                Recent Bookings
              </h5>
              <span className="badge bg-light text-primary">{stats.recentBookings.length}</span>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Guest</th>
                      <th>Room</th>
                      <th>Check In</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentBookings.map((booking, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center me-2">
                              <FaUsers className="text-primary" />
                            </div>
                            <span>{booking.GuestId?.Name || "Guest"}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-info-subtle text-info">
                            {booking.RoomId?.RoomNumber || "N/A"}
                          </span>
                        </td>
                        <td>{new Date(booking.CheckInDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge bg-${booking.Status === 'checked-in' ? 'success' : 'warning'}`}>
                            {booking.Status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Top Rooms */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaStar className="me-2" />
                Premium Rooms
              </h5>
              <span className="badge bg-light text-success">{stats.topRooms.length}</span>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Room</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topRooms.map((room, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm bg-success-subtle rounded-circle d-flex align-items-center justify-content-center me-2">
                              <FaBed className="text-success" />
                            </div>
                            <strong>{room.RoomNumber}</strong>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-secondary">{room.Type}</span>
                        </td>
                        <td>
                          <strong className="text-success">${room.Price}</strong>
                          <small className="text-muted d-block">per night</small>
                        </td>
                        <td>
                          <span className={`badge bg-${room.Status === 'available' ? 'success' : 'warning'}`}>
                            {room.Status}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditRoom(room)}
                          >
                            <FaEdit />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* User Activity */}
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaUsers className="me-2" />
                Recent User Activity
              </h5>
              <span className="badge bg-light text-info">{stats.userActivity.length}</span>
            </div>
            <div className="card-body">
              <div className="row">
                {stats.userActivity.map((user, index) => (
                  <div className="col-md-4 col-sm-6 mb-3" key={index}>
                    <div className="border rounded p-3">
                      <div className="d-flex align-items-center mb-2">
                        <div className="avatar-sm bg-info-subtle rounded-circle d-flex align-items-center justify-content-center me-3">
                          <FaUserTag className="text-info" />
                        </div>
                        <div>
                          <h6 className="mb-0">{user.Name}</h6>
                          <small className="text-muted">{user.Email}</small>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className={`badge bg-${user.Role === 'admin' ? 'danger' : user.Role === 'manager' ? 'warning' : 'info'}`}>
                          {user.Role}
                        </span>
                        <span className={`badge bg-${user.Status === 'active' ? 'success' : 'secondary'}`}>
                          {user.Status}
                        </span>
                      </div>
                      <div className="mt-2">
                        <small className="text-muted">
                          <FaClock className="me-1" />
                          Last active: {new Date(user.updatedAt || new Date()).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              <FaUsers className="me-2" />
              User Management
            </h4>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-primary"
                onClick={() => {
                  setEditingUser(null);
                  setUserForm({
                    Name: "", Email: "", Password: "", Role: "guest",
                    Phone: "", Address: "", Status: "active"
                  });
                }}
              >
                <FaUserPlus className="me-1" />
                Add User
              </button>
              <button 
                className="btn btn-outline-secondary"
                onClick={loadDashboardData}
                disabled={loading}
              >
                <FaSync className={`me-1 ${loading ? 'fa-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Form */}
      {(editingUser || !editingUser) && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  {editingUser ? (
                    <>
                      <FaUserEdit className="me-2" />
                      Edit User
                    </>
                  ) : (
                    <>
                      <FaUserPlus className="me-2" />
                      Create New User
                    </>
                  )}
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="John Doe"
                      value={userForm.Name}
                      onChange={(e) => setUserForm({...userForm, Name: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="john@example.com"
                      value={userForm.Email}
                      onChange={(e) => setUserForm({...userForm, Email: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      {editingUser ? "New Password (leave blank to keep current)" : "Password *"}
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="••••••••"
                        value={userForm.Password}
                        onChange={(e) => setUserForm({...userForm, Password: e.target.value})}
                      />
                      <button 
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Role *</label>
                    <select
                      className="form-select"
                      value={userForm.Role}
                      onChange={(e) => setUserForm({...userForm, Role: e.target.value})}
                    >
                      <option value="admin">Administrator</option>
                      <option value="manager">Manager</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="housekeeping">Housekeeping</option>
                      <option value="guest">Guest</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaPhone />
                      </span>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="+1 (555) 123-4567"
                        value={userForm.Phone}
                        onChange={(e) => setUserForm({...userForm, Phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={userForm.Status}
                      onChange={(e) => setUserForm({...userForm, Status: e.target.value})}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="123 Main St, City, Country"
                      value={userForm.Address}
                      onChange={(e) => setUserForm({...userForm, Address: e.target.value})}
                    />
                  </div>
                  <div className="col-12">
                    <div className="d-flex justify-content-end gap-2">
                      {editingUser && (
                        <button
                          className="btn btn-secondary"
                          onClick={() => {
                            setEditingUser(null);
                            setUserForm({
                              Name: "", Email: "", Password: "", Role: "guest",
                              Phone: "", Address: "", Status: "active"
                            });
                          }}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        className="btn btn-primary"
                        onClick={handleCreateUser}
                        disabled={loading}
                      >
                        {editingUser ? "Update User" : "Create User"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Search Users</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name, email, or phone..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Filter by Role</label>
                  <select
                    className="form-select"
                    value={selectedUserRole}
                    onChange={(e) => setSelectedUserRole(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Administrator</option>
                    <option value="manager">Manager</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="housekeeping">Housekeeping</option>
                    <option value="guest">Guest</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Filter by Status</label>
                  <select
                    className="form-select"
                    value={selectedUserStatus}
                    onChange={(e) => setSelectedUserStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">User List ({filteredUsers.length} users)</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>User</th>
                      <th>Contact</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <div className="text-muted">
                            <FaUsers className="fs-1 mb-2" />
                            <p>No users found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center me-3">
                                <FaUserTag className="text-primary" />
                              </div>
                              <div>
                                <h6 className="mb-0">{user.Name}</h6>
                                <small className="text-muted">ID: {user._id.slice(-6)}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="d-flex align-items-center mb-1">
                                <FaEnvelope className="text-muted me-2" size={12} />
                                <small>{user.Email}</small>
                              </div>
                              {user.Phone && (
                                <div className="d-flex align-items-center">
                                  <FaPhone className="text-muted me-2" size={12} />
                                  <small>{user.Phone}</small>
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className={`badge bg-${user.Role === 'admin' ? 'danger' : user.Role === 'manager' ? 'warning' : user.Role === 'receptionist' ? 'info' : user.Role === 'housekeeping' ? 'success' : 'secondary'}`}>
                              {user.Role}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className={`badge bg-${user.Status === 'active' ? 'success' : 'secondary'}`}>
                                {user.Status === 'active' ? (
                                  <FaCheckCircle className="me-1" />
                                ) : (
                                  <FaTimesCircle className="me-1" />
                                )}
                                {user.Status}
                              </span>
                            </div>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(user.createdAt || new Date()).toLocaleDateString()}
                            </small>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => handleEditUser(user)}
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                className={`btn btn-sm btn-outline-${user.Status === 'active' ? 'secondary' : 'success'}`}
                                onClick={() => handleToggleUserStatus(user)}
                                title={user.Status === 'active' ? 'Deactivate' : 'Activate'}
                              >
                                {user.Status === 'active' ? <FaLock /> : <FaUnlock />}
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteUser(user._id)}
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRooms = () => (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              <FaBed className="me-2" />
              Room Management
            </h4>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-primary"
                onClick={() => {
                  setEditingRoom(null);
                  setRoomForm({
                    RoomNumber: "", Type: "Deluxe", Price: "", Capacity: 2,
                    Amenities: ["WiFi", "AC", "TV"], Floor: 1, Status: "available",
                    Description: "", MaxOccupancy: 2, BedType: "Queen", View: "City"
                  });
                }}
              >
                <FaPlus className="me-1" />
                Add Room
              </button>
              <button 
                className="btn btn-outline-secondary"
                onClick={loadDashboardData}
                disabled={loading}
              >
                <FaSync className={`me-1 ${loading ? 'fa-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Room Form */}
      {(editingRoom || !editingRoom) && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  {editingRoom ? (
                    <>
                      <FaEdit className="me-2" />
                      Edit Room
                    </>
                  ) : (
                    <>
                      <FaPlus className="me-2" />
                      Create New Room
                    </>
                  )}
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label">Room Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="101"
                      value={roomForm.RoomNumber}
                      onChange={(e) => setRoomForm({...roomForm, RoomNumber: e.target.value})}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Type *</label>
                    <select
                      className="form-select"
                      value={roomForm.Type}
                      onChange={(e) => setRoomForm({...roomForm, Type: e.target.value})}
                    >
                      <option value="Standard">Standard</option>
                      <option value="Deluxe">Deluxe</option>
                      <option value="Suite">Suite</option>
                      <option value="Executive">Executive</option>
                      <option value="Presidential">Presidential</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Price per Night ($) *</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="150"
                      min="0"
                      step="0.01"
                      value={roomForm.Price}
                      onChange={(e) => setRoomForm({...roomForm, Price: e.target.value})}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Capacity *</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="2"
                      min="1"
                      max="10"
                      value={roomForm.Capacity}
                      onChange={(e) => setRoomForm({...roomForm, Capacity: e.target.value})}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Floor</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="1"
                      min="1"
                      max="50"
                      value={roomForm.Floor}
                      onChange={(e) => setRoomForm({...roomForm, Floor: e.target.value})}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Max Occupancy</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="2"
                      min="1"
                      max="10"
                      value={roomForm.MaxOccupancy}
                      onChange={(e) => setRoomForm({...roomForm, MaxOccupancy: e.target.value})}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Bed Type</label>
                    <select
                      className="form-select"
                      value={roomForm.BedType}
                      onChange={(e) => setRoomForm({...roomForm, BedType: e.target.value})}
                    >
                      <option value="Single">Single</option>
                      <option value="Double">Double</option>
                      <option value="Queen">Queen</option>
                      <option value="King">King</option>
                      <option value="Twin">Twin</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">View</label>
                    <select
                      className="form-select"
                      value={roomForm.View}
                      onChange={(e) => setRoomForm({...roomForm, View: e.target.value})}
                    >
                      <option value="City">City View</option>
                      <option value="Ocean">Ocean View</option>
                      <option value="Garden">Garden View</option>
                      <option value="Mountain">Mountain View</option>
                      <option value="Pool">Pool View</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={roomForm.Status}
                      onChange={(e) => setRoomForm({...roomForm, Status: e.target.value})}
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="reserved">Reserved</option>
                    </select>
                  </div>
                  
                  <div className="col-12">
                    <label className="form-label">Amenities</label>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {roomForm.Amenities.map((amenity, index) => (
                        <span key={index} className="badge bg-primary d-flex align-items-center">
                          {amenity}
                          <button 
                            type="button" 
                            className="btn-close btn-close-white ms-2" 
                            style={{fontSize: '10px'}}
                            onClick={() => removeAmenity(amenity)}
                          ></button>
                        </span>
                      ))}
                    </div>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add amenity..."
                        value={newAmenity}
                        onChange={(e) => setNewAmenity(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
                      />
                      <button
                        className="btn btn-outline-primary"
                        type="button"
                        onClick={addAmenity}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Room description, features, and special notes..."
                      value={roomForm.Description}
                      onChange={(e) => setRoomForm({...roomForm, Description: e.target.value})}
                    />
                  </div>
                  
                  <div className="col-12">
                    <div className="d-flex justify-content-end gap-2">
                      {editingRoom && (
                        <button
                          className="btn btn-secondary"
                          onClick={() => {
                            setEditingRoom(null);
                            setRoomForm({
                              RoomNumber: "", Type: "Deluxe", Price: "", Capacity: 2,
                              Amenities: ["WiFi", "AC", "TV"], Floor: 1, Status: "available",
                              Description: "", MaxOccupancy: 2, BedType: "Queen", View: "City"
                            });
                          }}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        className="btn btn-success"
                        onClick={handleCreateRoom}
                        disabled={loading}
                      >
                        {editingRoom ? "Update Room" : "Create Room"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Search Rooms</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by room number, type, or description..."
                      value={roomSearch}
                      onChange={(e) => setRoomSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Filter by Type</label>
                  <select
                    className="form-select"
                    value={selectedRoomType}
                    onChange={(e) => setSelectedRoomType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Executive">Executive</option>
                    <option value="Presidential">Presidential</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Filter by Status</label>
                  <select
                    className="form-select"
                    value={selectedRoomStatus}
                    onChange={(e) => setSelectedRoomStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="reserved">Reserved</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Room Inventory ({filteredRooms.length} rooms)</h5>
            </div>
            <div className="card-body">
              {filteredRooms.length === 0 ? (
                <div className="text-center py-5">
                  <FaBed className="fs-1 text-muted mb-3" />
                  <p className="text-muted">No rooms found</p>
                </div>
              ) : (
                <div className="row">
                  {filteredRooms.map((room) => (
                    <div className="col-xl-4 col-lg-6 col-md-6 mb-4" key={room._id}>
                      <div className={`card h-100 border-${room.Status === 'available' ? 'success' : room.Status === 'occupied' ? 'danger' : 'warning'} border-top-0 border-end-0 border-bottom-0 border-4`}>
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <h5 className="card-title mb-1">Room {room.RoomNumber}</h5>
                              <span className="badge bg-secondary">{room.Type}</span>
                            </div>
                            <div className="dropdown">
                              <button className="btn btn-sm btn-outline-secondary" type="button" data-bs-toggle="dropdown">
                                <FaEllipsisV />
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <button 
                                    className="dropdown-item"
                                    onClick={() => handleEditRoom(room)}
                                  >
                                    <FaEdit className="me-2" />
                                    Edit
                                  </button>
                                </li>
                                <li>
                                  <button 
                                    className="dropdown-item"
                                    onClick={() => handleToggleRoomStatus(room)}
                                  >
                                    <FaWrench className="me-2" />
                                    Change Status
                                  </button>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                  <button 
                                    className="dropdown-item text-danger"
                                    onClick={() => handleDeleteRoom(room._id)}
                                  >
                                    <FaTrash className="me-2" />
                                    Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <span className={`badge bg-${room.Status === 'available' ? 'success' : room.Status === 'occupied' ? 'danger' : 'warning'} p-2`}>
                              {room.Status.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="row g-2 mb-3">
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <FaDollarSign className="text-success me-2" />
                                <div>
                                  <small className="text-muted">Price</small>
                                  <h6 className="mb-0">${room.Price}/night</h6>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <FaUsers className="text-primary me-2" />
                                <div>
                                  <small className="text-muted">Capacity</small>
                                  <h6 className="mb-0">{room.Capacity} guests</h6>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <FaHotel className="text-info me-2" />
                                <div>
                                  <small className="text-muted">Floor</small>
                                  <h6 className="mb-0">Floor {room.Floor}</h6>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <FaBed className="text-warning me-2" />
                                <div>
                                  <small className="text-muted">Bed</small>
                                  <h6 className="mb-0">{room.BedType || "Queen"}</h6>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {room.Amenities && room.Amenities.length > 0 && (
                            <div className="mb-3">
                              <small className="text-muted d-block mb-1">Amenities:</small>
                              <div className="d-flex flex-wrap gap-1">
                                {room.Amenities.slice(0, 3).map((amenity, index) => (
                                  <span key={index} className="badge bg-light text-dark border">
                                    {amenity}
                                  </span>
                                ))}
                                {room.Amenities.length > 3 && (
                                  <span className="badge bg-light text-dark border">
                                    +{room.Amenities.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {room.Description && (
                            <div className="mb-3">
                              <small className="text-muted d-block mb-1">Description:</small>
                              <p className="mb-0 small">{room.Description.substring(0, 100)}...</p>
                            </div>
                          )}
                          
                          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditRoom(room)}
                            >
                              <FaEdit className="me-1" />
                              Edit
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteRoom(room._id)}
                            >
                              <FaTrash className="me-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              <FaChartLine className="me-2" />
              Reports & Analytics
            </h4>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-primary"
                onClick={generateReport}
                disabled={loading}
              >
                <FaSync className={`me-1 ${loading ? 'fa-spin' : ''}`} />
                Generate Report
              </button>
              <button 
                className="btn btn-outline-success"
                onClick={exportReport}
                disabled={!reports[reportType + "Report"]?.length}
              >
                <FaDownload className="me-1" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Controls */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Report Configuration</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Report Type</label>
                  <select
                    className="form-select"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option value="revenue">Revenue Report</option>
                    <option value="occupancy">Occupancy Report</option>
                    <option value="users">User Report</option>
                    <option value="bookings">Booking Report</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Summary */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Report Summary</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="border rounded p-3 text-center">
                    <h6 className="text-muted">Report Type</h6>
                    <h4 className="text-primary">{reportType.charAt(0).toUpperCase() + reportType.slice(1)}</h4>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border rounded p-3 text-center">
                    <h6 className="text-muted">Date Range</h6>
                    <h6>{dateRange.start} to {dateRange.end}</h6>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border rounded p-3 text-center">
                    <h6 className="text-muted">Total Records</h6>
                    <h4>{reports[reportType + "Report"]?.length || 0}</h4>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border rounded p-3 text-center">
                    <h6 className="text-muted">Last Generated</h6>
                    <h6>{new Date().toLocaleDateString()}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Data */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Report Data</h5>
              <span className="badge bg-primary">
                {reports[reportType + "Report"]?.length || 0} records
              </span>
            </div>
            <div className="card-body">
              {!reports[reportType + "Report"]?.length ? (
                <div className="text-center py-5">
                  <FaChartLine className="fs-1 text-muted mb-3" />
                  <p className="text-muted">No report data available. Click "Generate Report" to create a report.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        {Object.keys(reports[reportType + "Report"][0] || {}).map((header) => (
                          <th key={header}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reports[reportType + "Report"].map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value, i) => (
                            <td key={i}>{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              <FaCog className="me-2" />
              System Settings
            </h4>
            <button 
              className="btn btn-primary"
              onClick={handleSaveSettings}
              disabled={loading}
            >
              <FaCheckCircle className="me-1" />
              Save Settings
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Hotel Configuration</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Hotel Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.hotelName}
                    onChange={(e) => setSettings({...settings, hotelName: e.target.value})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Contact Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={settings.phone}
                    onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Tax Rate (%) *</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    max="100"
                    step="0.1"
                    value={settings.taxRate}
                    onChange={(e) => setSettings({...settings, taxRate: e.target.value})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Check-in Time *</label>
                  <input
                    type="time"
                    className="form-control"
                    value={settings.checkInTime}
                    onChange={(e) => setSettings({...settings, checkInTime: e.target.value})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Check-out Time *</label>
                  <input
                    type="time"
                    className="form-control"
                    value={settings.checkOutTime}
                    onChange={(e) => setSettings({...settings, checkOutTime: e.target.value})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Late Checkout Fee ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    step="0.01"
                    value={settings.lateCheckoutFee}
                    onChange={(e) => setSettings({...settings, lateCheckoutFee: e.target.value})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Early Check-in Fee ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    step="0.01"
                    value={settings.earlyCheckinFee}
                    onChange={(e) => setSettings({...settings, earlyCheckinFee: e.target.value})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Minimum Booking Days</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={settings.minBookingDays}
                    onChange={(e) => setSettings({...settings, minBookingDays: e.target.value})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Maximum Booking Days</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    max="365"
                    value={settings.maxBookingDays}
                    onChange={(e) => setSettings({...settings, maxBookingDays: e.target.value})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Default Room Type</label>
                  <select
                    className="form-select"
                    value={settings.defaultRoomType}
                    onChange={(e) => setSettings({...settings, defaultRoomType: e.target.value})}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Executive">Executive</option>
                    <option value="Presidential">Presidential</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Currency</label>
                  <select
                    className="form-select"
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Address *</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={settings.address}
                    onChange={(e) => setSettings({...settings, address: e.target.value})}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Cancellation Policy *</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={settings.cancellationPolicy}
                    onChange={(e) => setSettings({...settings, cancellationPolicy: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Features */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">System Features</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                    />
                    <label className="form-check-label" htmlFor="maintenanceMode">
                      Maintenance Mode
                    </label>
                    <small className="form-text text-muted d-block">
                      Temporarily disable the booking system
                    </small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="autoConfirmBookings"
                      checked={settings.autoConfirmBookings}
                      onChange={(e) => setSettings({...settings, autoConfirmBookings: e.target.checked})}
                    />
                    <label className="form-check-label" htmlFor="autoConfirmBookings">
                      Auto-confirm Bookings
                    </label>
                    <small className="form-text text-muted d-block">
                      Automatically confirm new bookings
                    </small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="allowOnlineBooking"
                      checked={settings.allowOnlineBooking}
                      onChange={(e) => setSettings({...settings, allowOnlineBooking: e.target.checked})}
                    />
                    <label className="form-check-label" htmlFor="allowOnlineBooking">
                      Allow Online Booking
                    </label>
                    <small className="form-text text-muted d-block">
                      Enable online booking for guests
                    </small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="requireIDCheck"
                      checked={settings.requireIDCheck}
                      onChange={(e) => setSettings({...settings, requireIDCheck: e.target.checked})}
                    />
                    <label className="form-check-label" htmlFor="requireIDCheck">
                      Require ID Check
                    </label>
                    <small className="form-text text-muted d-block">
                      Require ID verification at check-in
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Permissions Notice */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-primary">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <FaShieldAlt className="me-2" />
                Administrator Permissions
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-success mb-3">
                    <FaCheckCircle className="me-2" />
                    Administrator CAN Do:
                  </h6>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <FaUserPlus className="text-success me-2" />
                      Create users and assign roles
                    </li>
                    <li className="list-group-item">
                      <FaBed className="text-success me-2" />
                      Configure rooms and pricing
                    </li>
                    <li className="list-group-item">
                      <FaChartLine className="text-success me-2" />
                      View all reports and analytics
                    </li>
                    <li className="list-group-item">
                      <FaCog className="text-success me-2" />
                      Modify system settings
                    </li>
                    <li className="list-group-item">
                      <FaShieldAlt className="text-success me-2" />
                      Manage user permissions
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6 className="text-danger mb-3">
                    <FaTimesCircle className="me-2" />
                    Administrator CANNOT Do:
                  </h6>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <FaClipboardCheck className="text-danger me-2" />
                      Daily check-in/check-out operations
                    </li>
                    <li className="list-group-item">
                      <FaConciergeBell className="text-danger me-2" />
                      Handle service requests directly
                    </li>
                    <li className="list-group-item">
                      <FaTasks className="text-danger me-2" />
                      Assign daily housekeeping tasks
                    </li>
                    <li className="list-group-item">
                      <FaReceipt className="text-danger me-2" />
                      Process payments at reception
                    </li>
                    <li className="list-group-item">
                      <FaWrench className="text-danger me-2" />
                      Manage maintenance tasks directly
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid">
      {/* Loading Overlay */}
      {loading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50 z-3">
          <div className="text-center bg-white p-4 rounded shadow-lg">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mb-0">Processing...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-1">
                    <FaShieldAlt className="me-2" />
                    Admin Dashboard
                  </h3>
                  <p className="mb-0">System Owner Control Panel</p>
                </div>
                <div className="text-end">
                  <p className="mb-1">Logged in as: <strong>System Owner</strong></p>
                  <small>Administrator Role</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body p-0">
              <ul className="nav nav-tabs nav-justified">
                <li className="nav-item">
                  <button
                    className={`nav-link ${tab === "dashboard" ? "active" : ""}`}
                    onClick={() => setTab("dashboard")}
                  >
                    <FaChartLine className="me-2" />
                    Dashboard
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${tab === "users" ? "active" : ""}`}
                    onClick={() => setTab("users")}
                  >
                    <FaUsers className="me-2" />
                    Users
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${tab === "rooms" ? "active" : ""}`}
                    onClick={() => setTab("rooms")}
                  >
                    <FaBed className="me-2" />
                    Rooms
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${tab === "reports" ? "active" : ""}`}
                    onClick={() => setTab("reports")}
                  >
                    <FaFileInvoiceDollar className="me-2" />
                    Reports
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${tab === "settings" ? "active" : ""}`}
                    onClick={() => setTab("settings")}
                  >
                    <FaCog className="me-2" />
                    Settings
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {tab === "dashboard" && renderDashboard()}
      {tab === "users" && renderUsers()}
      {tab === "rooms" && renderRooms()}
      {tab === "reports" && renderReports()}
      {tab === "settings" && renderSettings()}

      {/* Footer */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body text-center">
              <small className="text-muted">
                © {new Date().getFullYear()} Hotel Management System - Admin Dashboard v2.0
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
// Add this CSS in your main CSS file or as a style tag
const styles = `
/* Custom styles for Admin dashboard */
.avatar-sm {
  width: 40px;
  height: 40px;
}

.border-4 {
  border-width: 4px !important;
}

.z-3 {
  z-index: 1030;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  margin-bottom: 1.5rem;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.05);
}
`;

export default Admin;