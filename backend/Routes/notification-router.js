const express = require('express');
const router = express.Router();
const notificationController = require('../Controllers/notification-controller');
const authenticateJWT = require('../Middlewares/authenticationMiddleware');
const authorizeRole = require('../Middlewares/authorizeMiddleware');

// Get all notifications
router.get(
    '/',
    authenticateJWT,
    authorizeRole('admin', 'manager', 'receptionist', 'staff'),
    notificationController.getNotifications
);

// Mark single as read
router.put(
    '/:id/read',
    authenticateJWT,
    authorizeRole('admin', 'manager', 'receptionist', 'staff'),
    notificationController.markAsRead
);

// Mark all as read
router.put(
    '/read-all',
    authenticateJWT,
    authorizeRole('admin', 'manager', 'receptionist', 'staff'),
    notificationController.markAllAsRead
);

// Delete notification
router.delete(
    '/:id',
    authenticateJWT,
    authorizeRole('admin', 'manager'),
    notificationController.deleteNotification
);

module.exports = router;
