const ServiceRequest = require('../Models/ServiceRequestModel');

// CREATE SERVICE REQUEST (Guest can create)
const createServiceRequest = async (req, res) => {
  try {
    const { serviceType, description, roomNumber, priority } = req.body;
    const userId = req.user._id; // From auth middleware

    // Validation
    if (!serviceType || !description || !roomNumber) {
      return res.status(400).json({ 
        message: "Please provide service type, description, and room number" 
      });
    }

    const serviceRequest = await ServiceRequest.create({
      userId,
      serviceType,
      description,
      roomNumber,
      priority: priority || 'normal',
      status: 'pending'
    });

    return res.status(201).json({
      message: "Service request created successfully",
      serviceRequest
    });

  } catch (error) {
    console.error("Error creating service request:", error);
    return res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// GET ALL SERVICE REQUESTS FOR A USER (Guest can view their own)
const getUserServiceRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const serviceRequests = await ServiceRequest.find({ userId })
      .sort({ createdAt: -1 })
      .populate('assignedTo', 'fullName email phone');

    return res.status(200).json({
      message: "Service requests retrieved successfully",
      serviceRequests
    });

  } catch (error) {
    console.error("Error fetching service requests:", error);
    return res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// GET SINGLE SERVICE REQUEST
const getSingleServiceRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const serviceRequest = await ServiceRequest.findOne({
      _id: requestId,
      userId // Ensure user can only access their own requests
    }).populate('assignedTo', 'fullName email phone');

    if (!serviceRequest) {
      return res.status(404).json({ 
        message: "Service request not found" 
      });
    }

    return res.status(200).json({
      message: "Service request retrieved successfully",
      serviceRequest
    });

  } catch (error) {
    console.error("Error fetching service request:", error);
    return res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// UPDATE SERVICE REQUEST STATUS (User can cancel their own)
const updateServiceRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    // Validate status
    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status" 
      });
    }

    // Find the request
    const serviceRequest = await ServiceRequest.findOne({
      _id: requestId,
      userId // User can only update their own requests
    });

    if (!serviceRequest) {
      return res.status(404).json({ 
        message: "Service request not found" 
      });
    }

    // Update status
    serviceRequest.status = status;
    if (status === 'completed') {
      serviceRequest.completedAt = new Date();
    }

    await serviceRequest.save();

    return res.status(200).json({
      message: `Service request ${status} successfully`,
      serviceRequest
    });

  } catch (error) {
    console.error("Error updating service request:", error);
    return res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// ADMIN/STAFF APIs (for hotel staff to manage requests)

// GET ALL SERVICE REQUESTS (Admin/Staff)
const getAllServiceRequests = async (req, res) => {
  try {
    const { status, serviceType } = req.query;
    
    let filter = {};
    
    if (status) filter.status = status;
    if (serviceType) filter.serviceType = serviceType;

    const serviceRequests = await ServiceRequest.find(filter)
      .sort({ priority: -1, createdAt: -1 })
      .populate('userId', 'fullName email phone')
      .populate('assignedTo', 'fullName email phone');

    return res.status(200).json({
      message: "All service requests retrieved successfully",
      serviceRequests
    });

  } catch (error) {
    console.error("Error fetching all service requests:", error);
    return res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// ASSIGN SERVICE REQUEST TO STAFF (Admin/Staff)
const assignServiceRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { assignedTo, notes } = req.body;

    const serviceRequest = await ServiceRequest.findById(requestId);

    if (!serviceRequest) {
      return res.status(404).json({ 
        message: "Service request not found" 
      });
    }

    // Update assignment
    serviceRequest.assignedTo = assignedTo;
    serviceRequest.status = 'in_progress';
    if (notes) serviceRequest.notes = notes;

    await serviceRequest.save();

    return res.status(200).json({
      message: "Service request assigned successfully",
      serviceRequest
    });

  } catch (error) {
    console.error("Error assigning service request:", error);
    return res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// ADD NOTES TO SERVICE REQUEST (Staff)
const addNotesToRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { notes } = req.body;

    const serviceRequest = await ServiceRequest.findById(requestId);

    if (!serviceRequest) {
      return res.status(404).json({ 
        message: "Service request not found" 
      });
    }

    serviceRequest.notes = notes || serviceRequest.notes;
    await serviceRequest.save();

    return res.status(200).json({
      message: "Notes added successfully",
      serviceRequest
    });

  } catch (error) {
    console.error("Error adding notes:", error);
    return res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

module.exports = {
  createServiceRequest,
  getUserServiceRequests,
  getSingleServiceRequest,
  updateServiceRequestStatus,
  getAllServiceRequests,
  assignServiceRequest,
  addNotesToRequest
};