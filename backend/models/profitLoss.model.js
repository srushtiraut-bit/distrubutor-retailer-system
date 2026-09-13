const pool = require('../config/db');

const ProfitLossModel = {
  async findAllByDistributor(distributorId) {
    const [rows] = await pool.query(
      `SELECT pl.pl_id, pl.order_id, pl.date, pl.total_cost_price,
              pl.total_selling_price, pl.profit_or_loss, pl.percentage
       FROM profit_loss pl
       JOIN orders o ON pl.order_id = o.order_id
       WHERE o.distributor_id = ?
       ORDER BY pl.date DESC`,
      [distributorId]
    );
    return rows;
  },

  async findByDistributorAndDateRange(distributorId, startDate, endDate) {
    const [rows] = await pool.query(
      `SELECT pl.pl_id, pl.order_id, pl.date, pl.total_cost_price,
              pl.total_selling_price, pl.profit_or_loss, pl.percentage
       FROM profit_loss pl
       JOIN orders o ON pl.order_id = o.order_id
       WHERE o.distributor_id = ? AND pl.date BETWEEN ? AND ?
       ORDER BY pl.date DESC`,
      [distributorId, startDate, endDate]
    );
    return rows;
  },

  async getSummaryByDistributor(distributorId) {
    const [[summary]] = await pool.query(
      `SELECT
         SUM(pl.total_cost_price) AS totalCost,
         SUM(pl.total_selling_price) AS totalRevenue,
         SUM(pl.total_selling_price - pl.total_cost_price) AS totalProfit,
         AVG(pl.percentage) AS avgMargin
       FROM profit_loss pl
       JOIN orders o ON pl.order_id = o.order_id
       WHERE o.distributor_id = ?`,
      [distributorId]
    );
    return summary;
  },

  async getSummaryByDistributorAndDateRange(distributorId, startDate, endDate) {
    const [[summary]] = await pool.query(
      `SELECT
         SUM(pl.total_cost_price) AS totalCost,
         SUM(pl.total_selling_price) AS totalRevenue,
         SUM(pl.total_selling_price - pl.total_cost_price) AS totalProfit,
         AVG(pl.percentage) AS avgMargin
       FROM profit_loss pl
       JOIN orders o ON pl.order_id = o.order_id
       WHERE o.distributor_id = ? AND pl.date BETWEEN ? AND ?`,
      [distributorId, startDate, endDate]
    );
    return summary;
  },
};

module.exports = ProfitLossModel;