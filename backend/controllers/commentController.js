const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      user: req.user._id,
      issue: req.body.issueId,
      text: req.body.text
    });
    const result = await comment.populate('user', 'name');
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getCommentsByIssue = async (req, res) => {
  try {
    const data = await Comment.find({ issue: req.params.issueId }).populate('user', 'name').sort({ createdAt: 1 });
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found.' });

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    await comment.deleteOne();
    res.status(200).json({ success: true, message: 'Comment deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
