const pool = require('../config/db');
const PaymentModel = require('../models/payment.model');

// RETAILER: record a payment for an order
exports.recordPayment = async (req, res) => {
  const { orderId, amountPaid, paymentMode } = req.body;

  if (!orderId || !amountPaid || !paymentMode) {
    return res.status(400).json({ message: 'Order ID, amount, and payment mode are required' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [orderRows] = await connection.query(
      `SELECT Total_Bill FROM ORDERS WHERE Order_ID = ?`,
      [orderId]
    );

    if (orderRows.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ message: 'Order not found' });
    }

    const totalBill = orderRows[0].Total_Bill;
    const paymentStatus = amountPaid >= totalBill ? 'Paid' : 'Partial';

    await connection.query(
      `INSERT INTO PAYMENT (Order_ID, Payment_Date, Total_Amount, Amount_Paid, Payment_Mode, Payment_Status)
       VALUES (?, CURDATE(), ?, ?, ?, ?)`,
      [orderId, totalBill, amountPaid, paymentMode, paymentStatus]
    );

    if (paymentStatus === 'Paid') {
      await connection.query(
        `UPDATE ORDERS SET Order_Status = 'Completed' WHERE Order_ID = ?`,
        [orderId]
      );
    }

    await connection.commit();
    connection.release();

    res.status(201).json({ message: 'Payment recorded successfully', paymentStatus });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error('Record payment error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DISTRIBUTOR: list payments for orders placed with this distributor
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await PaymentModel.findAllByDistributor(req.user.id);
    res.status(200).json(payments);
  } catch (err) {
    console.error('Get payments error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DISTRIBUTOR: update payment for an order
exports.updatePayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { amount_paid, payment_status, payment_mode } = req.body;

    const payment = await PaymentModel.findByOrderForDistributor(orderId, req.user.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    await PaymentModel.updateStatus(payment.Payment_ID, { amount_paid, payment_status, payment_mode });

    res.status(200).json({ message: 'Payment updated' });
  } catch (err) {
    console.error('Update payment error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};