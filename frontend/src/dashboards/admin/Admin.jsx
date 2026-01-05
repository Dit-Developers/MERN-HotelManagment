import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3900";

const Admin = () => {
  const [tab, setTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const auth = { headers: { Authorization: `Bearer ${token}` } };

  // ========================= DASHBOARD STATS =========================
  const [stats, setStats] = useState({
    users: 0,
    rooms: 0,
    availableRooms: 0,
    bookings: 0,
    activeBookings: 0,
    invoices: 0,
    pendingInvoices: 0,
    revenue: 0,
    tasks: 0,
    pendingTasks: 0,
    serviceRequests: 0,
    pendingServices: 0,
  });

  const loadStats = async () => {
    try {
      const [users, rooms, bookings, invoices, payments, tasks, services] = await Promise.all([
        axios.get(`${API_BASE}/users`, auth),
        axios.get(`${API_BASE}/rooms`, auth),
        axios.get(`${API_BASE}/bookings`, auth),
        axios.get(`${API_BASE}/invoices`, auth),
        axios.get(`${API_BASE}/payments`, auth),
        axios.get(`${API_BASE}/tasks`, auth),
        axios.get(`${API_BASE}/services`, auth),
      ]);

      setStats({
        users: users.data.length,
        rooms: rooms.data.length,
        availableRooms: rooms.data.filter(r => r.Status === "available").length,
        bookings: bookings.data.length,
        activeBookings: bookings.data.filter(b => 
          ["reserved", "checked-in"].includes(b.Status)
        ).length,
        invoices: invoices.data.length,
        pendingInvoices: invoices.data.filter(i => i.PaymentStatus === "pending").length,
        revenue: payments.data.reduce((t, p) => t + (p.Amount || 0), 0),
        tasks: tasks.data.length,
        pendingTasks: tasks.data.filter(t => t.Status === "pending").length,
        serviceRequests: services.data.length,
        pendingServices: services.data.filter(s => s.Status === "requested").length,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

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
  });
  const [userSearch, setUserSearch] = useState("");

  const loadUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users`, auth);
      setUsers(res.data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const submitUser = async () => {
    try {
      setLoading(true);
      if (editingUser) {
        await axios.put(
          `${API_BASE}/users/Update/${editingUser._id}`,
          userForm,
          auth
        );
      } else {
        await axios.post(`${API_BASE}/users/Register`, userForm, auth);
      }
      resetUserForm();
      loadUsers();
      loadStats();
      alert("User saved successfully!");
    } catch (error) {
      console.error("Error submitting user:", error);
      alert("Error saving user: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const editUser = (u) => {
    setEditingUser(u);
    setUserForm({ ...u, Password: "" });
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete user?")) return;
    try {
      await axios.delete(`${API_BASE}/users/Delete/${id}`, auth);
      loadUsers();
      loadStats();
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user");
    }
  };

  const resetUserForm = () => {
    setEditingUser(null);
    setUserForm({ 
      Name: "", 
      Email: "", 
      Password: "", 
      Role: "guest", 
      Phone: "", 
      Address: "" 
    });
  };

  // ========================= ROOMS =========================
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({
    RoomNumber: "",
    Type: "Deluxe",
    Price: "",
    Capacity: 2,
    Amenities: [],
    Floor: 1,
    Status: "available"
  });
  const [newAmenity, setNewAmenity] = useState("");

  const loadRooms = async () => {
    try {
      const res = await axios.get(`${API_BASE}/rooms`, auth);
      setRooms(res.data);
    } catch (error) {
      console.error("Error loading rooms:", error);
    }
  };

  const submitRoom = async () => {
    try {
      setLoading(true);
      const roomData = {
        ...roomForm,
        Price: Number(roomForm.Price),
        Capacity: Number(roomForm.Capacity),
        Floor: Number(roomForm.Floor)
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
      resetRoomForm();
      loadRooms();
      loadStats();
      alert("Room saved successfully!");
    } catch (error) {
      console.error("Error saving room:", error);
      alert("Error saving room: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const editRoom = (r) => {
    setEditingRoom(r);
    setRoomForm({
      RoomNumber: r.RoomNumber || "",
      Type: r.Type || "Deluxe",
      Price: r.Price || "",
      Capacity: r.Capacity || 2,
      Amenities: r.Amenities || [],
      Floor: r.Floor || 1,
      Status: r.Status || "available"
    });
  };

  const deleteRoom = async (id) => {
    if (!window.confirm("Delete room?")) return;
    try {
      await axios.delete(`${API_BASE}/rooms/Delete/${id}`, auth);
      loadRooms();
      loadStats();
      alert("Room deleted successfully!");
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("Error deleting room");
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

  const resetRoomForm = () => {
    setEditingRoom(null);
    setRoomForm({
      RoomNumber: "",
      Type: "Deluxe",
      Price: "",
      Capacity: 2,
      Amenities: [],
      Floor: 1,
      Status: "available"
    });
    setNewAmenity("");
  };

  // ========================= BOOKINGS =========================
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    GuestId: "",
    RoomId: "",
    CheckInDate: "",
    CheckOutDate: "",
    Status: "reserved"
  });

  const loadBookings = async () => {
    try {
      const res = await axios.get(`${API_BASE}/bookings`, auth);
      setBookings(res.data);
    } catch (error) {
      console.error("Error loading bookings:", error);
    }
  };

  const submitBooking = async () => {
    try {
      setLoading(true);
      if (editingBooking) {
        await axios.put(
          `${API_BASE}/bookings/Update/${editingBooking._id}`,
          bookingForm,
          auth
        );
      } else {
        await axios.post(`${API_BASE}/bookings/create`, bookingForm, auth);
      }
      resetBookingForm();
      loadBookings();
      loadStats();
      alert("Booking saved successfully!");
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("Error saving booking: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const editBooking = (b) => {
    setEditingBooking(b);
    setBookingForm({
      GuestId: b.GuestId?._id || b.GuestId || "",
      RoomId: b.RoomId?._id || b.RoomId || "",
      CheckInDate: b.CheckInDate ? new Date(b.CheckInDate).toISOString().split('T')[0] : "",
      CheckOutDate: b.CheckOutDate ? new Date(b.CheckOutDate).toISOString().split('T')[0] : "",
      Status: b.Status || "reserved"
    });
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete booking?")) return;
    try {
      await axios.delete(`${API_BASE}/bookings/Delete/${id}`, auth);
      loadBookings();
      loadStats();
      alert("Booking deleted successfully!");
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Error deleting booking");
    }
  };

  const resetBookingForm = () => {
    setEditingBooking(null);
    setBookingForm({
      GuestId: "",
      RoomId: "",
      CheckInDate: "",
      CheckOutDate: "",
      Status: "reserved"
    });
  };

  // ========================= INVOICES =========================
  const [invoices, setInvoices] = useState([]);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [invoiceForm, setInvoiceForm] = useState({
    BookingId: "",
    GuestId: "",
    Items: [{ Description: "Room Charge", Amount: 0 }],
    Tax: 0,
    Discount: 0,
    TotalAmount: 0,
    PaymentStatus: "pending"
  });

  const loadInvoices = async () => {
    try {
      const res = await axios.get(`${API_BASE}/invoices`, auth);
      setInvoices(res.data);
    } catch (error) {
      console.error("Error loading invoices:", error);
    }
  };

  const submitInvoice = async () => {
    try {
      setLoading(true);
      const invoiceData = {
        ...invoiceForm,
        Items: invoiceForm.Items.map(item => ({
          ...item,
          Amount: Number(item.Amount)
        })),
        Tax: Number(invoiceForm.Tax),
        Discount: Number(invoiceForm.Discount),
        TotalAmount: Number(invoiceForm.TotalAmount)
      };

      if (editingInvoice) {
        await axios.put(
          `${API_BASE}/invoices/Update/${editingInvoice._id}`,
          invoiceData,
          auth
        );
      } else {
        await axios.post(`${API_BASE}/invoices/create`, invoiceData, auth);
      }
      resetInvoiceForm();
      loadInvoices();
      loadStats();
      alert("Invoice saved successfully!");
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Error saving invoice: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const editInvoice = (inv) => {
    setEditingInvoice(inv);
    setInvoiceForm({
      BookingId: inv.BookingId?._id || inv.BookingId || "",
      GuestId: inv.GuestId?._id || inv.GuestId || "",
      Items: inv.Items || [{ Description: "Room Charge", Amount: 0 }],
      Tax: inv.Tax || 0,
      Discount: inv.Discount || 0,
      TotalAmount: inv.TotalAmount || 0,
      PaymentStatus: inv.PaymentStatus || "pending"
    });
  };

  const deleteInvoice = async (id) => {
    if (!window.confirm("Delete invoice?")) return;
    try {
      await axios.delete(`${API_BASE}/invoices/Delete/${id}`, auth);
      loadInvoices();
      loadStats();
      alert("Invoice deleted successfully!");
    } catch (error) {
      console.error("Error deleting invoice:", error);
      alert("Error deleting invoice");
    }
  };

  const addInvoiceItem = () => {
    setInvoiceForm({
      ...invoiceForm,
      Items: [...invoiceForm.Items, { Description: "", Amount: 0 }]
    });
  };

  const removeInvoiceItem = (index) => {
    const newItems = [...invoiceForm.Items];
    newItems.splice(index, 1);
    setInvoiceForm({ ...invoiceForm, Items: newItems });
  };

  const updateInvoiceItem = (index, field, value) => {
    const newItems = [...invoiceForm.Items];
    newItems[index] = { ...newItems[index], [field]: value };
    setInvoiceForm({ ...invoiceForm, Items: newItems });
  };

  const resetInvoiceForm = () => {
    setEditingInvoice(null);
    setInvoiceForm({
      BookingId: "",
      GuestId: "",
      Items: [{ Description: "Room Charge", Amount: 0 }],
      Tax: 0,
      Discount: 0,
      TotalAmount: 0,
      PaymentStatus: "pending"
    });
  };

  // ========================= PAYMENTS =========================
  const [payments, setPayments] = useState([]);
  const [editingPayment, setEditingPayment] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    InvoiceId: "",
    Amount: "",
    Method: "cash",
    PaymentDate: new Date().toISOString().split('T')[0]
  });

  const loadPayments = async () => {
    try {
      const res = await axios.get(`${API_BASE}/payments`, auth);
      setPayments(res.data);
    } catch (error) {
      console.error("Error loading payments:", error);
    }
  };

  const submitPayment = async () => {
    try {
      setLoading(true);
      const paymentData = {
        ...paymentForm,
        Amount: Number(paymentForm.Amount)
      };

      if (editingPayment) {
        await axios.put(
          `${API_BASE}/payments/Update/${editingPayment._id}`,
          paymentData,
          auth
        );
      } else {
        await axios.post(`${API_BASE}/payments/create`, paymentData, auth);
      }
      resetPaymentForm();
      loadPayments();
      loadStats();
      alert("Payment saved successfully!");
    } catch (error) {
      console.error("Error saving payment:", error);
      alert("Error saving payment: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const editPayment = (p) => {
    setEditingPayment(p);
    setPaymentForm({
      InvoiceId: p.InvoiceId?._id || p.InvoiceId || "",
      Amount: p.Amount || "",
      Method: p.Method || "cash",
      PaymentDate: p.PaymentDate ? new Date(p.PaymentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    });
  };

  const deletePayment = async (id) => {
    if (!window.confirm("Delete payment?")) return;
    try {
      await axios.delete(`${API_BASE}/payments/Delete/${id}`, auth);
      loadPayments();
      loadStats();
      alert("Payment deleted successfully!");
    } catch (error) {
      console.error("Error deleting payment:", error);
      alert("Error deleting payment");
    }
  };

  const resetPaymentForm = () => {
    setEditingPayment(null);
    setPaymentForm({
      InvoiceId: "",
      Amount: "",
      Method: "cash",
      PaymentDate: new Date().toISOString().split('T')[0]
    });
  };

  // ========================= TASKS =========================
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    RoomId: "",
    ReportedBy: "",
    AssignedTo: "",
    Type: "housekeeping",
    Description: "",
    Status: "pending"
  });

  const loadTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/tasks`, auth);
      setTasks(res.data);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const submitTask = async () => {
    try {
      setLoading(true);
      if (editingTask) {
        await axios.put(
          `${API_BASE}/tasks/Update/${editingTask._id}`,
          taskForm,
          auth
        );
      } else {
        await axios.post(`${API_BASE}/tasks/create`, taskForm, auth);
      }
      resetTaskForm();
      loadTasks();
      loadStats();
      alert("Task saved successfully!");
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Error saving task: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const editTask = (t) => {
    setEditingTask(t);
    setTaskForm({
      RoomId: t.RoomId?._id || t.RoomId || "",
      ReportedBy: t.ReportedBy?._id || t.ReportedBy || "",
      AssignedTo: t.AssignedTo?._id || t.AssignedTo || "",
      Type: t.Type || "housekeeping",
      Description: t.Description || "",
      Status: t.Status || "pending"
    });
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete task?")) return;
    try {
      await axios.delete(`${API_BASE}/tasks/Delete/${id}`, auth);
      loadTasks();
      loadStats();
      alert("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Error deleting task");
    }
  };

  const resetTaskForm = () => {
    setEditingTask(null);
    setTaskForm({
      RoomId: "",
      ReportedBy: "",
      AssignedTo: "",
      Type: "housekeeping",
      Description: "",
      Status: "pending"
    });
  };

  // ========================= SERVICE REQUESTS =========================
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    GuestId: "",
    BookingId: "",
    ServiceType: "Room Service",
    Details: "",
    Status: "requested"
  });

  const loadServices = async () => {
    try {
      const res = await axios.get(`${API_BASE}/services`, auth);
      setServices(res.data);
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };

  const submitService = async () => {
    try {
      setLoading(true);
      if (editingService) {
        await axios.put(
          `${API_BASE}/services/Update/${editingService._id}`,
          serviceForm,
          auth
        );
      } else {
        await axios.post(`${API_BASE}/services/create`, serviceForm, auth);
      }
      resetServiceForm();
      loadServices();
      loadStats();
      alert("Service request saved successfully!");
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Error saving service: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const editService = (s) => {
    setEditingService(s);
    setServiceForm({
      GuestId: s.GuestId?._id || s.GuestId || "",
      BookingId: s.BookingId?._id || s.BookingId || "",
      ServiceType: s.ServiceType || "Room Service",
      Details: s.Details || "",
      Status: s.Status || "requested"
    });
  };

  const deleteService = async (id) => {
    if (!window.confirm("Delete service request?")) return;
    try {
      await axios.delete(`${API_BASE}/services/Delete/${id}`, auth);
      loadServices();
      loadStats();
      alert("Service request deleted successfully!");
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Error deleting service");
    }
  };

  const resetServiceForm = () => {
    setEditingService(null);
    setServiceForm({
      GuestId: "",
      BookingId: "",
      ServiceType: "Room Service",
      Details: "",
      Status: "requested"
    });
  };

  // ========================= SYSTEM SETTINGS =========================
  const [systemSettings, setSystemSettings] = useState({
    Taxes: 0,
    Policies: "",
    Notifications: []
  });

  const loadSystemSettings = async () => {
    try {
      const res = await axios.get(`${API_BASE}/system`, auth);
      if (res.data) setSystemSettings(res.data);
    } catch (error) {
      console.error("Error loading system settings:", error);
    }
  };

  const saveSystemSettings = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_BASE}/system/update`, systemSettings, auth);
      alert("System settings saved successfully!");
    } catch (error) {
      console.error("Error saving system settings:", error);
      alert("Error saving system settings");
    } finally {
      setLoading(false);
    }
  };

  // ========================= INITIAL LOAD =========================
  useEffect(() => {
    const loadAllData = async () => {
      await Promise.all([
        loadStats(),
        loadUsers(),
        loadRooms(),
        loadBookings(),
        loadInvoices(),
        loadPayments(),
        loadTasks(),
        loadServices(),
        loadSystemSettings()
      ]);
    };
    loadAllData();
  }, []);

  // ========================= RENDER =========================
  return (
    <div className="container-fluid">
      <h3 className="mb-4">Admin Dashboard</h3>

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <div className="btn-group mb-4 flex-wrap">
        {[
          "dashboard", "users", "rooms", "bookings", 
          "invoices", "payments", "tasks", "services", "settings"
        ].map(t => (
          <button
            key={t}
            className={`btn btn-${tab === t ? "primary" : "outline-primary"} mb-1`}
            onClick={() => setTab(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* DASHBOARD */}
      {tab === "dashboard" && (
        <div className="row g-3">
          {[
            ["Total Users", stats.users, "users"],
            ["Total Rooms", stats.rooms, "bed"],
            ["Available Rooms", stats.availableRooms, "check-circle"],
            ["Total Bookings", stats.bookings, "calendar"],
            ["Active Bookings", stats.activeBookings, "activity"],
            ["Total Invoices", stats.invoices, "file-text"],
            ["Pending Invoices", stats.pendingInvoices, "alert-circle"],
            ["Total Revenue", `₹ ${stats.revenue.toLocaleString()}`, "dollar-sign"],
            ["Total Tasks", stats.tasks, "list"],
            ["Pending Tasks", stats.pendingTasks, "clock"],
            ["Service Requests", stats.serviceRequests, "phone-call"],
            ["Pending Services", stats.pendingServices, "bell"],
          ].map(([label, value, icon]) => (
            <div className="col-md-3 col-sm-6" key={label}>
              <div className="card p-3 text-center shadow-sm">
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted">{label}</h6>
                  <h4 className="card-title">{value}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* USERS MANAGEMENT */}
      {tab === "users" && (
        <div className="card p-3 shadow-sm">
          <h5>{editingUser ? "Edit User" : "Create User"}</h5>
          
          <div className="row">
            <div className="col-md-6">
              <input className="form-control mb-2" placeholder="Name"
                value={userForm.Name}
                onChange={e => setUserForm({ ...userForm, Name: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <input className="form-control mb-2" placeholder="Email"
                value={userForm.Email}
                onChange={e => setUserForm({ ...userForm, Email: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <input className="form-control mb-2" placeholder="Password" type="password"
                value={userForm.Password}
                onChange={e => setUserForm({ ...userForm, Password: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <select className="form-control mb-2"
                value={userForm.Role}
                onChange={e => setUserForm({ ...userForm, Role: e.target.value })}
              >
                {["admin", "manager", "receptionist", "housekeeping", "guest"].map(r =>
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                )}
              </select>
            </div>
            <div className="col-md-6">
              <input className="form-control mb-2" placeholder="Phone"
                value={userForm.Phone}
                onChange={e => setUserForm({ ...userForm, Phone: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <input className="form-control mb-2" placeholder="Address"
                value={userForm.Address}
                onChange={e => setUserForm({ ...userForm, Address: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-3">
            <button className="btn btn-success me-2" onClick={submitUser} disabled={loading}>
              {editingUser ? "Update User" : "Create User"}
            </button>
            {editingUser && (
              <button className="btn btn-secondary" onClick={resetUserForm}>
                Cancel
              </button>
            )}
          </div>

          <input
            className="form-control mb-3"
            placeholder="Search users..."
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
          />

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users
                  .filter(u =>
                    `${u.Name} ${u.Email} ${u.Phone}`
                      .toLowerCase()
                      .includes(userSearch.toLowerCase())
                  )
                  .map(u => (
                    <tr key={u._id}>
                      <td>{u.Name}</td>
                      <td>{u.Email}</td>
                      <td><span className="badge bg-info">{u.Role}</span></td>
                      <td>{u.Phone}</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => editUser(u)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ROOMS MANAGEMENT */}
      {tab === "rooms" && (
        <div className="card p-3 shadow-sm">
          <h5>{editingRoom ? "Edit Room" : "Add Room"}</h5>
          
          <div className="row">
            <div className="col-md-4">
              <input className="form-control mb-2" placeholder="Room Number"
                value={roomForm.RoomNumber}
                onChange={e => setRoomForm({ ...roomForm, RoomNumber: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <select className="form-control mb-2"
                value={roomForm.Type}
                onChange={e => setRoomForm({ ...roomForm, Type: e.target.value })}
              >
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
              </select>
            </div>
            <div className="col-md-4">
              <input className="form-control mb-2" placeholder="Price"
                type="number"
                value={roomForm.Price}
                onChange={e => setRoomForm({ ...roomForm, Price: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <input className="form-control mb-2" placeholder="Capacity"
                type="number"
                value={roomForm.Capacity}
                onChange={e => setRoomForm({ ...roomForm, Capacity: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <input className="form-control mb-2" placeholder="Floor"
                type="number"
                value={roomForm.Floor}
                onChange={e => setRoomForm({ ...roomForm, Floor: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <select className="form-control mb-2"
                value={roomForm.Status}
                onChange={e => setRoomForm({ ...roomForm, Status: e.target.value })}
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            
            <div className="col-12">
              <div className="input-group mb-2">
                <input className="form-control" placeholder="Add amenity..."
                  value={newAmenity}
                  onChange={e => setNewAmenity(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && addAmenity()}
                />
                <button className="btn btn-outline-secondary" onClick={addAmenity}>
                  Add
                </button>
              </div>
              
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
            </div>
          </div>

          <div className="mb-3">
            <button className="btn btn-success me-2" onClick={submitRoom} disabled={loading}>
              {editingRoom ? "Update Room" : "Add Room"}
            </button>
            {editingRoom && (
              <button className="btn btn-secondary" onClick={resetRoomForm}>
                Cancel
              </button>
            )}
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Room No.</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Capacity</th>
                  <th>Amenities</th>
                  <th>Floor</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.length === 0 ? (
                  <tr><td colSpan="8" className="text-center">No rooms found</td></tr>
                ) : (
                  rooms.map(r => (
                    <tr key={r._id}>
                      <td>{r.RoomNumber}</td>
                      <td>{r.Type}</td>
                      <td>₹ {r.Price?.toLocaleString()}</td>
                      <td>{r.Capacity}</td>
                      <td>{r.Amenities?.join(", ")}</td>
                      <td>{r.Floor}</td>
                      <td>
                        <span className={`badge bg-${r.Status === "available" ? "success" : r.Status === "occupied" ? "warning" : "danger"}`}>
                          {r.Status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => editRoom(r)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteRoom(r._id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BOOKINGS MANAGEMENT */}
      {tab === "bookings" && (
        <div className="card p-3 shadow-sm">
          <h5>{editingBooking ? "Edit Booking" : "Create Booking"}</h5>
          
          <div className="row">
            <div className="col-md-6">
              <input className="form-control mb-2" placeholder="Guest ID"
                value={bookingForm.GuestId}
                onChange={e => setBookingForm({ ...bookingForm, GuestId: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <input className="form-control mb-2" placeholder="Room ID"
                value={bookingForm.RoomId}
                onChange={e => setBookingForm({ ...bookingForm, RoomId: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <input className="form-control mb-2" type="date"
                value={bookingForm.CheckInDate}
                onChange={e => setBookingForm({ ...bookingForm, CheckInDate: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <input className="form-control mb-2" type="date"
                value={bookingForm.CheckOutDate}
                onChange={e => setBookingForm({ ...bookingForm, CheckOutDate: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <select className="form-control mb-2"
                value={bookingForm.Status}
                onChange={e => setBookingForm({ ...bookingForm, Status: e.target.value })}
              >
                <option value="reserved">Reserved</option>
                <option value="checked-in">Checked In</option>
                <option value="checked-out">Checked Out</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <button className="btn btn-success me-2" onClick={submitBooking} disabled={loading}>
              {editingBooking ? "Update Booking" : "Create Booking"}
            </button>
            {editingBooking && (
              <button className="btn btn-secondary" onClick={resetBookingForm}>
                Cancel
              </button>
            )}
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan="6" className="text-center">No bookings found</td></tr>
                ) : (
                  bookings.map(b => (
                    <tr key={b._id}>
                      <td>{b.GuestId?.Name || b.GuestId}</td>
                      <td>{b.RoomId?.RoomNumber || b.RoomId}</td>
                      <td>{new Date(b.CheckInDate).toLocaleDateString()}</td>
                      <td>{new Date(b.CheckOutDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge bg-${b.Status === "reserved" ? "info" : b.Status === "checked-in" ? "success" : "secondary"}`}>
                          {b.Status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => editBooking(b)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteBooking(b._id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INVOICES MANAGEMENT */}
      {tab === "invoices" && (
        <div className="card p-3 shadow-sm">
          <h5>{editingInvoice ? "Edit Invoice" : "Create Invoice"}</h5>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <input className="form-control mb-2" placeholder="Booking ID"
                value={invoiceForm.BookingId}
                onChange={e => setInvoiceForm({ ...invoiceForm, BookingId: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <input className="form-control mb-2" placeholder="Guest ID"
                value={invoiceForm.GuestId}
                onChange={e => setInvoiceForm({ ...invoiceForm, GuestId: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <input className="form-control mb-2" placeholder="Tax"
                type="number"
                value={invoiceForm.Tax}
                onChange={e => setInvoiceForm({ ...invoiceForm, Tax: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <input className="form-control mb-2" placeholder="Discount"
                type="number"
                value={invoiceForm.Discount}
                onChange={e => setInvoiceForm({ ...invoiceForm, Discount: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <input className="form-control mb-2" placeholder="Total Amount"
                type="number"
                value={invoiceForm.TotalAmount}
                onChange={e => setInvoiceForm({ ...invoiceForm, TotalAmount: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <select className="form-control mb-2"
                value={invoiceForm.PaymentStatus}
                onChange={e => setInvoiceForm({ ...invoiceForm, PaymentStatus: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <h6>Invoice Items</h6>
          {invoiceForm.Items.map((item, index) => (
            <div className="row mb-2" key={index}>
              <div className="col-md-6">
                <input className="form-control" placeholder="Description"
                  value={item.Description}
                  onChange={e => updateInvoiceItem(index, "Description", e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <input className="form-control" placeholder="Amount" type="number"
                  value={item.Amount}
                  onChange={e => updateInvoiceItem(index, "Amount", e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <button className="btn btn-sm btn-danger w-100" 
                  onClick={() => removeInvoiceItem(index)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button className="btn btn-sm btn-primary mb-3" onClick={addInvoiceItem}>
            Add Item
          </button>

          <div className="mb-3">
            <button className="btn btn-success me-2" onClick={submitInvoice} disabled={loading}>
              {editingInvoice ? "Update Invoice" : "Create Invoice"}
            </button>
            {editingInvoice && (
              <button className="btn btn-secondary" onClick={resetInvoiceForm}>
                Cancel
              </button>
            )}
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Booking ID</th>
                  <th>Guest</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr><td colSpan="6" className="text-center">No invoices found</td></tr>
                ) : (
                  invoices.map(inv => (
                    <tr key={inv._id}>
                      <td>{inv.BookingId?.slice(0, 8)}...</td>
                      <td>{inv.GuestId?.Name || inv.GuestId?.slice(0, 8)}...</td>
                      <td>{inv.Items?.length} items</td>
                      <td>₹ {inv.TotalAmount?.toLocaleString()}</td>
                      <td>
                        <span className={`badge bg-${inv.PaymentStatus === "paid" ? "success" : "warning"}`}>
                          {inv.PaymentStatus}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => editInvoice(inv)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteInvoice(inv._id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PAYMENTS MANAGEMENT */}
      {tab === "payments" && (
        <div className="card p-3 shadow-sm">
          <h5>{editingPayment ? "Edit Payment" : "Create Payment"}</h5>
          
          <div className="row">
            <div className="col-md-6">
              <input className="form-control mb-2" placeholder="Invoice ID"
                value={paymentForm.InvoiceId}
                onChange={e => setPaymentForm({ ...paymentForm, InvoiceId: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <input className="form-control mb-2" placeholder="Amount"
                type="number"
                value={paymentForm.Amount}
                onChange={e => setPaymentForm({ ...paymentForm, Amount: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <select className="form-control mb-2"
                value={paymentForm.Method}
                onChange={e => setPaymentForm({ ...paymentForm, Method: e.target.value })}
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bank-transfer">Bank Transfer</option>
                <option value="upi">UPI</option>
              </select>
            </div>
            <div className="col-md-6">
              <input className="form-control mb-2" type="date"
                value={paymentForm.PaymentDate}
                onChange={e => setPaymentForm({ ...paymentForm, PaymentDate: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-3">
            <button className="btn btn-success me-2" onClick={submitPayment} disabled={loading}>
              {editingPayment ? "Update Payment" : "Create Payment"}
            </button>
            {editingPayment && (
              <button className="btn btn-secondary" onClick={resetPaymentForm}>
                Cancel
              </button>
            )}
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Invoice</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr><td colSpan="5" className="text-center">No payments found</td></tr>
                ) : (
                  payments.map(p => (
                    <tr key={p._id}>
                      <td>{p.InvoiceId?.slice(0, 8)}...</td>
                      <td>₹ {p.Amount?.toLocaleString()}</td>
                      <td><span className="badge bg-info">{p.Method}</span></td>
                      <td>{new Date(p.PaymentDate).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => editPayment(p)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deletePayment(p._id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TASKS MANAGEMENT */}
      {tab === "tasks" && (
        <div className="card p-3 shadow-sm">
          <h5>{editingTask ? "Edit Task" : "Create Task"}</h5>
          
          <div className="row">
            <div className="col-md-6">
              <input className="form-control mb-2" placeholder="Room ID"
                value={taskForm.RoomId}
                onChange={e => setTaskForm({ ...taskForm, RoomId: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <input className="form-control mb-2" placeholder="Reported By User ID"
                value={taskForm.ReportedBy}
                onChange={e => setTaskForm({ ...taskForm, ReportedBy: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <input className="form-control mb-2" placeholder="Assigned To User ID"
                value={taskForm.AssignedTo}
                onChange={e => setTaskForm({ ...taskForm, AssignedTo: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <select className="form-control mb-2"
                value={taskForm.Type}
                onChange={e => setTaskForm({ ...taskForm, Type: e.target.value })}
              >
                <option value="housekeeping">Housekeeping</option>
                <option value="maintenance">Maintenance</option>
                <option value="repair">Repair</option>
                <option value="inspection">Inspection</option>
              </select>
            </div>
            <div className="col-12">
              <textarea className="form-control mb-2" placeholder="Description"
                rows="3"
                value={taskForm.Description}
                onChange={e => setTaskForm({ ...taskForm, Description: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <select className="form-control mb-2"
                value={taskForm.Status}
                onChange={e => setTaskForm({ ...taskForm, Status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <button className="btn btn-success me-2" onClick={submitTask} disabled={loading}>
              {editingTask ? "Update Task" : "Create Task"}
            </button>
            {editingTask && (
              <button className="btn btn-secondary" onClick={resetTaskForm}>
                Cancel
              </button>
            )}
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Room</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 ? (
                  <tr><td colSpan="5" className="text-center">No tasks found</td></tr>
                ) : (
                  tasks.map(t => (
                    <tr key={t._id}>
                      <td>{t.RoomId?.RoomNumber || t.RoomId}</td>
                      <td><span className="badge bg-info">{t.Type}</span></td>
                      <td>{t.Description}</td>
                      <td>
                        <span className={`badge bg-${t.Status === "completed" ? "success" : t.Status === "in-progress" ? "warning" : "secondary"}`}>
                          {t.Status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => editTask(t)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteTask(t._id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SERVICE REQUESTS MANAGEMENT */}
      {tab === "services" && (
        <div className="card p-3 shadow-sm">
          <h5>{editingService ? "Edit Service Request" : "Create Service Request"}</h5>
          
          <div className="row">
            <div className="col-md-6">
              <input className="form-control mb-2" placeholder="Guest ID"
                value={serviceForm.GuestId}
                onChange={e => setServiceForm({ ...serviceForm, GuestId: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <input className="form-control mb-2" placeholder="Booking ID"
                value={serviceForm.BookingId}
                onChange={e => setServiceForm({ ...serviceForm, BookingId: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <select className="form-control mb-2"
                value={serviceForm.ServiceType}
                onChange={e => setServiceForm({ ...serviceForm, ServiceType: e.target.value })}
              >
                <option value="Room Service">Room Service</option>
                <option value="Laundry">Laundry</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Transport">Transport</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="col-12">
              <textarea className="form-control mb-2" placeholder="Details"
                rows="3"
                value={serviceForm.Details}
                onChange={e => setServiceForm({ ...serviceForm, Details: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <select className="form-control mb-2"
                value={serviceForm.Status}
                onChange={e => setServiceForm({ ...serviceForm, Status: e.target.value })}
              >
                <option value="requested">Requested</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <button className="btn btn-success me-2" onClick={submitService} disabled={loading}>
              {editingService ? "Update Service" : "Create Service"}
            </button>
            {editingService && (
              <button className="btn btn-secondary" onClick={resetServiceForm}>
                Cancel
              </button>
            )}
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Guest</th>
                  <th>Service Type</th>
                  <th>Details</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.length === 0 ? (
                  <tr><td colSpan="5" className="text-center">No service requests found</td></tr>
                ) : (
                  services.map(s => (
                    <tr key={s._id}>
                      <td>{s.GuestId?.Name || s.GuestId}</td>
                      <td><span className="badge bg-info">{s.ServiceType}</span></td>
                      <td>{s.Details}</td>
                      <td>
                        <span className={`badge bg-${s.Status === "completed" ? "success" : s.Status === "in-progress" ? "warning" : "secondary"}`}>
                          {s.Status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => editService(s)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteService(s._id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SYSTEM SETTINGS */}
      {tab === "settings" && (
        <div className="card p-3 shadow-sm">
          <h5>System Settings</h5>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Tax Percentage (%)</label>
              <input className="form-control" type="number"
                value={systemSettings.Taxes}
                onChange={e => setSystemSettings({ ...systemSettings, Taxes: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Hotel Policies</label>
            <textarea className="form-control" rows="5"
              value={systemSettings.Policies}
              onChange={e => setSystemSettings({ ...systemSettings, Policies: e.target.value })}
              placeholder="Enter hotel policies here..."
            />
          </div>

          <button className="btn btn-primary" onClick={saveSystemSettings} disabled={loading}>
            Save Settings
          </button>
        </div>
      )}
    </div>
  );
};

// Add this CSS in your main CSS file or as a style tag
const styles = `
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.table-responsive {
  max-height: 500px;
  overflow-y: auto;
}

.badge {
  font-size: 0.8em;
}

.card {
  margin-bottom: 20px;
}
`;

export default Admin;