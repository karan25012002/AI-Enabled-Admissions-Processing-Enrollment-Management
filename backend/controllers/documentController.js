const Document = require('../models/Document');
const Notification = require('../models/Notification');
const path = require('path');

// @desc  Upload document
// @route POST /api/documents/upload
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const { documentType, applicationId } = req.body;
    if (!documentType || !applicationId) {
      return res.status(400).json({ success: false, message: 'Document type and application ID are required' });
    }

    // Check for duplicate doc type per application
    const existing = await Document.findOne({ userId: req.user._id, applicationId, documentType });
    if (existing) {
      // Update existing rather than create new
      existing.fileURL = `/uploads/${req.file.filename}`;
      existing.originalName = req.file.originalname;
      existing.fileSize = req.file.size;
      existing.mimeType = req.file.mimetype;
      existing.verificationStatus = 'pending';
      existing.verifiedBy = null;
      existing.verifiedAt = null;
      await existing.save();
      return res.json({ success: true, message: 'Document updated', document: existing });
    }

    const document = await Document.create({
      userId: req.user._id,
      applicationId,
      documentType,
      originalName: req.file.originalname,
      fileURL: `/uploads/${req.file.filename}`,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });
    res.status(201).json({ success: true, message: 'Document uploaded successfully', document });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get user's documents
// @route GET /api/documents/my
const getMyDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user._id }).sort('-createdAt');
    res.json({ success: true, documents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get documents for application (admin or owner)
// @route GET /api/documents/application/:applicationId
const getApplicationDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ applicationId: req.params.applicationId })
      .populate('userId', 'name email');
    res.json({ success: true, documents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get all pending documents (admin)
// @route GET /api/documents/all
const getAllDocuments = async (req, res) => {
  try {
    const { verificationStatus } = req.query;
    const filter = verificationStatus ? { verificationStatus } : {};
    const documents = await Document.find(filter)
      .populate('userId', 'name email')
      .populate('applicationId', 'status')
      .sort('-createdAt');
    res.json({ success: true, count: documents.length, documents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Verify document (admin)
// @route PUT /api/documents/:id/verify
const verifyDocument = async (req, res) => {
  try {
    const { verificationStatus, rejectionReason } = req.body;
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus,
        verifiedBy: null, // admin is hardcoded
        verifiedAt: new Date(),
        rejectionReason: rejectionReason || '',
      },
      { new: true }
    ).populate('userId', 'name');

    if (!document) return res.status(404).json({ success: false, message: 'Document not found' });

    // Notify user
    const msg = verificationStatus === 'verified'
      ? `Your document "${document.documentType.replace(/_/g, ' ')}" has been verified by the admin.`
      : `Your document "${document.documentType.replace(/_/g, ' ')}" was rejected. Reason: ${rejectionReason || 'Not specified'}`;

    await Notification.create({
      userId: document.userId._id,
      title: `Document ${verificationStatus === 'verified' ? 'Verified' : 'Rejected'}`,
      message: msg,
      type: verificationStatus === 'verified' ? 'success' : 'error',
      relatedId: document._id,
      relatedModel: 'Document',
    });

    res.json({ success: true, message: `Document ${verificationStatus}`, document });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadDocument, getMyDocuments, getApplicationDocuments, getAllDocuments, verifyDocument };
