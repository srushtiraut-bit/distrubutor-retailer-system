const pool = require('../config/db');

const OrderModel = {
  async findAllByDistributor(distributorId) {
    const [rows] = await pool.query(
      `SELECT o.Order_ID AS order_id,
              o.Retailer_ID AS retailer_id,
              r.Name AS retailer_name,
              o.Order_Date AS order_date,
              o.Total_Bill AS total_bill,
              o.Order_Status AS order_status
       FROM ORDERS o
       JOIN RETAILER r ON o.Retailer_ID = r.Retailer_ID
       WHERE o.Distributor_ID = ?
       ORDER BY o.Order_Date DESC, o.Order_ID DESC`,
      [distributorId]
    );
    return rows;
  },

  async findByIdForDistributor(orderId, distributorId) {
    const [rows] = await pool.query(
      `SELECT Order_ID AS order_id, Order_Status AS order_status
       FROM ORDERS
       WHERE Order_ID = ? AND Distributor_ID = ?`,
      [orderId, distributorId]
    );
    return rows[0];
  },

  async updateStatus(orderId, status) {
    await pool.query('UPDATE ORDERS SET Order_Status = ? WHERE Order_ID = ?', [status, orderId]);
  },
};

module.exports = OrderModel;