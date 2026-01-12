const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./utils/connection");

app.use(express.json());
app.use(cors());

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// User & Auth Routes
app.use("/users", require("./Routes/UserRoute"));

// Other routes
app.use("/rooms", require("./Routes/RoomModel"));
app.use("/bookings", require("./Routes/BookingModel"));
app.use("/invoices", require("./Routes/InvoiceModel"));
app.use("/payments", require("./Routes/PaymentModel"));
app.use("/tasks", require("./Routes/TaskModel"));
app.use("/services", require("./Routes/ServiceRequestModel"));
app.use("/system", require("./Routes/SystemModel"));

// Health check endpoint
app.get("/health", (req, res) => {
    return res.json({ 
        status: "ok", 
        timestamp: new Date().toISOString(),
        routes: [
            "/users",
            "/rooms",
            "/bookings",
            "/invoices",
            "/payments",
            "/tasks",
            "/services",
            "/system"
        ]
    });
});

// Root endpoint
app.get("/", (req, res) => {
    return res.json({ 
        message: "Hotel Management API is running",
        version: "1.0.0",
        documentation: "Available at /health endpoint"
    });
});

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ 
        error: "Route not found",
        method: req.method,
        url: req.url
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).json({ 
        error: "Internal server error",
        message: err.message 
    });
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`API is running on http://localhost:${PORT}/`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});