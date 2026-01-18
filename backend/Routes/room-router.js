const express = require('express');
const router = express.Router();
const roomController = require('../Controllers/room-controller');
const authenticateJWT = require('../Middlewares/authenticationMiddleware');
const authorizeRole = require('../Middlewares/authorizeMiddleware');

router.post("/create-room", authenticateJWT, authorizeRole('admin', 'manager'), roomController.createRoom);
router.get("/all-rooms", roomController.getAllRooms);
router.get("/single-room/:roomId", roomController.getSingleRoomDetails);
router.put("/update-room/:roomId", authenticateJWT, authorizeRole('admin', 'manager'), roomController.updateRoomDetails);
router.delete("/delete-room/:roomId", authenticateJWT, authorizeRole('admin'), roomController.deleteRoom);
router.put("/update-room-status/:roomId", authenticateJWT, authorizeRole('admin', 'manager', 'staff', 'receptionist'), roomController.updateRoomStatus);

module.exports = router;
