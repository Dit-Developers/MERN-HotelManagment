const reviewModel = require("../Models/ReviewModel");

// Add a review - POST API

const createReview = async (req, res) => {
    try {
        const { userId, remarks } = req.body;

        const addReview = await reviewModel.create({ userId, remarks });

        if (!addReview) { return res.status(404).json({ message: "Error while creating a review" }); }

        return res.status(200).json({ message: "Review added successfully", addReview });

    } catch (error) {
        console.error("Internal server error", error);
        return res.status(404).json({ message: "Internal server error", error });
    }
}


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
        return res.status(404).json({ message: "Internal server error", error });
    }

}


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
}

// GET A USERS REVIEWS - GET API

const getUserReviews = async (req, res) => {
    try {

        const uId = req.params.userId;
        const getReviews = await reviewModel.find({ userId: uId });
        if (getReviews.length === 0) { return res.status(404).json({ message: "No reviews found" }); }

        return res.status(200).json({messsage:"Here are all the users reviews", getReviews });


    } catch (error) {
        console.error("Internal server error", error);
        return res.status(404).json({ message: "Internal server error", error });
    }
}
module.exports = { createReview, getAllReviews, deleteReview, getUserReviews };