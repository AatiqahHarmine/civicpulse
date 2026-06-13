const express = require('express');
const router = express.Router();
const cronService = require('../services/cronService');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/weekly', protect, authorize('Admin'), async (req, res) => {
  try {
    const reportData = await cronService.generateWeeklySummary();
    res.status(200).json({ success: true, report: reportData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
