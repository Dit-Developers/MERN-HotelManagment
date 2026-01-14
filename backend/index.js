const express = require("express");
const cors = require("cors"); // Only one import
const bodyParser = require("body-parser");
require("dotenv").config();
require("./utils/connection");
const app = express();

// Middleware setup
app.use(express.json());
app.use(bodyParser.json());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Import routes - FIXED the room-router issue
const authRouter = require("./Routes/auth-router");
// const roomRouter = require("./Routes/room-router"); // Changed from auth-router
const bookingRouter = require("./Routes/booking-router");
const paymentRouter = require("./Routes/payment-router");
const reviewRouter = require('./Routes/review-router');

// Use routes - Notice the base path is /api
app.use("/api", authRouter); // This makes login route: /api/auth/login
// app.use("/api/room", roomRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/reviews", reviewRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});