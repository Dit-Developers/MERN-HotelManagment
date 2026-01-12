const bookingModel = require("../Models/BookingModel");
const paymentModel = require("../Models/PaymentModel");
const reviewModel = require("../Models/ReviewModel");
const roomModel = require("../Models/RoomModel");
const userModel = require("../Models/UserModel");

// OVERVIEW DASH API

const overView = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments();
        const payments = await paymentModel.countDocuments();
        const bookings = await bookingModel.countDocuments();
        const reviews = await reviewModel.countDocuments();
        const rooms = await roomModel.countDocuments();
        

    } catch (error) {
        console.error("Internal server error", error);
        return res.status(404).json({ message: "Internal server error", error });
    }
}
