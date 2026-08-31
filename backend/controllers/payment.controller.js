const pool = require('../config/db');

exports.recordPayment = async (req, res) => {
  const { orderId, amountPaid, paymentMode } = req.body;

  if (!orderId || !amountPaid || !paymentMode) {
    return res.status(400).json({ message: 'Order ID, amount, and payment mode are required' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Get the order total to determine payment status
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

    // Insert payment record
    await connection.query(
      `INSERT INTO PAYMENT (Order_ID, Payment_Date, Total_Amount, Amount_Paid, Payment_Mode, Payment_Status)
       VALUES (?, CURDATE(), ?, ?, ?, ?)`,
      [orderId, totalBill, amountPaid, paymentMode, paymentStatus]
    );

    // If fully paid, mark order as Completed
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

exports.getPaymentsByRetailer = async (req, res) => {
  try {
    const retailerId = req.user.id;

    const [rows] = await pool.query(
      `SELECT P.Payment_ID, P.Order_ID, P.Payment_Date, P.Total_Amount,
              P.Amount_Paid, P.Payment_Mode, P.Payment_Status
       FROM PAYMENT P
       JOIN ORDERS O ON P.Order_ID = O.Order_ID
       WHERE O.Retailer_ID = ?
       ORDER BY P.Payment_Date DESC`,
      [retailerId]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error('Get payments error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};