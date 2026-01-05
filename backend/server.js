const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./utils/connection");


app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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

app.get("/", (req, res) => {
  res.json("API is running");
});

const PORT = process.env.PORT || 3900;

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});