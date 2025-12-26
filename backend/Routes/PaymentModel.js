const express = require("express");
const router = express.Router();
const Payment = require("../Models/PaymentModel");

// ADD PAYMENT
router.post("/create", async (req, res) => {
    const payment = new Payment(req.body);
    await payment.save();
    res.json(payment);
});

// GET PAYMENTS
router.get("/", async (req, res) => {
    res.json(await Payment.find().populate("InvoiceId"));
});

module.exports = router;
