const express = require('express');
const router = express.Router();
const { submitApplication, getMyApplications, getAllApplications, getApplication, updateApplicationStatus } = require('../controllers/applicationController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, submitApplication);
router.get('/my', protect, getMyApplications);
router.get('/', protect, adminOnly, getAllApplications);
router.get('/:id', protect, getApplication);
router.put('/:id/status', protect, adminOnly, updateApplicationStatus);

module.exports = router;
