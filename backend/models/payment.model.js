const pool = require('../config/db');

const PaymentModel = {
  async findAllByDistributor(distributorId) {
    const [rows] = await pool.query(
      `SELECT p.payment_id, p.order_id, p.payment_date, p.total_amount,
              p.amount_paid, p.payment_mode, p.payment_status
       FROM payment p
       JOIN orders o ON p.order_id = o.order_id
       WHERE o.distributor_id = ?
       ORDER BY p.payment_date DESC`,
      [distributorId]
    );
    return rows;
  },

  async findByOrderForDistributor(orderId, distributorId) {
    const [rows] = await pool.query(
      `SELECT p.payment_id, p.order_id, p.payment_status
       FROM payment p
       JOIN orders o ON p.order_id = o.order_id
       WHERE p.order_id = ? AND o.distributor_id = ?`,
      [orderId, distributorId]
    );
    return rows[0];
  },

  async updateStatus(paymentId, { amount_paid, payment_status, payment_mode }) {
    const [result] = await pool.query(
      `UPDATE payment SET amount_paid = ?, payment_status = ?, payment_mode = ? WHERE payment_id = ?`,
      [amount_paid, payment_status, payment_mode, paymentId]
    );
    return result.affectedRows;
  },
};

module.exports = PaymentModel;