const express = require("express");
const router = express.Router();
const Room = require("../Models/RoomModel");

// CREATE
router.post("/create", async (req, res) => {
    const room = new Room(req.body);
    await room.save();
    res.json(room);
});

// READ ALL
router.get("/", async (req, res) => {
    res.json(await Room.find());
});

// UPDATE STATUS
router.put("/Update/:id", async (req, res) => {
    res.json(
        await Room.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

// DELETE
router.delete("/Delete/:id", async (req, res) => {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Room deleted" });
});

module.exports = router;
