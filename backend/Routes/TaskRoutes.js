const express = require("express");
const router = express.Router();
const Task = require("../Models/TaskModel");

// CREATE TASK
router.post("/create", async (req, res) => {
    const task = new Task(req.body);
    await task.save();
    res.json(task);
});

// GET TASKS
router.get("/", async (req, res) => {
    res.json(await Task.find().populate("RoomId AssignedTo ReportedBy"));
});

// UPDATE TASK
router.put("/:id", async (req, res) => {
    res.json(await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

module.exports = router;
