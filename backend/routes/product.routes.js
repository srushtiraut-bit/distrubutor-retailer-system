const express = require('express');
const router = express.Router();
const { getMyProducts, addProduct, updateProduct, deleteProduct, getProductsByDistributor } = require('../controllers/product.controller');
const protect = require('../middleware/auth.middleware');

router.get('/', protect, getMyProducts);
router.post('/', protect, addProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.get('/distributor/:distributorId', protect, getProductsByDistributor);

module.exports = router;