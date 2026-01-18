const express = require("express");
const router = express.Router();
const authenticateJWT = require('../Middlewares/authenticationMiddleware');
const authorizeRole = require('../Middlewares/authorizeMiddleware');
const settingsController = require('../Controllers/settings-controller');

router.get("/settings", authenticateJWT, authorizeRole('admin', 'manager', 'receptionist'), settingsController.getSettings);
router.put("/settings", authenticateJWT, authorizeRole('admin'), settingsController.updateSettings);
router.post("/contact", settingsController.submitContactMessage);
router.get("/contact-messages", authenticateJWT, authorizeRole('admin'), settingsController.getContactMessages);
router.delete("/contact-messages/:id", authenticateJWT, authorizeRole('admin'), settingsController.deleteContactMessage);

module.exports = router;
