const Issue = require('../models/Issue');

exports.getDashboardMetrics = async (req, res) => {
  try {
    const total = await Issue.countDocuments();
    const pending = await Issue.countDocuments({ status: 'Pending' });
    const inProgress = await Issue.countDocuments({ status: 'In Progress' });
    const resolved = await Issue.countDocuments({ status: 'Resolved' });

    const distribution = await Issue.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      kpis: { total, pending, inProgress, resolved },
      categories: distribution
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMapCoordinates = async (req, res) => {
  try {
    const data = await Issue.find().select('title category latitude longitude location status severity severityScore');
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
