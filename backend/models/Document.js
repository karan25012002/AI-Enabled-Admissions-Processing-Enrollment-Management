const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    documentType: {
      type: String,
      required: [true, 'Document type is required'],
      enum: [
        '10th_marksheet',
        '12th_marksheet',
        'graduation_certificate',
        'entrance_scorecard',
        'id_proof',
        'photo',
        'other',
      ],
    },
    originalName: {
      type: String,
      required: true,
    },
    fileURL: {
      type: String,
      required: [true, 'File URL is required'],
    },
    fileSize: {
      type: Number,
    },
    mimeType: {
      type: String,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
