const express = require('express');
const router = express.Router();
const { getProductsByDistributor } = require('../controllers/product.controller');
const protect = require('../middleware/auth.middleware');

router.get('/distributor/:distributorId', protect, getProductsByDistributor);

module.exports = router;