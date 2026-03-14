const express = require('express');
const router = express.Router();
const { getDashboardStats, getProgramAnalytics, getApplicationTrend, getAllUsers } = require('../controllers/analyticsController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/programs', protect, adminOnly, getProgramAnalytics);
router.get('/trend', protect, adminOnly, getApplicationTrend);
router.get('/users', protect, adminOnly, getAllUsers);

module.exports = router;
