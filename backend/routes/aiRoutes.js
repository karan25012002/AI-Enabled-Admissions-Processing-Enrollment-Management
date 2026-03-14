const express = require('express');
const router = express.Router();
const { chatbot, getScreeningResults, getFraudReport, analyzeApplication } = require('../controllers/aiController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/chat', chatbot); // Public chatbot (no auth needed for landing page)
router.get('/screening', protect, adminOnly, getScreeningResults);
router.get('/fraud-report', protect, adminOnly, getFraudReport);
router.post('/analyze/:applicationId', protect, adminOnly, analyzeApplication);

module.exports = router;
