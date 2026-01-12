const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./utils/connection"); 

app.use(express.json());
app.use(cors());

// User & Auth
app.use("/users", require("./Routes/UserModel"));


app.use("/rooms", require("./Routes/RoomModel"));
app.use("/bookings", require("./Routes/BookingModel"));
app.use("/invoices", require("./Routes/InvoiceModel"));
app.use("/payments", require("./Routes/PaymentModel"));
app.use("/tasks", require("./Routes/TaskModel"));
app.use("/services", require("./Routes/ServiceRequestModel"));
app.use("/system", require("./Routes/SystemModel"));


// GET SINGLE STUDENT
app.get("/", (req, res) => {
    return res.json("Nothing to see here..... hahahahaahhaah");
});

app.listen(process.env.PORT, () => {
    console.log("API is running on http://localhost:9000/");
})