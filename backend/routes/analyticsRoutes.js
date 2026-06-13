const express = require('express');
const router = express.Router();
const { getDashboardMetrics, getMapCoordinates } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/kpis', protect, authorize('Admin'), getDashboardMetrics);
router.get('/heatmap', getMapCoordinates);

module.exports = router;
