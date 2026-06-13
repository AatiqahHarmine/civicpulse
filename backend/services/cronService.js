const Issue = require('../models/Issue');

exports.generateWeeklySummary = async () => {
  const aWeekAgo = new Date();
  aWeekAgo.setDate(aWeekAgo.getDate() - 7);

  const reportedCount = await Issue.countDocuments({ createdAt: { $gte: aWeekAgo } });
  const resolvedCount = await Issue.countDocuments({ status: 'Resolved', updatedAt: { $gte: aWeekAgo } });

  const categorySummary = await Issue.aggregate([
    { $match: { createdAt: { $gte: aWeekAgo } } },
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);

  return {
    generatedAt: new Date(),
    summaryRange: 'Past 7 Days',
    metrics: {
      reportedCount,
      resolvedCount,
      conversionRate: reportedCount > 0 ? ((resolvedCount / reportedCount) * 100).toFixed(1) : 0
    },
    topCategories: categorySummary
  };
};
