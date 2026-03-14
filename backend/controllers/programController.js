const Program = require('../models/Program');

// @desc  Create program (admin)
// @route POST /api/programs
const createProgram = async (req, res) => {
  try {
    const { programName, description, duration, seats, eligibilityCriteria, minGPA, minEntranceScore, applicationDeadline, category, fees } = req.body;
    const exists = await Program.findOne({ programName });
    if (exists) return res.status(400).json({ success: false, message: 'Program already exists' });

    const program = await Program.create({
      programName, description, duration, seats, eligibilityCriteria, minGPA, minEntranceScore,
      applicationDeadline, category, fees, createdBy: req.user._id || null
    });
    res.status(201).json({ success: true, message: 'Program created', program });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get all active programs (public)
// @route GET /api/programs
const getPrograms = async (req, res) => {
  try {
    const filter = req.user?.role === 'admin' ? {} : { isActive: true };
    const programs = await Program.find(filter).sort('-createdAt');
    res.json({ success: true, count: programs.length, programs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get single program
// @route GET /api/programs/:id
const getProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, program });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Update program (admin)
// @route PUT /api/programs/:id
const updateProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, message: 'Program updated', program });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Delete program (admin)
// @route DELETE /api/programs/:id
const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, message: 'Program deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createProgram, getPrograms, getProgram, updateProgram, deleteProgram };
