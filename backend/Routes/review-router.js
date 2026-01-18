const express = require('express');
const router = express.Router();
const reviewController = require('../Controllers/review-controller');
const authenticateJWT = require('../Middlewares/authenticationMiddleware');
const authorizeRole = require('../Middlewares/authorizeMiddleware');

router.get("/get-all-reviews", authenticateJWT, authorizeRole('admin', 'manager'), reviewController.getAllReviews);
router.post("/create-review", authenticateJWT, authorizeRole('guest', 'user', 'staff', 'receptionist', 'manager', 'admin'), reviewController.createReview);
router.get("/get-user/reviews/:userId", authenticateJWT, authorizeRole('admin', 'manager', 'guest', 'user'), reviewController.getUserReviews);
router.delete("/delete-review/:reviewId", authenticateJWT, authorizeRole('admin'), reviewController.deleteReview);


module.exports = router; 
