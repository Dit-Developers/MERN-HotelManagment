const roomModel = require('../Models/RoomModel');
const Notification = require('../Models/NotificationModel');
const availableStatus = "available";
const bookedStatus = "booked";
const underMaintenenceStatus = "under maintenance";
const cleaningStatus = "cleaning";



// Room Creation API

const createRoom = async (req, res) => {
    try {
        const { roomNumber, roomType, pricePerNight, bedCount, floor, hasAC, hasWIFI, hasTV, isAvailable, roomStatus } = req.body;
        const findAnExistingRoom = await roomModel.findOne({ roomNumber: roomNumber });

        if (findAnExistingRoom) { return res.status(400).json({ message: "Room already exists" }); }
        const room = await roomModel.create({
            roomNumber, roomType, pricePerNight, bedCount, floor, hasAC, hasTV, hasWIFI, isAvailable, roomStatus
        });
        if (room) {
            return res.status(200).json({ message: "Room has been created successfully", room });
        }

    } catch (error) {
        console.error("Server error", error);
        return res.status(400).json({ message: "Server error", error });

    }
}

// GET all rooms API
const getAllRooms = async (req, res) => {

    try {
        const allRooms = await roomModel.find();
        if (!allRooms) { return res.status(404).json({ message: "No rooms found" }); }
        if (allRooms.length == 0) { return res.status(404).json({ message: "No rooms found" }); }

        return res.status(200).json({ message: "All rooms found", findRooms: allRooms });

    } catch (error) {
        console.error("Server error", error);
        return res.status(400).json({ message: "Server error", error });
    }

}

// GET Single Room details API
const getSingleRoomDetails = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const singleRoom = await roomModel.findOne({ _id: roomId });
        if (!singleRoom) { return res.status(404).json({ message: "Room not found" }); }
        return res.status(200).json({ message: "Here is your room details", findRoom: singleRoom });
    } catch (error) {

    }
}


//  Update Single Room Details API
const updateRoomDetails = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const findRoom = await roomModel.findOne({ _id: roomId });

        if (!findRoom) { return res.status(404).json({ message: "Room not found" }); }
        const updateRoom = await roomModel.findByIdAndUpdate(
            roomId,
            req.body,
            { new: true }
        );
        if (!updateRoom) { return res.status(404).json({ message: "An error occured while updating room details" }); }
        return res.status(200).json({ messgae: "Room details updated successfully", updateRoom });

    } catch (error) {
        console.error("Server error", error);
        return res.status(404).json({ message: "Server error", error });
    }
}


// DELETE A ROOM API - NOT FOR USE
const deleteRoom = async (req, res) => {
    try {
        const findRoom = await roomModel.findOne({ _id: req.params.roomId });
        if (!findRoom) { return res.status(404).json({ message: "Room not found" }); }
        const deleteRoom = await roomModel.findByIdAndDelete(req.params.roomId);
        if (deleteRoom) { return res.status(200).json({ message: "Room has been deleted", deleteRoom }); }

    } catch (error) {
        console.error("Server error", error);
        return res.status(400).json({ message: "Server error", error });
    }
}


// update room status API
const updateRoomStatus = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const { status, roomStatus, isAvailable } = req.body;

        const newStatus = status || roomStatus;

        const findRoom = await roomModel.findOne({ _id: roomId });
        if (!findRoom) { return res.status(404).json({ message: "No room found" }); }

        if (!newStatus) {
            return res.status(400).json({ message: "New room status is required" });
        }

        const currentRoomStatus = findRoom.roomStatus;

        if (currentRoomStatus === newStatus && typeof isAvailable !== "boolean") {
            return res.status(400).json({ message: `This room's status is already ${currentRoomStatus}` });
        }

        const updateFields = { roomStatus: newStatus };

        if (typeof isAvailable === "boolean") {
            updateFields.isAvailable = isAvailable;
        }

        const updateStatus = await roomModel.findByIdAndUpdate(
            roomId,
            updateFields,
            { new: true }
        );

        if (!updateStatus) {
            return res.status(404).json({ message: "An error occurred while updating room status" });
        }

        // Send notifications based on status change
        try {
            if (newStatus === 'cleaning') {
                // Notify Staff
                await Notification.create({
                    type: 'system',
                    recipientRole: 'staff',
                    message: `Room ${findRoom.roomNumber} needs cleaning.`,
                    referenceId: roomId
                });
            } else if (newStatus === 'available') {
                // Notify Reception & Manager
                const readyMessage = `Room ${findRoom.roomNumber} is now available for check-in.`;
                
                await Notification.create({
                    type: 'system',
                    recipientRole: 'receptionist',
                    message: readyMessage,
                    referenceId: roomId
                });

                await Notification.create({
                    type: 'system',
                    recipientRole: 'manager',
                    message: readyMessage,
                    referenceId: roomId
                });
            } else if (newStatus === 'under maintenance') {
                // Notify Admin & Manager
                const maintMessage = `Room ${findRoom.roomNumber} has been marked as Under Maintenance.`;
                
                await Notification.create({
                    type: 'maintenance',
                    recipientRole: 'admin',
                    message: maintMessage,
                    referenceId: roomId
                });

                await Notification.create({
                    type: 'maintenance',
                    recipientRole: 'manager',
                    message: maintMessage,
                    referenceId: roomId
                });
            }
        } catch (notifyError) {
            console.error("Error creating notification:", notifyError);
        }

        return res.status(200).json({ message: `The room has been successfully ${newStatus}`, updateStatus });
    } catch (error) {
        console.error("Server error", error);
        return res.status(404).json({ message: "Server error", error });

    }
}


module.exports = { createRoom, getAllRooms, getSingleRoomDetails, updateRoomDetails, deleteRoom, updateRoomStatus };
