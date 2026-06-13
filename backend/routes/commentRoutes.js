const express = require('express');
const router = express.Router();
const { addComment, getCommentsByIssue, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, addComment);
router.get('/issue/:issueId', getCommentsByIssue);
router.delete('/:id', protect, deleteComment);

module.exports = router;
