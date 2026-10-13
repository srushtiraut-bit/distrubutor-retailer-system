const pool = require('../config/db');

const COLUMNS = `pl.PL_ID AS pl_id,
              pl.Order_ID AS order_id,
              DATE_FORMAT(pl.Date, '%Y-%m-%d') AS date,
              pl.Total_Cost_Price AS total_cost_price,
              pl.Total_Selling_Price AS total_selling_price,
              pl.Profit_or_Loss AS profit_or_loss,
              pl.Percentage AS percentage`;

const SUMMARY = `COALESCE(SUM(pl.Total_Cost_Price), 0) AS totalCost,
         COALESCE(SUM(pl.Total_Selling_Price), 0) AS totalRevenue,
         COALESCE(SUM(pl.Total_Selling_Price - pl.Total_Cost_Price), 0) AS totalProfit,
         COALESCE(AVG(pl.Percentage), 0) AS avgMargin`;

const ProfitLossModel = {
  async findAllByDistributor(distributorId) {
    const [rows] = await pool.query(
      `SELECT ${COLUMNS}
       FROM PROFIT_LOSS pl
       JOIN ORDERS o ON pl.Order_ID = o.Order_ID
       WHERE o.Distributor_ID = ?
       ORDER BY pl.Date DESC, pl.PL_ID DESC`,
      [distributorId]
    );
    return rows;
  },

  async findByDistributorAndDateRange(distributorId, startDate, endDate) {
    const [rows] = await pool.query(
      `SELECT ${COLUMNS}
       FROM PROFIT_LOSS pl
       JOIN ORDERS o ON pl.Order_ID = o.Order_ID
       WHERE o.Distributor_ID = ? AND pl.Date BETWEEN ? AND ?
       ORDER BY pl.Date DESC, pl.PL_ID DESC`,
      [distributorId, startDate, endDate]
    );
    return rows;
  },

  async getSummaryByDistributor(distributorId) {
    const [[summary]] = await pool.query(
      `SELECT ${SUMMARY}
       FROM PROFIT_LOSS pl
       JOIN ORDERS o ON pl.Order_ID = o.Order_ID
       WHERE o.Distributor_ID = ?`,
      [distributorId]
    );
    return summary;
  },

  async getSummaryByDistributorAndDateRange(distributorId, startDate, endDate) {
    const [[summary]] = await pool.query(
      `SELECT ${SUMMARY}
       FROM PROFIT_LOSS pl
       JOIN ORDERS o ON pl.Order_ID = o.Order_ID
       WHERE o.Distributor_ID = ? AND pl.Date BETWEEN ? AND ?`,
      [distributorId, startDate, endDate]
    );
    return summary;
  },
};

module.exports = ProfitLossModel;