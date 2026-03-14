const Application = require('../models/Application');
const Program = require('../models/Program');
const Notification = require('../models/Notification');
const gemini = require('../utils/gemini');

// @desc  Submit application
// @route POST /api/applications
const submitApplication = async (req, res) => {
  try {
    const {
      programId,
      email, whatsappNumber, fatherName, motherName, dob, gender, address, city, state, pincode,
      gpa, entranceScore, tenthPercentage, twelfthPercentage, previousInstitution, statement
    } = req.body;

    // Check if user already applied to this program
    const existing = await Application.findOne({ userId: req.user._id, programId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied to this program' });
    }

    const program = await Program.findById(programId);
    if (!program || !program.isActive) {
      return res.status(404).json({ success: false, message: 'Program not found or inactive' });
    }

    const application = await Application.create({
      userId: req.user._id,
      programId,
      email,
      whatsappNumber,
      fatherName,
      motherName,
      dob,
      gender,
      address,
      city,
      state,
      pincode,
      gpa,
      entranceScore,
      tenthPercentage,
      twelfthPercentage,
      previousInstitution,
      statement,
    });

    // Run AI analysis in background
    runAIAnalysis(application._id, { gpa, entranceScore, tenthPercentage, twelfthPercentage, previousInstitution, statement, program });

    // Notify user
    await Notification.create({
      userId: req.user._id,
      title: 'Application Submitted',
      message: `Your application for ${program.programName} has been submitted successfully.`,
      type: 'application',
      relatedId: application._id,
      relatedModel: 'Application',
    });

    res.status(201).json({ success: true, message: 'Application submitted successfully', application });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Background AI analysis
const runAIAnalysis = async (appId, data) => {
  try {
    const app = await Application.findById(appId).populate('programId');
    if (!app) return;
    const programName = app.programId?.programName || 'Unknown Program';
    const minGPA = app.programId?.minGPA || 0;
    const minEntranceScore = app.programId?.minEntranceScore || 0;
    const eligibilityCriteria = app.programId?.eligibilityCriteria || '';

    const [eligibility, scoring, fraud, ] = await Promise.all([
      gemini.checkEligibility({ gpa: data.gpa, entranceScore: data.entranceScore, programName, minGPA, minEntranceScore, eligibilityCriteria }),
      gemini.scoreCandidate({ gpa: data.gpa, entranceScore: data.entranceScore, tenthPercentage: data.tenthPercentage || 0, twelfthPercentage: data.twelfthPercentage || 0, programName, statement: data.statement }),
      gemini.detectFraud({ gpa: data.gpa, entranceScore: data.entranceScore, tenthPercentage: data.tenthPercentage || 0, twelfthPercentage: data.twelfthPercentage || 0, previousInstitution: data.previousInstitution, programName }),
    ]);

    const aiScore = scoring.score || 0;
    const yieldData = await gemini.predictYield({ gpa: data.gpa, entranceScore: data.entranceScore, programName, aiScore });

    await Application.findByIdAndUpdate(appId, {
      eligibilityResult: eligibility.eligible ? 'eligible' : 'not_eligible',
      eligibilityReason: eligibility.reason,
      aiScore: aiScore,
      fraudRiskScore: fraud.riskScore,
      fraudRiskLevel: fraud.riskLevel,
      yieldPrediction: yieldData.yieldProbability,
      aiAnalyzed: true,
    });
  } catch (err) {
    console.error('AI Analysis background error:', err.message);
  }
};

// @desc  Get logged-in user's applications
// @route GET /api/applications/my
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate('programId', 'programName description duration')
      .sort('-createdAt');
    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get all applications (admin)
// @route GET /api/applications
const getAllApplications = async (req, res) => {
  try {
    const { status, programId, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (programId) filter.programId = programId;

    let applications = await Application.find(filter)
      .populate('userId', 'name email mobile')
      .populate('programId', 'programName')
      .sort('-createdAt');

    if (search) {
      const s = search.toLowerCase();
      applications = applications.filter(a =>
        a.userId?.name?.toLowerCase().includes(s) ||
        a.userId?.email?.toLowerCase().includes(s)
      );
    }
    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get single application
// @route GET /api/applications/:id
const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('userId', 'name email mobile dob address')
      .populate('programId');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    if (req.user.role !== 'admin' && application.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Update application status (admin)
// @route PUT /api/applications/:id/status
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, adminRemarks },
      { new: true }
    ).populate('userId', 'name').populate('programId', 'programName');

    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    // Send notification to user
    const statusMessages = {
      accepted: `Congratulations! Your application for ${application.programId.programName} has been ACCEPTED!`,
      rejected: `Your application for ${application.programId.programName} has been reviewed and was not selected at this time.`,
      under_review: `Your application for ${application.programId.programName} is now under review.`,
      waitlisted: `Your application for ${application.programId.programName} has been waitlisted.`,
    };
    if (statusMessages[status]) {
      await Notification.create({
        userId: application.userId._id,
        title: `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: statusMessages[status],
        type: status === 'accepted' ? 'success' : status === 'rejected' ? 'error' : 'info',
        relatedId: application._id,
        relatedModel: 'Application',
      });
    }
    res.json({ success: true, message: 'Status updated', application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { submitApplication, getMyApplications, getAllApplications, getApplication, updateApplicationStatus };
