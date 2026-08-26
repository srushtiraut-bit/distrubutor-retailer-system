const express = require('express');
const router = express.Router();
const { getAllDistributors } = require('../controllers/distributor.controller');

router.get('/', getAllDistributors);

module.exports = router;