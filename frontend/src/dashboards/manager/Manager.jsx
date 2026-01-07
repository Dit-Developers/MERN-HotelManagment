// dashboards/manager/Manager.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Dropdown,
  Form,
  Modal,
  Alert,
  ProgressBar,
  ListGroup,
  Nav,
  Tab,
} from "react-bootstrap";
import {
  FaChartLine,
  FaUsers,
  FaBed,
  FaCalendarCheck,
  FaDollarSign,
  FaConciergeBell,
  FaExclamationTriangle,
  FaEllipsisV,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaFilter,
  FaPrint,
  FaFileExport,
  FaBell,
  FaUserCheck,
  FaDoorOpen,
  FaDoorClosed,
  FaClipboardList,
  FaStar,
  FaHistory,
} from "react-icons/fa";
import "./ManagerDashboard.css";

// Mock data for demonstration
const mockData = {
  stats: {
    occupancyRate: 78,
    totalRevenue: 452800,
    pendingCheckIns: 12,
    pendingCheckOuts: 8,
    availableRooms: 45,
    totalGuests: 156,
    serviceRequests: 23,
    maintenanceIssues: 5,
  },
  recentBookings: [
    {
      id: "B001",
      guest: "John Smith",
      room: "Deluxe Suite (502)",
      checkIn: "2024-03-15",
      checkOut: "2024-03-20",
      status: "checked-in",
      amount: 4500,
      payment: "paid",
    },
    {
      id: "B002",
      guest: "Emma Wilson",
      room: "Executive Suite (401)",
      checkIn: "2024-03-16",
      checkOut: "2024-03-19",
      status: "confirmed",
      amount: 3200,
      payment: "deposit",
    },
    {
      id: "B003",
      guest: "Robert Chen",
      room: "Presidential Suite (1201)",
      checkIn: "2024-03-17",
      checkOut: "2024-03-22",
      status: "pending",
      amount: 8900,
      payment: "pending",
    },
    {
      id: "B004",
      guest: "Sarah Johnson",
      room: "Standard Room (305)",
      checkIn: "2024-03-14",
      checkOut: "2024-03-18",
      status: "checked-out",
      amount: 1800,
      payment: "paid",
    },
  ],
  staff: [
    { id: 1, name: "Michael Brown", role: "Receptionist", status: "active", shift: "Morning" },
    { id: 2, name: "Jessica Lee", role: "Housekeeping", status: "active", shift: "Afternoon" },
    { id: 3, name: "David Wilson", role: "Concierge", status: "on-break", shift: "Evening" },
    { id: 4, name: "Lisa Taylor", role: "Maintenance", status: "off-duty", shift: "Night" },
  ],
  serviceRequests: [
    { id: "SR001", room: "502", type: "Room Service", status: "completed", time: "10:30 AM" },
    { id: "SR002", room: "401", type: "Extra Towels", status: "in-progress", time: "11:15 AM" },
    { id: "SR003", room: "305", type: "AC Repair", status: "pending", time: "09:00 AM" },
    { id: "SR004", room: "1201", type: "Spa Booking", status: "completed", time: "02:45 PM" },
  ],
  rooms: [
    { number: "101", type: "Standard", status: "available", price: 200, lastCleaned: "Today" },
    { number: "102", type: "Standard", status: "occupied", price: 200, lastCleaned: "Yesterday" },
    { number: "201", type: "Deluxe", status: "maintenance", price: 350, lastCleaned: "2 days ago" },
    { number: "301", type: "Suite", status: "cleaning", price: 500, lastCleaned: "Today" },
    { number: "401", type: "Executive", status: "available", price: 600, lastCleaned: "Today" },
    { number: "501", type: "Presidential", status: "occupied", price: 1200, lastCleaned: "Yesterday" },
  ],
  alerts: [
    { id: 1, type: "warning", message: "Room 201 requires maintenance", time: "1 hour ago" },
    { id: 2, type: "info", message: "Check-out reminder for Room 305", time: "2 hours ago" },
    { id: 3, type: "success", message: "VIP guest arriving at 4 PM", time: "3 hours ago" },
  ],
};

