const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
  text: { type: String, required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
