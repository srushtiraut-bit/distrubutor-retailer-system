const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllDistributors } = require('../controllers/distributor.controller');
const protect = require('../middleware/auth.middleware');

router.get('/dashboard', protect, getDashboardStats);
router.get('/all', protect, getAllDistributors);

module.exports = router;