const ManagerDashboard = () => {
  const [data, setData] = useState(mockData);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [timeRange, setTimeRange] = useState("today");

  // Simulate API call
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleCheckIn = (bookingId) => {
    setData({
      ...data,
      recentBookings: data.recentBookings.map((b) =>
        b.id === bookingId ? { ...b, status: "checked-in" } : b
      ),
    });
  };

  const handleCheckOut = (bookingId) => {
    setData({
      ...data,
      recentBookings: data.recentBookings.map((b) =>
        b.id === bookingId ? { ...b, status: "checked-out" } : b
      ),
    });
  };

  const handleAssignStaff = (requestId, staffId) => {
    // Handle staff assignment logic
    console.log(`Assign staff ${staffId} to request ${requestId}`);
  };

  const handleUpdateRoomStatus = (roomNumber, newStatus) => {
    setData({
      ...data,
      rooms: data.rooms.map((room) =>
        room.number === roomNumber ? { ...room, status: newStatus } : room
      ),
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      "checked-in": "success",
      "confirmed": "primary",
      "pending": "warning",
      "checked-out": "secondary",
      "available": "success",
      "occupied": "danger",
      "maintenance": "warning",
      "cleaning": "info",
      "completed": "success",
      "in-progress": "warning",
      "pending": "danger",
      "active": "success",
      "on-break": "warning",
      "off-duty": "secondary",
    };
    return variants[status] || "secondary";
  };

  const getPaymentBadge = (payment) => {
    const variants = {
      "paid": "success",
      "deposit": "warning",
      "pending": "danger",
    };
    return variants[payment] || "secondary";
  };

  // Dashboard Overview Component
  const OverviewTab = () => (
    <>
      {/* Stats Cards */}
      <Row className="mb-4">
        <Col xl={3} lg={6} className="mb-4">
          <Card className="stat-card revenue-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">Total Revenue</h6>
                  <h3 className="mb-0">${data.stats.totalRevenue.toLocaleString()}</h3>
                  <p className="text-success mb-0">
                    <FaChartLine className="me-1" />
                    +12.5% this month
                  </p>
                </div>
                <div className="stat-icon">
                  <FaDollarSign size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6} className="mb-4">
          <Card className="stat-card occupancy-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">Occupancy Rate</h6>
                  <h3 className="mb-0">{data.stats.occupancyRate}%</h3>
                  <div className="mt-2">
                    <ProgressBar now={data.stats.occupancyRate} variant="success" />
                  </div>
                </div>
                <div className="stat-icon">
                  <FaBed size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6} className="mb-4">
          <Card className="stat-card guests-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">Current Guests</h6>
                  <h3 className="mb-0">{data.stats.totalGuests}</h3>
                  <p className="text-muted mb-0">
                    <FaCalendarCheck className="me-1" />
                    {data.stats.pendingCheckIns} check-ins today
                  </p>
                </div>
                <div className="stat-icon">
                  <FaUsers size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6} className="mb-4">
          <Card className="stat-card requests-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">Active Requests</h6>
                  <h3 className="mb-0">{data.stats.serviceRequests}</h3>
                  <p className="text-warning mb-0">
                    <FaExclamationTriangle className="me-1" />
                    {data.stats.maintenanceIssues} urgent
                  </p>
                </div>
                <div className="stat-icon">
                  <FaConciergeBell size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Alerts Section */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaBell className="me-2 text-warning" />
                Recent Alerts & Notifications
              </h5>
              <Badge bg="warning" pill>
                {data.alerts.length} New
              </Badge>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {data.alerts.map((alert) => (
                  <ListGroup.Item key={alert.id} className="alert-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <div className={`alert-icon me-3 bg-${alert.type}`}>
                          {alert.type === "warning" ? "⚠" : alert.type === "success" ? "✓" : "ℹ"}
                        </div>
                        <div>
                          <p className="mb-1">{alert.message}</p>
                          <small className="text-muted">{alert.time}</small>
                        </div>
                      </div>
                      <Button size="sm" variant="outline-primary">
                        View
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">
                <FaDoorOpen className="me-2 text-primary" />
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="primary" onClick={() => setShowBookingModal(true)}>
                  <FaPlus className="me-2" />
                  Create Booking
                </Button>
                <Button variant="outline-primary">
                  <FaClipboardList className="me-2" />
                  Generate Report
                </Button>
                <Button variant="outline-success">
                  <FaUserCheck className="me-2" />
                  Assign Staff
                </Button>
                <Button variant="outline-warning">
                  <FaFileExport className="me-2" />
                  Export Data
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Bookings */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaCalendarCheck className="me-2 text-primary" />
                Recent Bookings
              </h5>
              <div>
                <Button size="sm" variant="outline-primary" className="me-2">
                  <FaFilter className="me-1" />
                  Filter
                </Button>
                <Button size="sm" variant="outline-secondary">
                  <FaEye className="me-1" />
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Guest</th>
                      <th>Room</th>
                      <th>Check-in/out</th>
                      <th>Status</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          <strong>{booking.id}</strong>
                        </td>
                        <td>{booking.guest}</td>
                        <td>{booking.room}</td>
                        <td>
                          <div>
                            <small>{booking.checkIn}</small>
                            <br />
                            <small>{booking.checkOut}</small>
                          </div>
                        </td>
                        <td>
                          <Badge bg={getStatusBadge(booking.status)}>
                            {booking.status}
                          </Badge>
                        </td>
                        <td>
                          <strong>${booking.amount}</strong>
                        </td>
                        <td>
                          <Badge bg={getPaymentBadge(booking.payment)}>
                            {booking.payment}
                          </Badge>
                        </td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle variant="link" size="sm">
                              <FaEllipsisV />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              {booking.status === "confirmed" && (
                                <Dropdown.Item onClick={() => handleCheckIn(booking.id)}>
                                  <FaUserCheck className="me-2" />
                                  Check-in
                                </Dropdown.Item>
                              )}
                              {booking.status === "checked-in" && (
                                <Dropdown.Item onClick={() => handleCheckOut(booking.id)}>
                                  <FaDoorClosed className="me-2" />
                                  Check-out
                                </Dropdown.Item>
                              )}
                              <Dropdown.Item>
                                <FaEye className="me-2" />
                                View Details
                              </Dropdown.Item>
                              <Dropdown.Item>
                                <FaEdit className="me-2" />
                                Edit
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item className="text-danger">
                                <FaTrash className="me-2" />
                                Cancel
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Rooms Status */}
      <Row>
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">
                <FaBed className="me-2 text-info" />
                Rooms Status
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="rooms-grid">
                {data.rooms.map((room) => (
                  <div
                    key={room.number}
                    className={`room-card room-status-${room.status}`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <div className="room-number">{room.number}</div>
                    <div className="room-type">{room.type}</div>
                    <Badge bg={getStatusBadge(room.status)} className="room-status">
                      {room.status}
                    </Badge>
                    <div className="room-price">${room.price}/night</div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">
                <FaConciergeBell className="me-2 text-warning" />
                Service Requests
              </h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {data.serviceRequests.map((request) => (
                  <ListGroup.Item key={request.id} className="service-request-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">
                          {request.type} - Room {request.room}
                        </h6>
                        <small className="text-muted">{request.time}</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <Badge bg={getStatusBadge(request.status)} className="me-3">
                          {request.status}
                        </Badge>
                        <Dropdown>
                          <Dropdown.Toggle variant="link" size="sm">
                            <FaEllipsisV />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item>
                              <FaUserCheck className="me-2" />
                              Assign Staff
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <FaEye className="me-2" />
                              View Details
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <FaEdit className="me-2" />
                              Update Status
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );

  // Bookings Management Tab
  const BookingsTab = () => (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaCalendarCheck className="me-2" />
          Booking Management
        </h5>
        <Button variant="primary" onClick={() => setShowBookingModal(true)}>
          <FaPlus className="me-2" />
          New Booking
        </Button>
      </Card.Header>
      <Card.Body>
        <div className="table-responsive">
          <Table hover>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Guest Name</th>
                <th>Room</th>
                <th>Dates</th>
                <th>Status</th>
                <th>Total Amount</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <strong>{booking.id}</strong>
                  </td>
                  <td>{booking.guest}</td>
                  <td>{booking.room}</td>
                  <td>
                    {booking.checkIn} to {booking.checkOut}
                  </td>
                  <td>
                    <Badge bg={getStatusBadge(booking.status)}>
                      {booking.status}
                    </Badge>
                  </td>
                  <td>${booking.amount}</td>
                  <td>{booking.checkIn}</td>
                  <td>
                    <ButtonGroup size="sm">
                      <Button variant="outline-primary">
                        <FaEye />
                      </Button>
                      <Button variant="outline-warning">
                        <FaEdit />
                      </Button>
                      <Button variant="outline-danger">
                        <FaTrash />
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );

  // Staff Management Tab
  const StaffTab = () => (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaUsers className="me-2" />
          Staff Management
        </h5>
        <Button variant="primary" onClick={() => setShowStaffModal(true)}>
          <FaPlus className="me-2" />
          Add Staff
        </Button>
      </Card.Header>
      <Card.Body>
        <Row>
          {data.staff.map((staff) => (
            <Col md={6} lg={4} key={staff.id} className="mb-3">
              <Card className="staff-card">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <div className="staff-avatar me-3">
                      <FaUsers size={40} />
                    </div>
                    <div>
                      <h6 className="mb-1">{staff.name}</h6>
                      <small className="text-muted">{staff.role}</small>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <Badge bg={getStatusBadge(staff.status)}>
                      {staff.status}
                    </Badge>
                    <span className="text-muted">{staff.shift} Shift</span>
                  </div>
                  <div className="mt-3">
                    <ButtonGroup size="sm" className="w-100">
                      <Button variant="outline-primary">
                        <FaEye />
                      </Button>
                      <Button variant="outline-warning">
                        <FaEdit />
                      </Button>
                      <Button variant="outline-info">
                        Assign Task
                      </Button>
                    </ButtonGroup>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );

  // Rooms Management Tab
  const RoomsTab = () => (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaBed className="me-2" />
          Rooms Management
        </h5>
        <div>
          <Button size="sm" variant="outline-primary" className="me-2">
            <FaFilter className="me-1" />
            Filter
          </Button>
          <Button size="sm" variant="outline-success">
            <FaPlus className="me-1" />
            Add Room
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="table-responsive">
          <Table hover>
            <thead>
              <tr>
                <th>Room No.</th>
                <th>Type</th>
                <th>Status</th>
                <th>Rate/Night</th>
                <th>Last Cleaned</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.rooms.map((room) => (
                <tr key={room.number}>
                  <td>
                    <strong>{room.number}</strong>
                  </td>
                  <td>{room.type}</td>
                  <td>
                    <Badge bg={getStatusBadge(room.status)}>
                      {room.status}
                    </Badge>
                  </td>
                  <td>${room.price}</td>
                  <td>{room.lastCleaned}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="link" size="sm">
                        <FaEllipsisV />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setSelectedRoom(room)}>
                          <FaEye className="me-2" />
                          View Details
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <FaEdit className="me-2" />
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item
                          onClick={() => handleUpdateRoomStatus(room.number, "maintenance")}
                        >
                          <FaExclamationTriangle className="me-2" />
                          Mark for Maintenance
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleUpdateRoomStatus(room.number, "cleaning")}
                        >
                          <FaClipboardList className="me-2" />
                          Request Cleaning
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );

  // Reports Tab
  const ReportsTab = () => (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaChartLine className="me-2" />
          Reports & Analytics
        </h5>
        <div>
          <Button
            variant="outline-primary"
            className="me-2"
            onClick={() => setShowReportModal(true)}
          >
            <FaPrint className="me-2" />
            Generate Report
          </Button>
          <Button variant="outline-success">
            <FaFileExport className="me-2" />
            Export Data
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col lg={4}>
            <Card className="mb-4">
              <Card.Body>
                <h6>Time Range</h6>
                <Form.Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </Form.Select>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Body>
                <h6>Summary</h6>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Total Revenue</span>
                    <strong>${data.stats.totalRevenue.toLocaleString()}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Occupancy Rate</span>
                    <strong>{data.stats.occupancyRate}%</strong>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Average Room Rate</span>
                    <strong>$450</strong>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Guest Satisfaction</span>
                    <strong>
                      4.8 <FaStar className="text-warning" />
                    </strong>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            <Card className="mb-4">
              <Card.Body>
                <h6>Revenue Trends</h6>
                <div className="revenue-chart-placeholder">
                  <div className="text-center py-5">
                    <FaChartLine size={60} className="text-muted mb-3" />
                    <p className="text-muted">Revenue chart would appear here</p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <h6>Room Type Performance</h6>
                <Table hover>
                  <thead>
                    <tr>
                      <th>Room Type</th>
                      <th>Occupancy</th>
                      <th>Revenue</th>
                      <th>Avg. Rate</th>
                      <th>Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Standard</td>
                      <td>85%</td>
                      <td>$45,200</td>
                      <td>$200</td>
                      <td>
                        <Badge bg="success">Excellent</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td>Deluxe</td>
                      <td>78%</td>
                      <td>$78,500</td>
                      <td>$350</td>
                      <td>
                        <Badge bg="success">Good</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td>Suite</td>
                      <td>65%</td>
                      <td>$89,300</td>
                      <td>$500</td>
                      <td>
                        <Badge bg="warning">Average</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td>Executive</td>
                      <td>92%</td>
                      <td>$120,800</td>
                      <td>$600</td>
                      <td>
                        <Badge bg="success">Excellent</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td>Presidential</td>
                      <td>45%</td>
                      <td>$119,000</td>
                      <td>$1200</td>
                      <td>
                        <Badge bg="danger">Low</Badge>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  // Room Details Modal
  const RoomDetailsModal = () => (
    <Modal show={selectedRoom} onHide={() => setSelectedRoom(null)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <FaBed className="me-2" />
          Room {selectedRoom?.number} Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedRoom && (
          <Row>
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Room Number:</span>
                  <strong>{selectedRoom.number}</strong>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Room Type:</span>
                  <strong>{selectedRoom.type}</strong>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Current Status:</span>
                  <Badge bg={getStatusBadge(selectedRoom.status)}>
                    {selectedRoom.status}
                  </Badge>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Rate per Night:</span>
                  <strong>${selectedRoom.price}</strong>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Last Cleaned:</span>
                  <span>{selectedRoom.lastCleaned}</span>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={6}>
              <div className="room-actions">
                <h6>Quick Actions</h6>
                <div className="d-grid gap-2">
                  <Button
                    variant={
                      selectedRoom.status === "available" ? "success" : "outline-success"
                    }
                    onClick={() => handleUpdateRoomStatus(selectedRoom.number, "available")}
                  >
                    <FaBed className="me-2" />
                    Mark as Available
                  </Button>
                  <Button
                    variant={
                      selectedRoom.status === "maintenance" ? "warning" : "outline-warning"
                    }
                    onClick={() => handleUpdateRoomStatus(selectedRoom.number, "maintenance")}
                  >
                    <FaExclamationTriangle className="me-2" />
                    Mark for Maintenance
                  </Button>
                  <Button
                    variant={
                      selectedRoom.status === "cleaning" ? "info" : "outline-info"
                    }
                    onClick={() => handleUpdateRoomStatus(selectedRoom.number, "cleaning")}
                  >
                    <FaClipboardList className="me-2" />
                    Request Cleaning
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setSelectedRoom(null)}>
          Close
        </Button>
        <Button variant="primary">
          <FaEdit className="me-2" />
          Edit Room
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <Container fluid className="manager-dashboard">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="dashboard-header">
            <h2 className="dashboard-title">
              <FaChartLine className="me-3" />
              Manager Dashboard
            </h2>
            <p className="dashboard-subtitle">
              Welcome back! Here's your hotel's performance overview.
            </p>
          </div>
        </Col>
      </Row>

      {/* Main Content */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body className="p-0">
              <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Nav variant="pills" className="dashboard-nav">
                  <Nav.Item>
                    <Nav.Link eventKey="overview">
                      <FaChartLine className="me-2" />
                      Overview
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="bookings">
                      <FaCalendarCheck className="me-2" />
                      Bookings
                      <Badge bg="primary" className="ms-2">
                        {data.recentBookings.length}
                      </Badge>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="rooms">
                      <FaBed className="me-2" />
                      Rooms
                      <Badge bg="info" className="ms-2">
                        {data.rooms.length}
                      </Badge>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="staff">
                      <FaUsers className="me-2" />
                      Staff
                      <Badge bg="success" className="ms-2">
                        {data.staff.length}
                      </Badge>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="reports">
                      <FaChartLine className="me-2" />
                      Reports
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content className="p-4">
                  <Tab.Pane eventKey="overview">
                    <OverviewTab />
                  </Tab.Pane>
                  <Tab.Pane eventKey="bookings">
                    <BookingsTab />
                  </Tab.Pane>
                  <Tab.Pane eventKey="rooms">
                    <RoomsTab />
                  </Tab.Pane>
                  <Tab.Pane eventKey="staff">
                    <StaffTab />
                  </Tab.Pane>
                  <Tab.Pane eventKey="reports">
                    <ReportsTab />
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Room Details Modal */}
      {selectedRoom && <RoomDetailsModal />}
    </Container>
  );
};

export default ManagerDashboard;