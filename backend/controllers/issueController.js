const Issue = require('../models/Issue');
const Notification = require('../models/Notification');
const aiService = require('../services/aiService');
const duplicateService = require('../services/duplicateService');

exports.createIssue = async (req, res) => {
  try {
    const { title, description, category, location, latitude, longitude, image } = req.body;

    const isDuplicate = await duplicateService.checkDuplicate(latitude, longitude, category);
    if (isDuplicate) {
      return res.status(400).json({ success: false, duplicate: true, message: 'Duplicate detected nearby for this specific category.' });
    }

    const aiAnalysis = await aiService.analyzeIssue(title, description, image);

    const issue = await Issue.create({
      title, description, category, location,
      latitude: latitude || 0,
      longitude: longitude || 0,
      image: image || '',
      severity: aiAnalysis.severity,
      severityScore: aiAnalysis.score,
      reportedBy: req.user._id
    });

    res.status(201).json({ success: true, data: issue });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getIssues = async (req, res) => {
  try {
    const { category, status, search, sort } = req.query;
    let findQuery = {};

    if (category) findQuery.category = category;
    if (status) findQuery.status = status;
    if (search) findQuery.title = { $regex: search, $options: 'i' };

    let sortingOrder = { createdAt: -1 };
    if (sort === 'upvotes') sortingOrder = { upvotes: -1 };
    if (sort === 'severity') sortingOrder = { severityScore: -1 };

    const list = await Issue.find(findQuery).populate('reportedBy', 'name email').sort(sortingOrder);
    res.status(200).json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate('reportedBy', 'name email');
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found.' });
    res.status(200).json({ success: true, data: issue });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateIssue = async (req, res) => {
  try {
    let issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found.' });

    const editableFields = ['status', 'assignedTo', 'adminRemarks', 'severity'];
    editableFields.forEach(field => {
      if (req.body[field] !== undefined) issue[field] = req.body[field];
    });

    await issue.save();

    await Notification.create({
      user: issue.reportedBy,
      title: 'Issue Status Change Update',
      message: `The ticket status for "${issue.title}" has changed to: ${issue.status}.`
    });

    res.status(200).json({ success: true, data: issue });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found.' });

    if (req.user.role !== 'Admin' && issue.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Action unauthorized.' });
    }

    await issue.deleteOne();
    res.status(200).json({ success: true, message: 'Issue deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.handleReaction = async (req, res) => {
  try {
    const { type } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found.' });

    if (type === 'upvote') {
      issue.upvotes += 1;
    } else if (issue.reactions[type] !== undefined) {
      issue.reactions[type] += 1;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid reaction type.' });
    }

    await issue.save();

    const petitionEngine = require('../services/petitionEngine');
    await petitionEngine.evaluateIssueForPetition(issue._id);

    res.status(200).json({ success: true, data: issue });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.bulkUpdateIssues = async (req, res) => {
  try {
    const { ids, status, assignedTo } = req.body;
    const patchPayload = {};
    if (status) patchPayload.status = status;
    if (assignedTo) patchPayload.assignedTo = assignedTo;

    await Issue.updateMany({ _id: { $in: ids } }, { $set: patchPayload });
    res.status(200).json({ success: true, message: 'Bulk operations processed.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
