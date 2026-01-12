
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./utils/connection");
connectDB();


// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:3900", "http://localhost:5173"],
    credentials: true
  })
);


// Parse JSON
app.use(express.json());


// Routes
app.use("/users", require("./Routes/UserRoutes"));
app.use("/rooms", require("./Routes/RoomRoutes"));
app.use("/bookings", require("./Routes/BookingRoutes"));
app.use("/invoices", require("./Routes/InvoiceRoutes"));
app.use("/payments", require("./Routes/PaymentRoutes"));
app.use("/tasks", require("./Routes/TaskRoutes"));
app.use("/services", require("./Routes/ServiceRequestRoutes"));
app.use("/system", require("./Routes/SystemRoutes"));

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    service: "Hotel Management System API"
  });
});

// Home
app.get("/", (req, res) => {
  res.json({ 
    message: "Hotel Management System API",
    version: "1.0.0",
    endpoints: {
      auth: "/users",
      rooms: "/rooms",
      bookings: "/bookings"
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value entered'
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 3900;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});