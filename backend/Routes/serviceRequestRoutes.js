const express = require('express');
const router = express.Router();
const {
  createServiceRequest,
  getUserServiceRequests,
  getSingleServiceRequest,
  updateServiceRequestStatus,
  getAllServiceRequests,
  assignServiceRequest,
  addNotesToRequest
} = require('../Controllers/serviceRequestController');
const authMiddleware = require('../Middlewares/authenticationMiddleware');

// Guest routes (protected)
router.post('/create', authMiddleware, createServiceRequest);
router.get('/my-requests', authMiddleware, getUserServiceRequests);
router.get('/:requestId', authMiddleware, getSingleServiceRequest);
router.put('/:requestId/status', authMiddleware, updateServiceRequestStatus);

// Admin/Staff routes (additional role-based middleware needed)
router.get('/', authMiddleware, getAllServiceRequests);
router.put('/:requestId/assign', authMiddleware, assignServiceRequest);
router.put('/:requestId/notes', authMiddleware, addNotesToRequest);

module.exports = router;