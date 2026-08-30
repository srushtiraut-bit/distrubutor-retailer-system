const express = require('express');
const router = express.Router();
const { getMyPayments, updatePayment } = require('../controllers/payment.controller');
const protect = require('../middleware/auth.middleware');

router.get('/', protect, getMyPayments);
router.put('/:orderId', protect, updatePayment);

module.exports = router;