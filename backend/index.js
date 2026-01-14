const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./utils/connection");

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Routes
const authRouter = require("./Routes/auth-router");
const roomRouter = require("./Routes/room-router");
const bookingRouter = require("./Routes/booking-router");
const paymentRouter = require("./Routes/payment-router");
const reviewRouter = require('./Routes/review-router');
const serviceRequestRouter = require('./Routes/serviceRequestRoutes');

app.use("/api", authRouter);
app.use("/api/room", roomRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/service-requests", serviceRequestRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
