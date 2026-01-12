const express = require("express");
const router = express.Router();
const ServiceRequest = require("../Models/ServiceRequestModel");

// CREATE SERVICE REQUEST
router.post("/create", async (req, res) => {
    const request = new ServiceRequest(req.body);
    await request.save();
    res.json(request);
});

// GET REQUESTS
router.get("/", async (req, res) => {
    res.json(await ServiceRequest.find().populate("GuestId BookingId"));
});

// UPDATE STATUS
router.put("/:id", async (req, res) => {
    res.json(await ServiceRequest.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

module.exports = router;
