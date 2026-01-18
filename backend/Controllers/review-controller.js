const reviewModel = require("../Models/ReviewModel");

// Add a review - POST API

const createReview = async (req, res) => {
    try {
        const { userId, remarks } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required for a review" });
        }

        if (!remarks || typeof remarks !== "string" || !remarks.trim()) {
            return res.status(400).json({ message: "Review remarks cannot be empty" });
        }

        const addReview = await reviewModel.create({ userId, remarks: remarks.trim() });

        if (!addReview) {
            return res.status(404).json({ message: "Error while creating a review" });
        }

        return res.status(200).json({ message: "Review added successfully", addReview });

    } catch (error) {
        console.error("Internal server error", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


// Get all reviews - GET API

const getAllReviews = async (req, res) => {
    try {

        const getReviews = await reviewModel.find();
        if (getReviews.length === 0) {
            return res.status(404).json({ message: "No reviews found" });
        }

        return res.status(200).json({ message: "Here are all your reviews", getReviews });

    } catch (error) {
        console.error("Internal server error", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }

};


// Delete A Review API

// Delete A Review API - FIXED
const deleteReview = async (req, res) => {
    try {
        // Get reviewId from URL params
        const { reviewId } = req.params;
        
        if (!reviewId) {
            return res.status(400).json({ message: "Review ID is required" });
        }
        
        const findReview = await reviewModel.findById(reviewId);
        if (!findReview) { 
            return res.status(404).json({ message: "No review found to delete" }); 
        }

        const deleteReview = await reviewModel.findByIdAndDelete(reviewId);
        if (!deleteReview) { 
            return res.status(404).json({ message: "Error while deleting review" }); 
        }

        return res.status(200).json({ message: "Review deleted successfully!" });
    } catch (error) {
        console.error("Internal server error", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// GET A USERS REVIEWS - GET API

const getUserReviews = async (req, res) => {
    try {

        const uId = req.params.userId;
        const getReviews = await reviewModel.find({ userId: uId });
        if (getReviews.length === 0) {
            return res.status(404).json({ message: "No reviews found" });
        }

        return res.status(200).json({ message: "Here are all the user's reviews", getReviews });


    } catch (error) {
        console.error("Internal server error", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const updateReviewStatus = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { status } = req.body;

        const validStatuses = ["pending", "approved"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Must be one of: " + validStatuses.join(", ")
            });
        }

        const review = await reviewModel.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        review.status = status;
        await review.save();

        return res.status(200).json({
            message: "Review status updated successfully",
            review
        });
    } catch (error) {
        console.error("Internal server error", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = { createReview, getAllReviews, deleteReview, getUserReviews, updateReviewStatus };
