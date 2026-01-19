import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '../config/api';
import { toast } from 'react-toastify';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const notificationRef = useRef(null);
    const seenIdsRef = useRef(new Set());
    const isInitializedRef = useRef(false);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            
            const response = await axios.get(`${API_URL}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.notifications) {
                const newNotifications = response.data.notifications;
                
                // Show toast for new unread notifications
                if (isInitializedRef.current) {
                    const brandNew = newNotifications.filter(n => !seenIdsRef.current.has(n._id) && !n.isRead);
                    brandNew.forEach(n => {
                        toast.info(n.message, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            onClick: () => setShowNotifications(true)
                        });
                    });
                }

                // Update seen IDs
                newNotifications.forEach(n => seenIdsRef.current.add(n._id));
                isInitializedRef.current = true;

                setNotifications(newNotifications);
                setUnreadCount(newNotifications.filter(n => !n.isRead).length);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const deleteNotification = async (id, e) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.filter(n => n._id !== id));
            // Recalculate unread count
            const notification = notifications.find(n => n._id === id);
            if (notification && !notification.isRead) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    return (
        <div className="relative" ref={notificationRef}>
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors focus:outline-none"
            >
                <FaBell className="text-xl" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-xl overflow-hidden z-50 border border-gray-100">
                    <div className="py-2 bg-gray-50 border-b border-gray-100 flex justify-between items-center px-4">
                        <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                        <button onClick={fetchNotifications} className="text-xs text-blue-500 hover:text-blue-700">Refresh</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
                        ) : (
                            notifications.map(notification => (
                                <div 
                                    key={notification._id}
                                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''}`}
                                    onClick={() => markAsRead(notification._id)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={(e) => deleteNotification(notification._id, e)}
                                            className="text-gray-400 hover:text-red-500 ml-2 p-1"
                                            title="Delete"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;