const express = require('express');
const router = express.Router();
const { getMyProfitLoss } = require('../controllers/profitLoss.controller');
const protect = require('../middleware/auth.middleware');

router.get('/', protect, getMyProfitLoss);

module.exports = router;