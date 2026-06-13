const Issue = require('../models/Issue');

exports.getProfileSummary = async (req, res) => {
  try {
    const totalReports = await Issue.countDocuments({ reportedBy: req.user._id });
    const resolved = await Issue.countDocuments({ reportedBy: req.user._id, status: 'Resolved' });
    const pending = await Issue.countDocuments({ reportedBy: req.user._id, status: 'Pending' });

    let badges = ['Active Citizen'];
    if (totalReports >= 5) badges.push('Local Guardian');
    if (resolved >= 3) badges.push('Impact Maker');

    res.status(200).json({
      success: true,
      profile: {
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        badges,
        metrics: { totalReports, resolved, pending }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
