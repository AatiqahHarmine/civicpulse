const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const list = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { $set: { read: true } });
    res.status(200).json({ success: true, message: 'All notifications cleared.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
