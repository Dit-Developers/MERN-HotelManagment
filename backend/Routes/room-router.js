const express = require('express');
const router = express.Router();
const roomController = require('../Controllers/room-controller');

router.post("/create-room", roomController.createRoom);
router.get("/all-rooms", roomController.getAllRooms);
router.get("/single-room/:roomId", roomController.getSingleRoomDetails);
router.put("/update-room/:roomId", roomController.updateRoomDetails);
router.delete("/delete-room/:roomId", roomController.deleteRoom);
router.put("/update-room-status/:roomId", roomController.updateRoomStatus);

module.exports = router;
