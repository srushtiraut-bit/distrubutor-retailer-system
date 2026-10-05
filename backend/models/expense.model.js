const pool = require('../config/db');

const ExpenseModel = {
  async create({ distributor_id, category, amount, date, description }) {
    const [result] = await pool.query(
      `INSERT INTO EXPENSES (Distributor_ID, Category, Amount, Date, Description)
       VALUES (?, ?, ?, ?, ?)`,
      [distributor_id, category, amount, date, description]
    );
    return result.insertId;
  },

  async findByDistributor(distributor_id) {
    const [rows] = await pool.query(
      `SELECT 
         Expense_ID     AS expense_id,
         Distributor_ID AS distributor_id,
         Category       AS category,
         Amount         AS amount,
         DATE_FORMAT(Date, '%Y-%m-%d') AS date,
         Description    AS description
       FROM EXPENSES 
       WHERE Distributor_ID = ? 
       ORDER BY Date DESC`,
      [distributor_id]
    );
    return rows;
  },

  async getTotalByDistributor(distributor_id) {
    const [rows] = await pool.query(
      `SELECT COALESCE(SUM(Amount), 0) AS total_expenses
       FROM EXPENSES
       WHERE Distributor_ID = ?`,
      [distributor_id]
    );
    return rows[0].total_expenses;
  },

  async getTotalByDateRange(distributor_id, startDate, endDate) {
    const [rows] = await pool.query(
      `SELECT COALESCE(SUM(Amount), 0) AS total_expenses
       FROM EXPENSES
       WHERE Distributor_ID = ? AND Date BETWEEN ? AND ?`,
      [distributor_id, startDate, endDate]
    );
    return rows[0].total_expenses;
  },

  async deleteById(expense_id, distributor_id) {
    const [result] = await pool.query(
      'DELETE FROM EXPENSES WHERE Expense_ID = ? AND Distributor_ID = ?',
      [expense_id, distributor_id]
    );
    return result.affectedRows;
  }
};

module.exports = ExpenseModel;