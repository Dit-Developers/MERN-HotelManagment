const ServiceRequest = require('../Models/ServiceRequestModel');
const Notification = require('../Models/NotificationModel');

// CREATE NEW SERVICE REQUEST (Guest can create)
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

    // Create notifications for Admin, Manager, and Staff
    try {
      const notifType = serviceType === 'maintenance' ? 'maintenance' : 'service';
      const message = `New ${serviceType} request for Room ${roomNumber}: ${description.substring(0, 50)}...`;
      
      const rolesToNotify = ['admin', 'manager', 'staff'];
      
      const notifications = rolesToNotify.map(role => ({
        type: notifType,
        recipientRole: role,
        message: message,
        referenceId: serviceRequest._id
      }));
      
      await Notification.insertMany(notifications);
    } catch (notifyError) {
      console.error("Error creating notification:", notifyError);
    }

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

// UPDATE SERVICE REQUEST STATUS
const updateServiceRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    // Validate status
    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status" 
      });
    }

    const filter = { _id: requestId };

    if (userRole === 'guest') {
      filter.userId = userId;
    }

    const serviceRequest = await ServiceRequest.findOne(filter);

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

    // Notify Guest if status changed
    try {
      if (serviceRequest.userId) {
        await Notification.create({
          type: 'service',
          recipientRole: 'guest',
          userId: serviceRequest.userId,
          message: `Your ${serviceRequest.serviceType} request for Room ${serviceRequest.roomNumber} is now: ${status}`,
          referenceId: serviceRequest._id
        });
      }
    } catch (notifyError) {
      console.error("Error creating notification:", notifyError);
    }

    return res.status(200).json({ 
      message: "Service request status updated", 
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

    // Notification Logic: Notify the assigned staff member
    try {
        if (assignedTo) {
             await Notification.create({
                type: 'service',
                recipientRole: 'staff', // Target role is staff, but we also specify userId for precision
                userId: assignedTo,
                message: `New Work Assignment: You have been assigned a service request for Room ${serviceRequest.roomNumber}.`,
                referenceId: serviceRequest._id
            });
        }
    } catch (notifyError) {
        console.error("Error creating assignment notification:", notifyError);
    }

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
