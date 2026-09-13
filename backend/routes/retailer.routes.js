const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getRecentOrders, 
  getAllOrders, 
  getAllPayments,
  placeOrder,
  getProfile,
  updateProfile,
  changePassword,
  changeEmail
} = require('../controllers/retailer.controller');
const protect = require('../middleware/auth.middleware');

router.get('/dashboard-stats', protect, getDashboardStats);
router.get('/recent-orders', protect, getRecentOrders);
router.get('/orders', protect, getAllOrders);
router.get('/payments', protect, getAllPayments);
router.post('/place-order', protect, placeOrder);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/change-email', protect, changeEmail);

module.exports = router;