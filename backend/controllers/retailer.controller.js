const pool = require('../config/db');
const bcrypt = require('bcryptjs');

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
      `SELECT Product_ID AS product_id, Cost_Price AS cost_price, Selling_Price AS selling_price
       FROM PRODUCT
       WHERE Product_ID IN (?)`,
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
      `INSERT INTO ORDERS (Retailer_ID, Distributor_ID, Order_Date, Total_Bill, Order_Status)
       VALUES (?, ?, CURDATE(), ?, 'Pending')`,
      [retailerId, distributorId, totalBill]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      const product = productMap[item.productId];
      const subtotal = product.selling_price * item.quantity;
      await connection.query(
        `INSERT INTO ORDER_ITEM (Order_ID, Product_ID, Quantity, Cost_Price, Selling_Price, Subtotal)
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
exports.getProfile = async (req, res) => {
  try {
    const retailerId = req.user.id;
    const [[retailer]] = await pool.query(
      `SELECT Retailer_ID AS id, Name AS name, Email AS email, Contact AS contact,
              Alternate_Contact AS alternate_contact,
              Address AS address, Shop_Type AS shop_type, GST_No AS gst_no,
              Email_Notifications AS email_notifications,
              Order_Notifications AS order_notifications,
              Promo_Notifications AS promo_notifications
       FROM RETAILER WHERE Retailer_ID = ?`,
      [retailerId]
    );
    if (!retailer) return res.status(404).json({ message: 'Retailer not found' });
    res.status(200).json(retailer);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const retailerId = req.user.id;
    const {
      name, email, contact, alternate_contact, address, shop_type, gst_no,
      email_notifications, order_notifications, promo_notifications
    } = req.body;

    const [[existing]] = await pool.query(
      'SELECT Retailer_ID FROM RETAILER WHERE Email = ? AND Retailer_ID != ?',
      [email, retailerId]
    );
    if (existing) {
      return res.status(400).json({ message: 'That email is already in use' });
    }

    await pool.query(
      `UPDATE RETAILER 
       SET Name = ?, Email = ?, Contact = ?, Alternate_Contact = ?, Address = ?, Shop_Type = ?, GST_No = ?,
           Email_Notifications = ?, Order_Notifications = ?, Promo_Notifications = ?
       WHERE Retailer_ID = ?`,
      [name, email, contact, alternate_contact, address, shop_type, gst_no,
       email_notifications, order_notifications, promo_notifications, retailerId]
    );

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const retailerId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required' });
    }

    const [[retailer]] = await pool.query(
      'SELECT Password FROM RETAILER WHERE Retailer_ID = ?',
      [retailerId]
    );

    if (!retailer) {
      return res.status(404).json({ message: 'Retailer not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, retailer.Password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE RETAILER SET Password = ? WHERE Retailer_ID = ?',
      [hashedPassword, retailerId]
    );

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.changeEmail = async (req, res) => {
  try {
    const retailerId = req.user.id;
    const { currentPassword, newEmail } = req.body;

    if (!currentPassword || !newEmail) {
      return res.status(400).json({ message: 'Current password and new email are required' });
    }

    const [[retailer]] = await pool.query(
      'SELECT Password FROM RETAILER WHERE Retailer_ID = ?',
      [retailerId]
    );

    if (!retailer) {
      return res.status(404).json({ message: 'Retailer not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, retailer.Password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const [[existing]] = await pool.query(
      'SELECT Retailer_ID FROM RETAILER WHERE Email = ? AND Retailer_ID != ?',
      [newEmail, retailerId]
    );
    if (existing) {
      return res.status(400).json({ message: 'That email is already in use' });
    }

    await pool.query(
      'UPDATE RETAILER SET Email = ? WHERE Retailer_ID = ?',
      [newEmail, retailerId]
    );

    res.status(200).json({ message: 'Email changed successfully' });
  } catch (err) {
    console.error('Change email error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};