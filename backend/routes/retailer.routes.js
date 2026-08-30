const express = require('express');
const router = express.Router();
const { getDashboardStats, getRecentOrders } = require('../controllers/retailer.controller');
const protect = require('../middleware/auth.middleware');

router.get('/dashboard-stats', protect, getDashboardStats);
router.get('/recent-orders', protect, getRecentOrders);

module.exports = router;