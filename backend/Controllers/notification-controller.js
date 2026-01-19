const Notification = require('../Models/NotificationModel');

const getNotifications = async (req, res) => {
    try {
        const { role, _id } = req.user;
        let query = {};

        if (role === 'admin') {
            query = { 
                $or: [
                    { recipientRole: { $in: ['admin', 'all'] } },
                    { recipientRole: { $exists: false } }
                ]
            };
        } else if (role === 'guest') {
            query = { 
                recipientRole: 'guest',
                userId: _id 
            };
        } else {
            // Staff/Manager/Reception
            const rolesToQuery = [role, 'staff', 'all'];
            if (role === 'receptionist') rolesToQuery.push('reception');

            query = {
                recipientRole: { $in: rolesToQuery }
            };
        }

        // Fetch unread notifications first, then read ones, sorted by date
        const notifications = await Notification.find(query)
            .sort({ isRead: 1, createdAt: -1 })
            .limit(50); // Limit to last 50 to avoid clutter

        return res.status(200).json({ 
            message: "Notifications fetched successfully", 
            notifications 
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(
            id, 
            { isRead: true }, 
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        return res.status(200).json({ 
            message: "Notification marked as read", 
            notification 
        });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ isRead: false }, { isRead: true });
        return res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndDelete(id);
        return res.status(200).json({ message: "Notification deleted" });
    } catch (error) {
        console.error("Error deleting notification:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
};
