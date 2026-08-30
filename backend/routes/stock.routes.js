const express = require('express');
const router = express.Router();
const { getMyStock, addStock, updateStock, deleteStock } = require('../controllers/stock.controller');
const protect = require('../middleware/auth.middleware');

router.get('/', protect, getMyStock);
router.post('/', protect, addStock);
router.put('/:id', protect, updateStock);
router.delete('/:id', protect, deleteStock);

module.exports = router;