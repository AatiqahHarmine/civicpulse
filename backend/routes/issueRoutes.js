const express = require('express');
const router = express.Router();
const { createIssue, getIssues, getIssueById, updateIssue, deleteIssue, handleReaction, bulkUpdateIssues } = require('../controllers/issueController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/').post(protect, createIssue).get(getIssues);
router.route('/bulk').put(protect, authorize('Admin'), bulkUpdateIssues);
router.route('/:id').get(getIssueById).put(protect, updateIssue).delete(protect, deleteIssue);
router.route('/:id/react').post(protect, handleReaction);

module.exports = router;
