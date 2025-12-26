const express = require("express");
const router = express.Router();
const Invoice = require("../Models/InvoiceModel");

// CREATE INVOICE
router.post("/create", async (req, res) => {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.json(invoice);
});

// GET ALL INVOICES
router.get("/", async (req, res) => {
    res.json(await Invoice.find().populate("GuestId BookingId"));
});

// UPDATE PAYMENT STATUS
router.put("/:id", async (req, res) => {
    res.json(await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

module.exports = router;
