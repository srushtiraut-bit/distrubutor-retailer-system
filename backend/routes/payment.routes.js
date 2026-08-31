const express = require('express');
const router = express.Router();
const { recordPayment, getPaymentsByRetailer } = require('../controllers/payment.controller');
const protect = require('../middleware/auth.middleware');

router.post('/', protect, recordPayment);
router.get('/my-payments', protect, getPaymentsByRetailer);

module.exports = router;