const pool = require('../config/db');

const ProfitLossModel = {
  async findAllByDistributor(distributorId) {
    const [rows] = await pool.query(
      `SELECT pl.PL_ID, pl.Order_ID, pl.Date, pl.Total_Cost_Price,
              pl.Total_Selling_Price, pl.Profit_or_Loss, pl.Percentage
       FROM PROFIT_LOSS pl
       JOIN ORDERS o ON pl.Order_ID = o.Order_ID
       WHERE o.Distributor_ID = ?
       ORDER BY pl.Date DESC`,
      [distributorId]
    );
    return rows;
  },

  async findByDistributorAndDateRange(distributorId, startDate, endDate) {
    const [rows] = await pool.query(
      `SELECT pl.PL_ID, pl.Order_ID, pl.Date, pl.Total_Cost_Price,
              pl.Total_Selling_Price, pl.Profit_or_Loss, pl.Percentage
       FROM PROFIT_LOSS pl
       JOIN ORDERS o ON pl.Order_ID = o.Order_ID
       WHERE o.Distributor_ID = ? AND pl.Date BETWEEN ? AND ?
       ORDER BY pl.Date DESC`,
      [distributorId, startDate, endDate]
    );
    return rows;
  },

  async getSummaryByDistributor(distributorId) {
    const [[summary]] = await pool.query(
      `SELECT
         SUM(pl.Total_Cost_Price) AS totalCost,
         SUM(pl.Total_Selling_Price) AS totalRevenue,
         SUM(pl.Total_Selling_Price - pl.Total_Cost_Price) AS totalProfit,
         AVG(pl.Percentage) AS avgMargin
       FROM PROFIT_LOSS pl
       JOIN ORDERS o ON pl.Order_ID = o.Order_ID
       WHERE o.Distributor_ID = ?`,
      [distributorId]
    );
    return summary;
  },

  async getSummaryByDistributorAndDateRange(distributorId, startDate, endDate) {
    const [[summary]] = await pool.query(
      `SELECT
         SUM(pl.Total_Cost_Price) AS totalCost,
         SUM(pl.Total_Selling_Price) AS totalRevenue,
         SUM(pl.Total_Selling_Price - pl.Total_Cost_Price) AS totalProfit,
         AVG(pl.Percentage) AS avgMargin
       FROM PROFIT_LOSS pl
       JOIN ORDERS o ON pl.Order_ID = o.Order_ID
       WHERE o.Distributor_ID = ? AND pl.Date BETWEEN ? AND ?`,
      [distributorId, startDate, endDate]
    );
    return summary;
  },
};

module.exports = ProfitLossModel;