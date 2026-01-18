const paymentModel = require("../Models/PaymentModel");
const BookingModel = require("../Models/BookingModel");

// POST A PAYMENT API
const processPayment = async (req, res) => {
  try {
    const {
      paymentMethod,
      userId,
      cardNumber,
      cardCVC,
      cardType,
      cardExpiryDate,
      cardHolderName,
      currency,
      amount,
      bookingId,
      roomId,
      status
    } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required for payment" });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero" });
    }

    const allowedStatuses = ["pending", "completed", "failed", "cancelled", "refunded"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be one of: " + allowedStatuses.join(", "),
      });
    }

    const allowedCurrencies = ["USD", "EUR", "GBP", "PKR"];
    let normalizedCurrency = currency;
    if (currency) {
      normalizedCurrency = String(currency).toUpperCase();
      if (!allowedCurrencies.includes(normalizedCurrency)) {
        return res.status(400).json({
          message: "Invalid currency. Must be one of: " + allowedCurrencies.join(", "),
        });
      }
    }

    const existingPayment = await paymentModel.findOne({ bookingId: bookingId });
    if (existingPayment) {
      return res.status(400).json({
        message: "Payment already exists for this booking",
        existingPayment
      });
    }

    let effectiveUserId = userId || null;
    let effectiveRoomId = roomId || null;

    const booking = await BookingModel.findById(bookingId);
    if (booking) {
      if (!effectiveUserId) {
        effectiveUserId = booking.guestId;
      }
      if (!effectiveRoomId) {
        effectiveRoomId = booking.roomId;
      }
    }

    if (!effectiveUserId) {
      return res.status(400).json({ message: "User ID is required for payment" });
    }

    const cardMethods = ["credit_card", "debit_card"];
    const isCardPayment = cardMethods.includes(paymentMethod);

    const cardCVCNumber = parseInt(cardCVC, 10) || 0;

    if (isCardPayment) {
      if (!cardNumber || String(cardNumber).replace(/\D/g, "").length < 12) {
        return res.status(400).json({ message: "Valid card number is required" });
      }
      if (!cardExpiryDate) {
        return res.status(400).json({ message: "Card expiry date is required" });
      }
      if (!cardHolderName) {
        return res.status(400).json({ message: "Card holder name is required" });
      }
      if (!cardCVCNumber || String(cardCVCNumber).length < 3) {
        return res.status(400).json({ message: "Valid card CVC is required" });
      }
    }

    const payment = await paymentModel.create({
      paymentMethod: paymentMethod || "cash",
      userId: effectiveUserId,
      bookingId,
      cardNumber: cardNumber || "",
      cardCVC: cardCVCNumber,
      cardType: cardType || "",
      cardExpiryDate: cardExpiryDate || "",
      cardHolderName: cardHolderName || "",
      currency: normalizedCurrency || "USD",
      amount,
      roomId: effectiveRoomId,
      status: status || "pending"
    });

    return res.status(201).json({
      message: "Payment processed successfully",
      payment
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

// GET ALL PAYMENTS API
const getAllPayments = async (req, res) => {
    try {
        const allPayments = await paymentModel.find()
            .populate('userId', 'fullName email')
            .populate('bookingId', 'checkInDate checkOutDate totalAmount')
            .populate('roomId', 'roomNumber roomType');

        if (allPayments.length === 0) { 
            return res.status(404).json({ message: "No payments found" }); 
        }
        
        return res.status(200).json({ 
            message: "Payments retrieved successfully", 
            count: allPayments.length,
            payments: allPayments 
        });

    } catch (error) {
        console.error("Get payments error:", error);
        return res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
}

// GET A SINGLE PAYMENT DETAIL API
const getSinglePayment = async (req, res) => {
    try {
        const paymentId = req.params.paymentId;
        const payment = await paymentModel.findById(paymentId)
            .populate('userId', 'fullName email phone')
            .populate('bookingId')
            .populate('roomId', 'roomNumber roomType price');

        if (!payment) { 
            return res.status(404).json({ message: "Payment not found" }); 
        }

        return res.status(200).json({ 
            message: "Payment details retrieved", 
            payment 
        });

    } catch (error) {
        console.error("Get single payment error:", error);
        return res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
}

// UPDATE PAYMENT STATUS API
const updatePaymentStatus = async (req, res) => {
    try {
        const paymentId = req.params.paymentId;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['pending', 'completed', 'failed', 'cancelled', 'refunded'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: "Invalid status. Must be one of: " + validStatuses.join(', ') 
            });
        }

        const updatedPayment = await paymentModel.findByIdAndUpdate(
            paymentId, 
            { status: status }, 
            { new: true, runValidators: true }
        ).populate('userId bookingId roomId');

        if (!updatedPayment) { 
            return res.status(404).json({ message: "Payment not found" }); 
        }

        return res.status(200).json({
            message: "Payment status updated successfully", 
            payment: updatedPayment
        });
    } catch (error) {
        console.error("Update payment error:", error);
        return res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
}

module.exports = { processPayment, getAllPayments, getSinglePayment, updatePaymentStatus };
