const express = require('express');
const router = express.Router();
const { getProfileSummary } = require('../controllers/profileController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getProfileSummary);

module.exports = router;
