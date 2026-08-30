const pool = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const distributorId = req.user.id;

    const [[distributorInfo]] = await pool.query(
      'SELECT name, email, contact FROM distributor WHERE distributor_id = ?',
      [distributorId]
    );

    const [[productCount]] = await pool.query(
      'SELECT COUNT(*) AS total FROM product WHERE distributor_id = ?',
      [distributorId]
    );

    const [[stockSum]] = await pool.query(
      'SELECT SUM(remaining_quantity) AS total FROM stock WHERE distributor_id = ?',
      [distributorId]
    );

    const [[orderCount]] = await pool.query(
      'SELECT COUNT(*) AS total FROM orders WHERE distributor_id = ?',
      [distributorId]
    );

    const [[pendingOrders]] = await pool.query(
      "SELECT COUNT(*) AS total FROM orders WHERE distributor_id = ? AND order_status = 'Pending'",
      [distributorId]
    );

    const [[revenue]] = await pool.query(
      'SELECT SUM(total_bill) AS total FROM orders WHERE distributor_id = ?',
      [distributorId]
    );

    const [recentOrders] = await pool.query(
      `SELECT order_id, retailer_id, order_date, total_bill, order_status
       FROM orders WHERE distributor_id = ?
       ORDER BY order_date DESC LIMIT 5`,
      [distributorId]
    );

    res.status(200).json({
      distributor: distributorInfo,
      stats: {
        totalProducts: productCount.total || 0,
        totalStock: stockSum.total || 0,
        totalOrders: orderCount.total || 0,
        pendingOrders: pendingOrders.total || 0,
        totalRevenue: revenue.total || 0
      },
      recentOrders
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};