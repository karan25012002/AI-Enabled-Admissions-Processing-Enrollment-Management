const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc  Get user's notifications
// @route GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort('-createdAt').limit(50);
    const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });
    res.json({ success: true, notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Mark notification(s) as read
// @route PUT /api/notifications/read
const markAsRead = async (req, res) => {
  try {
    const { ids } = req.body;
    if (ids && ids.length > 0) {
      await Notification.updateMany({ _id: { $in: ids }, userId: req.user._id }, { isRead: true });
    } else {
      await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    }
    res.json({ success: true, message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Admin: Send notification to user(s)
// @route POST /api/notifications/send
const sendNotification = async (req, res) => {
  try {
    const { userIds, title, message, type } = req.body;
    if (!userIds || !title || !message) {
      return res.status(400).json({ success: false, message: 'userIds, title and message are required' });
    }
    const notifications = userIds.map(uid => ({ userId: uid, title, message, type: type || 'info' }));
    await Notification.insertMany(notifications);
    res.json({ success: true, message: `Notification sent to ${userIds.length} user(s)` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Admin: Broadcast to all users
// @route POST /api/notifications/broadcast
const broadcastNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const users = await User.find({ isActive: true }, '_id');
    const notifications = users.map(u => ({ userId: u._id, title, message, type: type || 'info' }));
    await Notification.insertMany(notifications);
    res.json({ success: true, message: `Broadcast sent to ${users.length} users` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getNotifications, markAsRead, sendNotification, broadcastNotification };
