const express = require('express');
const router = express.Router();
const { getNotifications, markAllRead } = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getNotifications);
router.put('/clear', protect, markAllRead);

module.exports = router;
