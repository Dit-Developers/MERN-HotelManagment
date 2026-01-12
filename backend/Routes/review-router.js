const express = require('express');
const router = express.Router();

const reviewController = require('../Controllers/review-controller');


router.get("/get-all-reviews", reviewController.getAllReviews);
router.post("/create-review", reviewController.createReview);
router.get("/get-user/reviews/:userId", reviewController.getUserReviews);
router.delete("/delete-review", reviewController.deleteReview);


module.exports = router; 
