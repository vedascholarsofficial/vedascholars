const Notification = require('../models/Notification');

// Internal helper — not a route handler, called by other controllers
const createNotification = async (userId, message, type = 'system') => {
    try {
        await Notification.create({ user: userId, message, type });
    } catch (error) {
        console.error('createNotification Error:', error);
    }
};

// @desc    Get all notifications for logged-in user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.status(200).json(notifications);
    } catch (error) {
        console.error('getNotifications Error:', error);
        res.status(500).json({ message: 'Server error fetching notifications.' });
    }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { isRead: true },
            { returnDocument: 'after' }
        );
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found.' });
        }
        res.status(200).json(notification);
    } catch (error) {
        console.error('markAsRead Error:', error);
        res.status(500).json({ message: 'Server error marking notification as read.' });
    }
};

module.exports = { getNotifications, markAsRead, createNotification };
