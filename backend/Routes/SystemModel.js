const express = require("express");
const router = express.Router();
const System = require("../Models/SystemModel");

// GET SYSTEM SETTINGS
router.get("/", async (req, res) => {
    res.json(await System.findOne());
});

// UPDATE SYSTEM SETTINGS
router.post("/update", async (req, res) => {
    let system = await System.findOne();
    if (!system) {
        system = new System(req.body);
    } else {
        Object.assign(system, req.body);
    }
    await system.save();
    res.json(system);
});

module.exports = router;
