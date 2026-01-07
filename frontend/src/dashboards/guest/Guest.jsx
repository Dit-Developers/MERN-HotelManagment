// dashboards/guest/GuestDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Tab,
  Nav,
  Modal,
  Form,
  Alert,
  ListGroup,
  ProgressBar,
  Dropdown,
  ButtonGroup,
  Table,
  Spinner,
} from "react-bootstrap";
import {
  FaHome,
  FaCalendarAlt,
  FaConciergeBell,
  FaFileInvoiceDollar,
  FaUser,
  FaBed,
  FaCalendarCheck,
  FaStar,
  FaClock,
  FaKey,
  FaMobileAlt,
  FaBolt,
  FaHistory,
  FaDoorClosed,
  FaMapMarkerAlt,
  FaPlus,
  FaEye,
  FaTimes,
  FaDownload,
  FaPrint,
  FaSave,
  FaSignOutAlt,
  FaCog,
  FaInfoCircle,
  FaQrcode,
  FaShareAlt,
  FaUserCircle,
  FaCrown,
  FaBell,
  FaUserEdit,
  FaCommentDots,
  FaSpa,
  FaPlusCircle,
  FaUtensils,
  FaWineGlassAlt,
  FaTshirt,
  FaCar,
  FaWifi,
  FaCoffee,
} from "react-icons/fa";
import "./Guest.css";

// Mock data for demonstration
const mockGuestData = {
  id: "GUEST_001",
  name: "John Smith",
  email: "john.smith@email.com",
  phone: "+1 (555) 123-4567",
  membership: "Platinum",
  points: 12500,
  tier: "platinum",
  currentStay: {
    hotel: "LuxuryStay New York",
    roomNumber: "502",
    roomType: "Deluxe Suite",
    checkIn: "2024-03-15",
    checkOut: "2024-03-20",
    status: "checked-in",
  },
};

const mockBookings = [
  {
    id: "B001",
    hotel: "LuxuryStay New York",
    roomType: "Presidential Suite",
    checkIn: "2024-03-15",
    checkOut: "2024-03-20",
    guests: 2,
    status: "active",
    roomNumber: "502",
    totalAmount: 4500,
    bookingDate: "2024-02-10",
  },
  {
    id: "B002",
    hotel: "LuxuryStay Dubai",
    roomType: "Royal Suite",
    checkIn: "2024-02-01",
    checkOut: "2024-02-07",
    guests: 3,
    status: "completed",
    roomNumber: "1201",
    totalAmount: 8900,
    bookingDate: "2024-01-15",
  },
  {
    id: "B003",
    hotel: "LuxuryStay Paris",
    roomType: "Executive Suite",
    checkIn: "2024-04-10",
    checkOut: "2024-04-15",
    guests: 2,
    status: "upcoming",
    roomNumber: "801",
    totalAmount: 3200,
    bookingDate: "2024-03-01",
  },
];

const mockServices = [
  { id: "room-service", name: "Room Service", icon: <FaUtensils />, color: "success" },
  { id: "housekeeping", name: "Housekeeping", icon: <FaTshirt />, color: "info" },
  { id: "maintenance", name: "Maintenance", icon: <FaWifi />, color: "warning" },
  { id: "spa", name: "Spa Booking", icon: <FaSpa />, color: "danger" },
  { id: "transport", name: "Transportation", icon: <FaCar />, color: "primary" },
  { id: "wakeup", name: "Wake-up Call", icon: <FaBell />, color: "secondary" },
  { id: "laundry", name: "Laundry", icon: <FaTshirt />, color: "dark" },
  { id: "concierge", name: "Concierge", icon: <FaConciergeBell />, color: "success" },
];

