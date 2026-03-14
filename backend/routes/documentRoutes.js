const express = require('express');
const router = express.Router();
const { uploadDocument, getMyDocuments, getApplicationDocuments, getAllDocuments, verifyDocument } = require('../controllers/documentController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', protect, upload.single('document'), uploadDocument);
router.get('/my', protect, getMyDocuments);
router.get('/application/:applicationId', protect, getApplicationDocuments);
router.get('/all', protect, adminOnly, getAllDocuments);
router.put('/:id/verify', protect, adminOnly, verifyDocument);

module.exports = router;
