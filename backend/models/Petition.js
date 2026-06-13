const mongoose = require('mongoose');

const petitionSchema = new mongoose.Schema({
  issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true, unique: true },
  title: { type: String, required: true },
  supporters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  supporterCount: { type: Number, default: 1 },
  threshold: { type: Number, default: 50 },
  status: { type: String, enum: ['Active', 'Closed', 'Escalated'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Petition', petitionSchema);
