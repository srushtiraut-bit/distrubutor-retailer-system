const pool = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const retailerId = req.user.id; // comes from JWT via auth middleware

    const [orderStats] = await pool.query(
      `SELECT 
         COUNT(*) AS total_orders,
         SUM(CASE WHEN Order_Status = 'Pending' THEN 1 ELSE 0 END) AS pending_orders,
         SUM(Total_Bill) AS total_spent
       FROM ORDERS
       WHERE Retailer_ID = ?`,
      [retailerId]
    );

    const [paymentStats] = await pool.query(
      `SELECT SUM(P.Total_Amount - P.Amount_Paid) AS amount_due
       FROM PAYMENT P
       JOIN ORDERS O ON P.Order_ID = O.Order_ID
       WHERE O.Retailer_ID = ?`,
      [retailerId]
    );

    res.status(200).json({
      totalOrders: orderStats[0].total_orders || 0,
      pendingOrders: orderStats[0].pending_orders || 0,
      totalSpent: orderStats[0].total_spent || 0,
      amountDue: paymentStats[0].amount_due || 0
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getRecentOrders = async (req, res) => {
  try {
    const retailerId = req.user.id;

    const [orders] = await pool.query(
      `SELECT O.Order_ID, O.Order_Date, O.Total_Bill, O.Order_Status,
              P.Payment_Status
       FROM ORDERS O
       LEFT JOIN PAYMENT P ON O.Order_ID = P.Order_ID
       WHERE O.Retailer_ID = ?
       ORDER BY O.Order_Date DESC
       LIMIT 5`,
      [retailerId]
    );

    res.status(200).json(orders);
  } catch (err) {
    console.error('Recent orders error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};