const Guest = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [guestData, setGuestData] = useState(mockGuestData);
  const [bookings, setBookings] = useState(mockBookings);
  const [loading, setLoading] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showDigitalKey, setShowDigitalKey] = useState(false);

  // Service request form state
  const [serviceForm, setServiceForm] = useState({
    type: "",
    priority: "normal",
    description: "",
    scheduledTime: "",
  });

  // Calculate stats
  const stats = {
    totalStays: bookings.length,
    upcomingStays: bookings.filter((b) => b.status === "upcoming").length,
    loyaltyPoints: guestData.points,
    pendingRequests: 2, // Mock value
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: "short", year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const variants = {
      active: "success",
      completed: "secondary",
      upcoming: "primary",
      pending: "warning",
      "in-progress": "info",
      cancelled: "danger",
    };
    return variants[status] || "secondary";
  };

  // Handle service request submission
  const handleServiceSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      alert("Service request submitted successfully!");
      setShowServiceModal(false);
      setServiceForm({ type: "", priority: "normal", description: "", scheduledTime: "" });
      setLoading(false);
    }, 1000);
  };

  // Handle feedback submission
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      alert("Thank you for your feedback!");
      setShowFeedbackModal(false);
      setLoading(false);
    }, 1000);
  };

  // Handle check-in/check-out
  const handleBookingAction = (bookingId, action) => {
    setBookings(
      bookings.map((b) =>
        b.id === bookingId ? { ...b, status: action === "checkin" ? "active" : "completed" } : b
      )
    );
  };

  // Dashboard Content Component
  const DashboardContent = () => (
    <>
      <Row className="mb-4">
        <Col>
          <Card className="welcome-card shadow-sm">
            <Card.Body className="p-4">
              <Row className="align-items-center">
                <Col md={8}>
                  <h3 className="mb-2">Welcome back, {guestData.name}! 👋</h3>
                  <p className="text-muted mb-3">
                    Enjoy your stay at {guestData.currentStay?.hotel}. Your room #
                    {guestData.currentStay?.roomNumber} is ready for you.
                  </p>
                  <div className="d-flex gap-2">
                    <Button variant="outline-primary" size="sm" onClick={() => setShowDigitalKey(true)}>
                      <FaKey className="me-2" />
                      Digital Room Key
                    </Button>
                    <Button variant="outline-success" size="sm" onClick={() => setShowServiceModal(true)}>
                      <FaConciergeBell className="me-2" />
                      Request Service
                    </Button>
                  </div>
                </Col>
                <Col md={4} className="text-end">
                  <div className="avatar-circle d-inline-block">
                    <FaUserCircle size={60} />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        {[
          { icon: <FaBed />, value: stats.totalStays, label: "Total Stays", color: "primary" },
          { icon: <FaCalendarCheck />, value: stats.upcomingStays, label: "Upcoming Stays", color: "success" },
          { icon: <FaStar />, value: stats.loyaltyPoints.toLocaleString(), label: "Loyalty Points", color: "warning" },
          { icon: <FaClock />, value: stats.pendingRequests, label: "Pending Requests", color: "info" },
        ].map((stat, idx) => (
          <Col md={3} sm={6} key={idx} className="mb-3">
            <Card className="stat-card shadow-sm h-100">
              <Card.Body className="text-center">
                <div className={`stat-icon mb-3 text-${stat.color}`}>
                  {stat.icon}
                </div>
                <h3 className="mb-1">{stat.value}</h3>
                <p className="text-muted mb-0">{stat.label}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mb-4">
        <Col lg={8}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                <FaClock className="me-2 text-primary" />
                Current Stay Details
              </h5>
            </Card.Header>
            <Card.Body>
              {guestData.currentStay ? (
                <Row>
                  <Col md={6}>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span>Room Number:</span>
                        <strong>#{guestData.currentStay.roomNumber}</strong>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span>Room Type:</span>
                        <strong>{guestData.currentStay.roomType}</strong>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span>Check-in:</span>
                        <strong>{formatDate(guestData.currentStay.checkIn)}</strong>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span>Check-out:</span>
                        <strong>{formatDate(guestData.currentStay.checkOut)}</strong>
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                  <Col md={6}>
                    <div className="text-center">
                      <div className="room-display mb-3">
                        <FaDoorClosed size={80} className="text-muted" />
                        <div className="room-number-display mt-2">
                          <h1 className="text-primary">#{guestData.currentStay.roomNumber}</h1>
                        </div>
                      </div>
                      <Button variant="primary" className="w-100 mb-2" onClick={() => setShowDigitalKey(true)}>
                        <FaMobileAlt className="me-2" />
                        Access Digital Key
                      </Button>
                      <Button variant="outline-primary" className="w-100" onClick={() => setActiveTab("services")}>
                        <FaConciergeBell className="me-2" />
                        View Services
                      </Button>
                    </div>
                  </Col>
                </Row>
              ) : (
                <div className="text-center py-5">
                  <FaCalendarCheck size={60} className="text-muted mb-3" />
                  <h5>No Active Stay</h5>
                  <p className="text-muted mb-4">You don't have any active bookings at the moment</p>
                  <Button variant="primary" onClick={() => window.location.href = "/book-now"}>
                    <FaPlus className="me-2" />
                    Book a Stay
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                <FaBolt className="me-2 text-warning" />
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" className="text-start" onClick={() => setShowServiceModal(true)}>
                  <FaConciergeBell className="me-2" />
                  Request Service
                </Button>
                <Button variant="outline-success" className="text-start" onClick={() => setActiveTab("services")}>
                  <FaSpa className="me-2" />
                  Book Spa Appointment
                </Button>
                <Button variant="outline-info" className="text-start" onClick={() => setShowFeedbackModal(true)}>
                  <FaCommentDots className="me-2" />
                  Submit Feedback
                </Button>
                <Button
                  variant="outline-warning"
                  className="text-start"
                  onClick={() => (window.location.href = "/book-now")}
                >
                  <FaPlusCircle className="me-2" />
                  New Booking
                </Button>
                <Button variant="outline-secondary" className="text-start" onClick={() => setActiveTab("profile")}>
                  <FaUserEdit className="me-2" />
                  Update Profile
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaHistory className="me-2" />
                Recent Bookings
              </h5>
              <Button variant="link" size="sm" onClick={() => setActiveTab("bookings")}>
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Hotel</th>
                    <th>Room Type</th>
                    <th>Dates</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 3).map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <FaMapMarkerAlt className="me-2 text-muted" />
                        {booking.hotel}
                      </td>
                      <td>{booking.roomType}</td>
                      <td>
                        {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                      </td>
                      <td>
                        <Badge bg={getStatusBadge(booking.status)}>{booking.status}</Badge>
                      </td>
                      <td>${booking.totalAmount}</td>
                      <td>
                        <ButtonGroup size="sm">
                          {booking.status === "upcoming" && (
                            <Button variant="outline-primary" onClick={() => handleBookingAction(booking.id, "checkin")}>
                              Check-in
                            </Button>
                          )}
                          {booking.status === "active" && (
                            <Button variant="outline-success" onClick={() => handleBookingAction(booking.id, "checkout")}>
                              Check-out
                            </Button>
                          )}
                          <Button variant="outline-secondary">
                            <FaEye />
                          </Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );

  // Bookings Content Component
  const BookingsContent = () => (
    <Card className="shadow-sm">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaCalendarAlt className="me-2 text-primary" />
          My Bookings
        </h5>
        <Button variant="primary" size="sm" onClick={() => (window.location.href = "/book-now")}>
          <FaPlus className="me-2" />
          New Booking
        </Button>
      </Card.Header>
      <Card.Body>
        <Tab.Container defaultActiveKey="all">
          <Nav variant="pills" className="mb-4">
            <Nav.Item>
              <Nav.Link eventKey="all">All Bookings ({bookings.length})</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="upcoming">
                Upcoming ({bookings.filter((b) => b.status === "upcoming").length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="active">Active ({bookings.filter((b) => b.status === "active").length})</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="completed">
                Completed ({bookings.filter((b) => b.status === "completed").length})
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            {["all", "upcoming", "active", "completed"].map((filter) => (
              <Tab.Pane key={filter} eventKey={filter}>
                <Row>
                  {bookings
                    .filter((b) => filter === "all" || b.status === filter)
                    .map((booking) => (
                      <Col lg={6} className="mb-3" key={booking.id}>
                        <Card className="booking-card h-100">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h5 className="mb-1">{booking.hotel}</h5>
                                <p className="text-muted mb-0">
                                  <FaMapMarkerAlt className="me-1" />
                                  {booking.hotel.split(" ")[1]} {/* Extract location */}
                                </p>
                              </div>
                              <Badge bg={getStatusBadge(booking.status)}>{booking.status.toUpperCase()}</Badge>
                            </div>

                            <div className="booking-details mb-3">
                              <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Room Type:</span>
                                <strong>{booking.roomType}</strong>
                              </div>
                              <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Room Number:</span>
                                <strong>#{booking.roomNumber}</strong>
                              </div>
                              <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Check-in:</span>
                                <strong>{formatDate(booking.checkIn)}</strong>
                              </div>
                              <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Check-out:</span>
                                <strong>{formatDate(booking.checkOut)}</strong>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span className="text-muted">Guests:</span>
                                <strong>{booking.guests} person(s)</strong>
                              </div>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mt-3">
                              <div>
                                <h4 className="text-primary mb-0">${booking.totalAmount}</h4>
                                <small className="text-muted">Total Amount</small>
                              </div>
                              <div className="d-flex gap-2">
                                {booking.status === "upcoming" && (
                                  <Button variant="outline-primary" size="sm" onClick={() => handleBookingAction(booking.id, "checkin")}>
                                    Check-in
                                  </Button>
                                )}
                                {booking.status === "active" && (
                                  <Button variant="outline-success" size="sm" onClick={() => handleBookingAction(booking.id, "checkout")}>
                                    Check-out
                                  </Button>
                                )}
                                <Button variant="outline-secondary" size="sm">
                                  <FaEye />
                                </Button>
                                <Button variant="outline-danger" size="sm">
                                  <FaTimes />
                                </Button>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                </Row>
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Tab.Container>
      </Card.Body>
    </Card>
  );

  // Services Content Component
  const ServicesContent = () => (
    <>
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaConciergeBell className="me-2 text-primary" />
                Request Services
              </h5>
              <Button variant="primary" size="sm" onClick={() => setShowServiceModal(true)}>
                <FaPlus className="me-2" />
                New Request
              </Button>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                {mockServices.map((service) => (
                  <Col key={service.id} xs={6} md={3}>
                    <Card
                      className="service-card text-center h-100"
                      onClick={() => {
                        setServiceForm({ ...serviceForm, type: service.id });
                        setShowServiceModal(true);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <Card.Body>
                        <div className={`service-icon mb-3 text-${service.color}`}>
                          {service.icon}
                        </div>
                        <h6 className="mb-0">{service.name}</h6>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );

  // Billing Content Component
  const BillingContent = () => (
    <Row>
      <Col lg={8}>
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-white">
            <h5 className="mb-0">
              <FaFileInvoiceDollar className="me-2 text-primary" />
              Invoices
            </h5>
          </Card.Header>
          <Card.Body>
            <Card className="mb-3">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={8}>
                    <div className="d-flex justify-content-between mb-2">
                      <h6 className="mb-0">Invoice #INV001</h6>
                      <Badge bg="success">PAID</Badge>
                    </div>
                    <p className="text-muted mb-2">Date: {formatDate("2024-03-15")}</p>
                    <div className="invoice-items">
                      <div className="d-flex justify-content-between">
                        <span>Room Charges (5 nights)</span>
                        <span>$4000</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Room Service</span>
                        <span>$300</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Spa Services</span>
                        <span>$200</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={4} className="text-end">
                    <div className="mb-3">
                      <h3 className="text-primary">$4500</h3>
                      <small className="text-muted">Total Amount</small>
                    </div>
                    <div className="d-grid gap-2">
                      <Button variant="outline-primary" size="sm">
                        <FaDownload className="me-2" />
                        Download PDF
                      </Button>
                      <Button variant="outline-secondary" size="sm">
                        <FaPrint className="me-2" />
                        Print
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
      </Col>

      <Col lg={4}>
        <Card className="shadow-sm">
          <Card.Header className="bg-white">
            <h5 className="mb-0">
              <FaFileInvoiceDollar className="me-2 text-success" />
              Payment Methods
            </h5>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-primary me-2">💳</span>
                  Visa ending in 4242
                </div>
                <Badge bg="success">Primary</Badge>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-warning me-2">💳</span>
                  Mastercard ending in 8888
                </div>
              </ListGroup.Item>
            </ListGroup>
            <Button variant="outline-primary" className="w-100 mt-3">
              <FaPlus className="me-2" />
              Add Payment Method
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  // Profile Content Component
  const ProfileContent = () => (
    <Row>
      <Col lg={4}>
        <Card className="shadow-sm mb-4">
          <Card.Body className="text-center">
            <div className="profile-avatar mb-3">
              <FaUserCircle size={80} className="text-primary" />
            </div>
            <h4>{guestData.name}</h4>
            <p className="text-muted">{guestData.email}</p>
            <Badge bg="warning" className="mb-3 px-3 py-2">
              <FaCrown className="me-2" />
              {guestData.membership} Member
            </Badge>

            <div className="loyalty-points mt-4">
              <h5 className="text-warning">{guestData.points.toLocaleString()} Points</h5>
              <small className="text-muted">Loyalty Points</small>
              <ProgressBar variant="warning" now={75} className="mt-2" style={{ height: "8px" }} />
              <small className="text-muted">Next tier at 15,000 points</small>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col lg={8}>
        <Card className="shadow-sm">
          <Card.Header className="bg-white">
            <h5 className="mb-0">
              <FaUserEdit className="me-2 text-primary" />
              Profile Information
            </h5>
          </Card.Header>
          <Card.Body>
            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" defaultValue={guestData.name} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" defaultValue={guestData.email} />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="tel" defaultValue={guestData.phone} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Membership Tier</Form.Label>
                    <Form.Control type="text" defaultValue={guestData.membership} disabled />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label>Special Requests/Notes</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Any special preferences?" />
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="primary">
                  <FaSave className="me-2" />
                  Save Changes
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  return (
    <Container fluid className="guest-dashboard-container">
      {/* Dashboard Tabs */}
      <Card className="shadow-sm mb-4">
        <Card.Body className="p-0">
          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Nav variant="pills" className="dashboard-nav">
              <Nav.Item>
                <Nav.Link eventKey="dashboard">
                  <FaHome className="me-2" />
                  Dashboard
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="bookings">
                  <FaCalendarAlt className="me-2" />
                  Bookings
                  <Badge bg="primary" className="ms-2">
                    {bookings.length}
                  </Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="services">
                  <FaConciergeBell className="me-2" />
                  Services
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="billing">
                  <FaFileInvoiceDollar className="me-2" />
                  Billing
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="profile">
                  <FaUser className="me-2" />
                  Profile
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content className="p-4">
              <Tab.Pane eventKey="dashboard">
                <DashboardContent />
              </Tab.Pane>
              <Tab.Pane eventKey="bookings">
                <BookingsContent />
              </Tab.Pane>
              <Tab.Pane eventKey="services">
                <ServicesContent />
              </Tab.Pane>
              <Tab.Pane eventKey="billing">
                <BillingContent />
              </Tab.Pane>
              <Tab.Pane eventKey="profile">
                <ProfileContent />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>

      {/* Service Request Modal */}
      <Modal show={showServiceModal} onHide={() => setShowServiceModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaConciergeBell className="me-2" />
            Request Service
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleServiceSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Service Type</Form.Label>
              <Row className="g-2">
                {mockServices.map((service) => (
                  <Col key={service.id} xs={6} md={4}>
                    <Form.Check
                      type="radio"
                      name="serviceType"
                      id={service.id}
                      label={
                        <div className="d-flex align-items-center">
                          <span className="me-2">{service.icon}</span>
                          {service.name}
                        </div>
                      }
                      value={service.id}
                      checked={serviceForm.type === service.id}
                      onChange={(e) => setServiceForm({ ...serviceForm, type: e.target.value })}
                    />
                  </Col>
                ))}
              </Row>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <div className="d-flex gap-3">
                {["low", "normal", "high", "urgent"].map((priority) => (
                  <Form.Check
                    key={priority}
                    type="radio"
                    name="priority"
                    id={`priority-${priority}`}
                    label={priority.charAt(0).toUpperCase() + priority.slice(1)}
                    value={priority}
                    checked={serviceForm.priority === priority}
                    onChange={(e) => setServiceForm({ ...serviceForm, priority: e.target.value })}
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Please describe your request..."
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Scheduled Time (Optional)</Form.Label>
              <Form.Control
                type="datetime-local"
                value={serviceForm.scheduledTime}
                onChange={(e) => setServiceForm({ ...serviceForm, scheduledTime: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowServiceModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading || !serviceForm.type}>
              {loading ? <Spinner animation="border" size="sm" /> : "Submit Request"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Feedback Modal */}
      <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCommentDots className="me-2" />
            Share Your Feedback
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFeedbackSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3 text-center">
              <Form.Label>Rating</Form.Label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= 5 ? "filled" : ""}`}
                    onClick={() => {}}
                    style={{ cursor: "pointer", fontSize: "2rem", margin: "0 2px" }}
                  >
                    {star <= 5 ? "★" : "☆"}
                  </span>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select>
                <option value="service">Service</option>
                <option value="room">Room Quality</option>
                <option value="cleanliness">Cleanliness</option>
                <option value="food">Food & Dining</option>
                <option value="facilities">Facilities</option>
                <option value="staff">Staff</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Comments</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Tell us about your experience..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowFeedbackModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Submit Feedback"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Digital Key Modal */}
      <Modal show={showDigitalKey} onHide={() => setShowDigitalKey(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaKey className="me-2" />
            Digital Room Key
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="digital-key-display mb-4">
            <div className="key-code">
              <h1 className="display-1 text-primary">{guestData.currentStay?.roomNumber}</h1>
            </div>
            <p className="text-muted">Room #{guestData.currentStay?.roomNumber}</p>
          </div>
          <div className="mb-4">
            <h5>Valid Until</h5>
            <p className="text-muted">{formatDate(guestData.currentStay?.checkOut)}</p>
          </div>
          <Alert variant="info">
            <FaInfoCircle className="me-2" />
            Show this code at the door or scan the QR code below
          </Alert>
          <div className="qr-code-placeholder bg-light p-4 rounded d-inline-block">
            <FaQrcode size={80} className="text-muted" />
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="primary">
            <FaDownload className="me-2" />
            Download Key
          </Button>
          <Button variant="outline-primary">
            <FaShareAlt className="me-2" />
            Share
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Guest;