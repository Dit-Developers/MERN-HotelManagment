const express = require("express");
const router = express.Router();
const authenticateJWT = require('../Middlewares/authenticationMiddleware');
const authorizeRole = require('../Middlewares/authorizeMiddleware');
const settingsController = require('../Controllers/settings-controller');

router.get("/settings", authenticateJWT, authorizeRole('admin', 'manager', 'receptionist'), settingsController.getSettings);
router.put("/settings", authenticateJWT, authorizeRole('admin'), settingsController.updateSettings);
router.post("/contact", settingsController.submitContactMessage);

module.exports = router;
