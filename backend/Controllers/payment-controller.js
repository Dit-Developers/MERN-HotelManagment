const paymentModel = require("../Models/PaymentModel");

// POST A PAYMENT API
const processPayment = async (req, res) => {
    try {
        const { paymentMethod, userId, cardNumber, cardCVC, cardType, cardExpiryDate, cardHolderName, currency, amount, bookingId, roomId } = req.body;

        const findAPayment = await paymentModel.find({ bookingId: bookingId });
        if (findAPayment) { return res.status(404).json({ message: "Payment already exists", findAPayment }); }

        const payment = await paymentModel.create({ paymentMethod, userId, cardNumber, cardCVC, cardType, cardExpiryDate, cardHolderName, currency, amount, roomId });

        if (payment) { return res.status(200).json({ message: "Payment has been processed", payment }); }
    } catch (error) {
        console.error("Server error", error);
        return res.status(404).json({ message: "Internal server error", error });
    }
}
// GET ALL PAYMENTS API

const getAllPayments = async (req, res) => {
    try {
        const allPayments = await paymentModel.find();
        if (allPayments.length == 0) { return res.status(404).json({ message: "No payments found" }); }
        return res.status(200).json({ message: "Here are all the payments", allPayments });

    } catch (error) {
        console.error("Internal server error", error);
        return res.status(404).json({ message: "Internal server error", error });
    }
}

// GET A SINGLE PAYMENT DETAIL API
const getSinglePayment = async (req, res) => {
    try {
        const findPayment = await paymentModel.findById(req.params.paymentId);
        if (!findPayment) { return res.status(404).json({ message: "No payment found" }); }

        return res.status(200).json({ message: "Here is the requested payment details", findPayment });

    } catch (error) {
        console.error("Internal server error", error);
        return res.status(404).json({ message: "Internal server error", error });
    }
}

// UPDATE PAYMENT STATUS API
const updatePaymentStatus = async (req, res) => {
    try {

        const paymentId = req.params.paymentId;
        const findPayment = await paymentModel.findById(paymentId);
        if (!findPayment) { return res.status(404).json({ message: "No payment found" }); }

        const { paymentStatus } = req.body;

        const findPaymentToUpdate = await paymentModel.findByIdAndUpdate(paymentId, { status: paymentStatus }, { new: true });

        if (!findPaymentToUpdate) { return res.status(404).json({ message: "Error while updating the status", findPaymentToUpdate }); }

        return res.status(200).json({message:"Successfully updated the payment status", findPaymentToUpdate});
    } catch (error) {
        console.error("Internal server error", error);
        return res.status(404).json({message:"Internal server error"});
    }
}

module.exports = { processPayment, getAllPayments, getSinglePayment, updatePaymentStatus };