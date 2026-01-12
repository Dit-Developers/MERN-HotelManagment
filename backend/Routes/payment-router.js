const express = require("express");
const router = express.Router();
const paymentController = require('../Controllers/payment-controller');


router.post("/process-payment", paymentController.processPayment);
router.get("/get-all-payments", paymentController.getAllPayments);
router.get("/get-single-payment/:paymentId", paymentController.getSinglePayment);
router.put("/update-payment-status/:paymentId", paymentController.updatePaymentStatus);


module.exports = router;