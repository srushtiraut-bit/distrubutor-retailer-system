const express = require('express');
const router = express.Router();
const { getMyOrders, getOrderItems, updateOrderStatus } = require('../controllers/order.controller');
const protect = require('../middleware/auth.middleware');

router.get('/', protect, getMyOrders);
router.get('/:id/items', protect, getOrderItems);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;