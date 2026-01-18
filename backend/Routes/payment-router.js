const express = require("express");
const router = express.Router();
const paymentController = require('../Controllers/payment-controller');
const authenticateJWT = require('../Middlewares/authenticationMiddleware');
const authorizeRole = require('../Middlewares/authorizeMiddleware');

router.post("/process-payment", authenticateJWT, authorizeRole('receptionist', 'admin', 'manager'), paymentController.processPayment);
router.get("/get-all-payments", authenticateJWT, authorizeRole('admin', 'manager', 'receptionist'), paymentController.getAllPayments);
router.get("/get-single-payment/:paymentId", authenticateJWT, authorizeRole('admin', 'manager', 'receptionist'), paymentController.getSinglePayment);
router.put("/update-payment-status/:paymentId", authenticateJWT, authorizeRole('admin', 'manager'), paymentController.updatePaymentStatus);


module.exports = router;
