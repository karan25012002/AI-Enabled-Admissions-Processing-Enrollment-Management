const mongoose = require('mongoose');

const programSchema = new mongoose.Schema(
  {
    programName: {
      type: String,
      required: [true, 'Program name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
    },
    seats: {
      type: Number,
      required: [true, 'Number of seats is required'],
      min: [1, 'Seats must be at least 1'],
    },
    eligibilityCriteria: {
      type: String,
      default: '',
    },
    minGPA: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    minEntranceScore: {
      type: Number,
      default: 0,
    },
    applicationDeadline: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      enum: ['Engineering', 'Science', 'Commerce', 'Arts', 'Medicine', 'Law', 'Management', 'Education', 'Design', 'Other'],
      default: 'Other',
    },
    fees: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Program', programSchema);
