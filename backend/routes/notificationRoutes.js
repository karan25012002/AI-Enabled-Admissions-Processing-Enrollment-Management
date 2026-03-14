const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, sendNotification, broadcastNotification } = require('../controllers/notificationController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getNotifications);
router.put('/read', protect, markAsRead);
router.post('/send', protect, adminOnly, sendNotification);
router.post('/broadcast', protect, adminOnly, broadcastNotification);

module.exports = router;
