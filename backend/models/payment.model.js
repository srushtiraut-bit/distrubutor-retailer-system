const pool = require('../config/db');

const PaymentModel = {
  async findAllByDistributor(distributorId) {
    const [rows] = await pool.query(
      `SELECT p.Payment_ID AS payment_id,
              p.Order_ID AS order_id,
              p.Payment_Date AS payment_date,
              p.Total_Amount AS total_amount,
              p.Amount_Paid AS amount_paid,
              p.Payment_Mode AS payment_mode,
              p.Payment_Status AS payment_status
       FROM PAYMENT p
       JOIN ORDERS o ON p.Order_ID = o.Order_ID
       WHERE o.Distributor_ID = ?
       ORDER BY p.Payment_Date DESC`,
      [distributorId]
    );
    return rows;
  },

  async findByOrderForDistributor(orderId, distributorId) {
    const [rows] = await pool.query(
      `SELECT p.Payment_ID, p.Order_ID, p.Payment_Status
       FROM PAYMENT p
       JOIN ORDERS o ON p.Order_ID = o.Order_ID
       WHERE p.Order_ID = ? AND o.Distributor_ID = ?`,
      [orderId, distributorId]
    );
    return rows[0];
  },

  async updateStatus(paymentId, { amount_paid, payment_status, payment_mode }) {
    const [result] = await pool.query(
      `UPDATE PAYMENT SET Amount_Paid = ?, Payment_Status = ?, Payment_Mode = ? WHERE Payment_ID = ?`,
      [amount_paid, payment_status, payment_mode, paymentId]
    );
    return result.affectedRows;
  },
};

module.exports = PaymentModel;