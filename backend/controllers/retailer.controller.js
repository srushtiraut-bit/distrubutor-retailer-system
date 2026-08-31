const pool = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const retailerId = req.user.id;

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

exports.getAllOrders = async (req, res) => {
  try {
    const retailerId = req.user.id;

    const [orders] = await pool.query(
      `SELECT O.Order_ID, O.Order_Date, O.Total_Bill, O.Order_Status,
              P.Payment_Status
       FROM ORDERS O
       LEFT JOIN PAYMENT P ON O.Order_ID = P.Order_ID
       WHERE O.Retailer_ID = ?
       ORDER BY O.Order_Date DESC`,
      [retailerId]
    );

    res.status(200).json(orders);
  } catch (err) {
    console.error('All orders error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const retailerId = req.user.id;

    const [payments] = await pool.query(
      `SELECT P.Payment_ID, P.Order_ID, P.Total_Amount, P.Amount_Paid,
              (P.Total_Amount - P.Amount_Paid) AS Amount_Due,
              P.Payment_Status, O.Order_Date
       FROM PAYMENT P
       JOIN ORDERS O ON P.Order_ID = O.Order_ID
       WHERE O.Retailer_ID = ?
       ORDER BY O.Order_Date DESC`,
      [retailerId]
    );

    res.status(200).json(payments);
  } catch (err) {
    console.error('All payments error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.placeOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const retailerId = req.user.id;
    const { distributorId, items } = req.body;

    if (!distributorId || !items || items.length === 0) {
      connection.release();
      return res.status(400).json({ message: 'Invalid order data' });
    }

    await connection.beginTransaction();

    const productIds = items.map((i) => i.productId);
    const [products] = await connection.query(
      `SELECT product_id, cost_price, selling_price FROM product WHERE product_id IN (?)`,
      [productIds]
    );

    const productMap = {};
    products.forEach((p) => {
      productMap[p.product_id] = p;
    });

    let totalBill = 0;
    for (const item of items) {
      const product = productMap[item.productId];
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      totalBill += product.selling_price * item.quantity;
    }

    const [orderResult] = await connection.query(
      `INSERT INTO orders (retailer_id, distributor_id, order_date, total_bill, order_status)
       VALUES (?, ?, NOW(), ?, 'Pending')`,
      [retailerId, distributorId, totalBill]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      const product = productMap[item.productId];
      const subtotal = product.selling_price * item.quantity;
      await connection.query(
        `INSERT INTO order_item (order_id, product_id, quantity, cost_price, selling_price, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.productId, item.quantity, product.cost_price, product.selling_price, subtotal]
      );
    }

    await connection.commit();

    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (err) {
    await connection.rollback();
    console.error('Place order error:', err);
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  } finally {
    connection.release();
  }
};