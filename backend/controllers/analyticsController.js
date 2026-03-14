const User = require('../models/User');
const Application = require('../models/Application');
const Program = require('../models/Program');
const Document = require('../models/Document');

// @desc  Admin dashboard statistics
// @route GET /api/analytics/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalApplications, totalPrograms, accepted, rejected, pending, underReview, totalDocuments, verifiedDocs, pendingDocs] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Application.countDocuments(),
      Program.countDocuments({ isActive: true }),
      Application.countDocuments({ status: 'accepted' }),
      Application.countDocuments({ status: 'rejected' }),
      Application.countDocuments({ status: 'pending' }),
      Application.countDocuments({ status: 'under_review' }),
      Document.countDocuments(),
      Document.countDocuments({ verificationStatus: 'verified' }),
      Document.countDocuments({ verificationStatus: 'pending' }),
    ]);

    const highFraud = await Application.countDocuments({ fraudRiskLevel: 'high' });
    const medFraud = await Application.countDocuments({ fraudRiskLevel: 'medium' });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalApplications,
        totalPrograms,
        applicationsByStatus: { accepted, rejected, pending, underReview },
        documents: { total: totalDocuments, verified: verifiedDocs, pending: pendingDocs },
        fraud: { high: highFraud, medium: medFraud },
        acceptanceRate: totalApplications > 0 ? Math.round((accepted / totalApplications) * 100) : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Program-wise application breakdown
// @route GET /api/analytics/programs
const getProgramAnalytics = async (req, res) => {
  try {
    const programs = await Program.find({ isActive: true });
    const data = await Promise.all(
      programs.map(async (prog) => {
        const total = await Application.countDocuments({ programId: prog._id });
        const accepted = await Application.countDocuments({ programId: prog._id, status: 'accepted' });
        const avgScore = await Application.aggregate([
          { $match: { programId: prog._id, aiScore: { $ne: null } } },
          { $group: { _id: null, avg: { $avg: '$aiScore' } } },
        ]);
        return {
          programName: prog.programName,
          totalApplications: total,
          accepted,
          seats: prog.seats,
          avgAiScore: avgScore[0]?.avg ? Math.round(avgScore[0].avg) : 0,
          fillRate: prog.seats > 0 ? Math.round((accepted / prog.seats) * 100) : 0,
        };
      })
    );
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Monthly applications trend
// @route GET /api/analytics/trend
const getApplicationTrend = async (req, res) => {
  try {
    const trend = await Application.aggregate([
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = trend.map(t => ({
      month: months[t._id.month - 1],
      year: t._id.year,
      applications: t.count,
    }));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get all users (admin)
// @route GET /api/analytics/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort('-createdAt');
    const usersWithApps = await Promise.all(
      users.map(async (u) => {
        const appCount = await Application.countDocuments({ userId: u._id });
        return { ...u.toObject(), applicationCount: appCount };
      })
    );
    res.json({ success: true, count: users.length, users: usersWithApps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats, getProgramAnalytics, getApplicationTrend, getAllUsers };
