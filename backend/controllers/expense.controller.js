const ExpenseModel = require('../models/expense.model');

// ------------------- ADD EXPENSE -------------------
exports.addExpense = async (req, res) => {
  try {
    const distributor_id = req.user.id; // from auth middleware (decoded JWT)
    const { category, amount, date, description } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({ message: 'Category, amount and date are required' });
    }

    const id = await ExpenseModel.create({
      distributor_id,
      category,
      amount,
      date,
      description
    });

    res.status(201).json({ message: 'Expense added successfully', id });
  } catch (err) {
    console.error('Add expense error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ------------------- GET ALL EXPENSES FOR LOGGED-IN DISTRIBUTOR -------------------
exports.getExpenses = async (req, res) => {
  try {
    const distributor_id = req.user.id;
    const expenses = await ExpenseModel.findByDistributor(distributor_id);
    res.status(200).json(expenses);
  } catch (err) {
    console.error('Get expenses error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ------------------- DELETE EXPENSE -------------------
exports.deleteExpense = async (req, res) => {
  try {
    const distributor_id = req.user.id;
    const { id } = req.params;

    const affectedRows = await ExpenseModel.deleteById(id, distributor_id);

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('Delete expense error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};