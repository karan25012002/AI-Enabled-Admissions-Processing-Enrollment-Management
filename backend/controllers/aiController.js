const gemini = require('../utils/gemini');
const Application = require('../models/Application');
const Program = require('../models/Program');

// @desc  Chat with AI assistant
// @route POST /api/ai/chat
const chatbot = async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required' });

    // Fetch real-time data to give the chatbot context
    const programs = await Program.find().select('programName category duration seats minGPA minEntranceScore');
    let contextData = "Currently Available Programs in the System:\n";
    if (programs.length === 0) {
      contextData += "No programs currently available.\n";
    } else {
      programs.forEach(p => {
        contextData += `* ${p.programName} (${p.category}): ${p.duration}, ${p.seats} seats. Requirements: Min GPA ${p.minGPA || 'None'}, Min Entrance Score ${p.minEntranceScore || 'None'}.\n`;
      });
    }

    const response = await gemini.chat(message, history || [], contextData);
    res.json({ success: true, response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get AI screening results for all applications (admin)
// @route GET /api/ai/screening
const getScreeningResults = async (req, res) => {
  try {
    const applications = await Application.find({ aiAnalyzed: true })
      .populate('userId', 'name email')
      .populate('programId', 'programName')
      .sort('-aiScore');
    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get fraud detection report (admin)
// @route GET /api/ai/fraud-report
const getFraudReport = async (req, res) => {
  try {
    const applications = await Application.find({ aiAnalyzed: true })
      .populate('userId', 'name email')
      .populate('programId', 'programName')
      .sort('-fraudRiskScore');
    const flagged = applications.filter(a => a.fraudRiskLevel === 'medium' || a.fraudRiskLevel === 'high');
    res.json({ success: true, total: applications.length, flaggedCount: flagged.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Re-run AI analysis on an application (admin)
// @route POST /api/ai/analyze/:applicationId
const analyzeApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.applicationId).populate('programId');
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });

    const programName = app.programId?.programName || 'Unknown';
    const minGPA = app.programId?.minGPA || 0;
    const minEntranceScore = app.programId?.minEntranceScore || 0;
    const eligibilityCriteria = app.programId?.eligibilityCriteria || '';

    const [eligibility, scoring, fraud] = await Promise.all([
      gemini.checkEligibility({ gpa: app.gpa, entranceScore: app.entranceScore, programName, minGPA, minEntranceScore, eligibilityCriteria }),
      gemini.scoreCandidate({ gpa: app.gpa, entranceScore: app.entranceScore, tenthPercentage: app.tenthPercentage || 0, twelfthPercentage: app.twelfthPercentage || 0, programName, statement: app.statement }),
      gemini.detectFraud({ gpa: app.gpa, entranceScore: app.entranceScore, tenthPercentage: app.tenthPercentage || 0, twelfthPercentage: app.twelfthPercentage || 0, previousInstitution: app.previousInstitution, programName }),
    ]);

    const yieldData = await gemini.predictYield({ gpa: app.gpa, entranceScore: app.entranceScore, programName, aiScore: scoring.score });

    const updated = await Application.findByIdAndUpdate(app._id, {
      eligibilityResult: eligibility.eligible ? 'eligible' : 'not_eligible',
      eligibilityReason: eligibility.reason,
      aiScore: scoring.score,
      fraudRiskScore: fraud.riskScore,
      fraudRiskLevel: fraud.riskLevel,
      yieldPrediction: yieldData.yieldProbability,
      aiAnalyzed: true,
    }, { new: true }).populate('userId', 'name email').populate('programId', 'programName');

    res.json({ success: true, message: 'AI analysis complete', application: updated, details: { eligibility, scoring, fraud, yield: yieldData } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { chatbot, getScreeningResults, getFraudReport, analyzeApplication };
