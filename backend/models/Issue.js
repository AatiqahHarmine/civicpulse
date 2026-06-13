const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['Pothole', 'Garbage', 'Water', 'Light', 'Other'] },
  location: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  image: { type: String, default: '' },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  severityScore: { type: Number, default: 5.0 },
  status: { type: String, enum: ['Pending', 'In Review', 'In Progress', 'Resolved', 'Rejected'], default: 'Pending' },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  upvotes: { type: Number, default: 0 },
  reactions: {
    urgent: { type: Number, default: 0 },
    support: { type: Number, default: 0 },
    agree: { type: Number, default: 0 }
  },
  assignedTo: { type: String, default: '' },
  adminRemarks: { type: String, default: '' },
  isPetition: { type: Boolean, default: false },
  petitionThresholdMet: { type: Boolean, default: false }
}, { timestamps: true });

issueSchema.index({ latitude: 1, longitude: 1 });

module.exports = mongoose.model('Issue', issueSchema);
