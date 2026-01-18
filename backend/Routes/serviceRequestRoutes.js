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
const authorizeRole = require('../Middlewares/authorizeMiddleware');

router.post('/create', authMiddleware, createServiceRequest);
router.get('/my-requests', authMiddleware, getUserServiceRequests);
router.get('/:requestId', authMiddleware, getSingleServiceRequest);
router.put('/:requestId/status', authMiddleware, authorizeRole('admin', 'manager', 'staff'), updateServiceRequestStatus);

router.get('/', authMiddleware, authorizeRole('admin', 'manager', 'staff', 'receptionist'), getAllServiceRequests);
router.put('/:requestId/assign', authMiddleware, authorizeRole('admin', 'manager'), assignServiceRequest);
router.put('/:requestId/notes', authMiddleware, authorizeRole('staff', 'admin', 'manager'), addNotesToRequest);

module.exports = router;
