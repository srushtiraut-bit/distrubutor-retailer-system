const express = require('express');
const router = express.Router();
const { addExpense, getExpenses, deleteExpense } = require('../controllers/expense.controller');
const protect = require('../middleware/auth.middleware');

// Only logged-in distributors can access expense routes
const distributorOnly = (req, res, next) => {
  if (req.user.role !== 'distributor') {
    return res.status(403).json({ message: 'Access denied: distributors only' });
  }
  next();
};

router.use(protect);
router.use(distributorOnly);

router.post('/', addExpense);
router.get('/', getExpenses);
router.delete('/:id', deleteExpense);

module.exports = router;