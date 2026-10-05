const pool = require('../config/db');

const OrderModel = {
  async findAllByDistributor(distributorId) {
    const [rows] = await pool.query(
      `SELECT o.Order_ID, o.Retailer_ID, r.Name AS retailer_name,
              o.Order_Date, o.Total_Bill, o.Order_Status
       FROM ORDERS o
       JOIN RETAILER r ON o.Retailer_ID = r.Retailer_ID
       WHERE o.Distributor_ID = ?
       ORDER BY o.Order_Date DESC`,
      [distributorId]
    );
    return rows;
  },

  async findByIdForDistributor(orderId, distributorId) {
    const [rows] = await pool.query(
      'SELECT Order_ID, Order_Status FROM ORDERS WHERE Order_ID = ? AND Distributor_ID = ?',
      [orderId, distributorId]
    );
    return rows[0];
  },

  async updateStatus(orderId, status) {
    await pool.query('UPDATE ORDERS SET Order_Status = ? WHERE Order_ID = ?', [status, orderId]);
  },
};

module.exports = OrderModel;