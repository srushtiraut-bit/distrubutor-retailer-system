const express = require('express');
const router = express.Router();
const { recordPayment, getMyPayments, updatePayment } = require('../controllers/payment.controller');
const protect = require('../middleware/auth.middleware');

router.post('/', protect, recordPayment);
router.get('/my-payments', protect, getMyPayments);
router.put('/:orderId', protect, updatePayment);

module.exports = router;