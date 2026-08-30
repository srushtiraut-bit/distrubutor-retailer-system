const pool = require('../config/db');

const OrderModel = {
  async findAllByDistributor(distributorId) {
    const [rows] = await pool.query(
      `SELECT o.order_id, o.retailer_id, r.name AS retailer_name,
              o.order_date, o.total_bill, o.order_status
       FROM orders o
       JOIN retailer r ON o.retailer_id = r.retailer_id
       WHERE o.distributor_id = ?
       ORDER BY o.order_date DESC`,
      [distributorId]
    );
    return rows;
  },

  async findByIdForDistributor(orderId, distributorId) {
    const [rows] = await pool.query(
      'SELECT order_id, order_status FROM orders WHERE order_id = ? AND distributor_id = ?',
      [orderId, distributorId]
    );
    return rows[0];
  },

  async updateStatus(orderId, status) {
    await pool.query('UPDATE orders SET order_status = ? WHERE order_id = ?', [status, orderId]);
  },
};

module.exports = OrderModel;