const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
    },
    // Personal Details
    email: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    // Academic Info
    gpa: {
      type: Number,
      required: [true, 'GPA is required'],
      min: 0,
      max: 10,
    },
    entranceScore: {
      type: Number,
      required: [true, 'Entrance exam score is required'],
      min: 0,
      max: 100,
    },
    tenthPercentage: {
      type: Number,
      default: 0,
    },
    twelfthPercentage: {
      type: Number,
      default: 0,
    },
    previousInstitution: {
      type: String,
      trim: true,
    },
    // Personal Statement
    statement: {
      type: String,
      trim: true,
    },
    // Status management
    status: {
      type: String,
      enum: ['pending', 'under_review', 'accepted', 'rejected', 'waitlisted'],
      default: 'pending',
    },
    adminRemarks: {
      type: String,
      default: '',
    },
    // AI Analysis Results
    aiScore: {
      type: Number,
      default: null,
    },
    eligibilityResult: {
      type: String,
      enum: ['eligible', 'not_eligible', 'pending'],
      default: 'pending',
    },
    eligibilityReason: {
      type: String,
      default: '',
    },
    fraudRiskScore: {
      type: Number,
      default: null,
    },
    fraudRiskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'pending'],
      default: 'pending',
    },
    yieldPrediction: {
      type: Number,
      default: null,
    },
    aiAnalyzed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
