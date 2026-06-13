const Issue = require('../models/Issue');
const Petition = require('../models/Petition');
const Notification = require('../models/Notification');

exports.evaluateIssueForPetition = async (issueId) => {
  const issue = await Issue.findById(issueId);
  if (!issue || issue.isPetition) return;

  const totalScore = issue.upvotes + (issue.reactions.urgent * 2) + issue.reactions.support;
  const THRESHOLD = 50;

  if (totalScore >= THRESHOLD) {
    issue.isPetition = true;
    issue.petitionThresholdMet = true;
    await issue.save();

    await Petition.create({
      issue: issue._id,
      title: `Official Public Petition: ${issue.title}`,
      supporters: [issue.reportedBy]
    });

    await Notification.create({
      user: issue.reportedBy,
      title: 'Community Petition Mode Triggered!',
      message: `Your reported issue "${issue.title}" has gathered significant engagement and has been upgraded to a formal community petition.`
    });
  }
};
