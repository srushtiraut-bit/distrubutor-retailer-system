const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllDistributors, getProfile, updateProfile, changePassword,changeEmail } = require('../controllers/distributor.controller');
const protect = require('../middleware/auth.middleware');

router.get('/dashboard', protect, getDashboardStats);
router.get('/all', protect, getAllDistributors);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/change-email', protect, changeEmail);
module.exports = router;