const pool = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getDashboardStats = async (req, res) => {
  try {
    const distributorId = req.user.id;

    const [[distributorInfo]] = await pool.query(
      'SELECT Name AS name, Email AS email, Contact AS contact FROM DISTRIBUTOR WHERE Distributor_ID = ?',
      [distributorId]
    );

    const [[productCount]] = await pool.query(
      'SELECT COUNT(*) AS total FROM PRODUCT WHERE Distributor_ID = ?',
      [distributorId]
    );

    const [[stockSum]] = await pool.query(
      'SELECT SUM(Remaining_Quantity) AS total FROM STOCK WHERE Distributor_ID = ?',
      [distributorId]
    );

    const [[orderCount]] = await pool.query(
      'SELECT COUNT(*) AS total FROM ORDERS WHERE Distributor_ID = ?',
      [distributorId]
    );

    const [[pendingOrders]] = await pool.query(
      "SELECT COUNT(*) AS total FROM ORDERS WHERE Distributor_ID = ? AND Order_Status = 'Pending'",
      [distributorId]
    );

    const [[revenue]] = await pool.query(
      'SELECT SUM(Total_Bill) AS total FROM ORDERS WHERE Distributor_ID = ?',
      [distributorId]
    );

    const [recentOrders] = await pool.query(
      `SELECT Order_ID, Retailer_ID, Order_Date, Total_Bill, Order_Status
       FROM ORDERS WHERE Distributor_ID = ?
       ORDER BY Order_Date DESC LIMIT 5`,
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
    console.error('Get dashboard stats error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllDistributors = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT Distributor_ID, Name, Contact, Address, Type_of_Shop
       FROM DISTRIBUTOR
       ORDER BY Name`
    );
    res.json(rows);
  } catch (error) {
    console.error('Get all distributors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const distributorId = req.user.id;
    const [[distributor]] = await pool.query(
      `SELECT Distributor_ID AS id, Name AS name, Email AS email, Contact AS contact,
              Alternate_Contact AS alternate_contact,
              Address AS address, Type_of_Shop AS type_of_shop, GST_No AS gst_no,
              Food_License_Validity AS food_license_validity,
              Opening_Time AS opening_time, Closing_Time AS closing_time,
              Email_Notifications AS email_notifications,
              Order_Notifications AS order_notifications,
              Promo_Notifications AS promo_notifications
       FROM DISTRIBUTOR WHERE Distributor_ID = ?`,
      [distributorId]
    );
    if (!distributor) return res.status(404).json({ message: 'Distributor not found' });
    res.status(200).json(distributor);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const distributorId = req.user.id;
    const {
      name, email, contact, alternate_contact, address, type_of_shop, gst_no,
      food_license_validity, opening_time, closing_time,
      email_notifications, order_notifications, promo_notifications
    } = req.body;

    const [[existing]] = await pool.query(
      'SELECT Distributor_ID FROM DISTRIBUTOR WHERE Email = ? AND Distributor_ID != ?',
      [email, distributorId]
    );
    if (existing) {
      return res.status(400).json({ message: 'That email is already in use' });
    }

    await pool.query(
      `UPDATE DISTRIBUTOR 
       SET Name = ?, Email = ?, Contact = ?, Alternate_Contact = ?, Address = ?, Type_of_Shop = ?, GST_No = ?,
           Food_License_Validity = ?, Opening_Time = ?, Closing_Time = ?,
           Email_Notifications = ?, Order_Notifications = ?, Promo_Notifications = ?
       WHERE Distributor_ID = ?`,
      [name, email, contact, alternate_contact, address, type_of_shop, gst_no,
       food_license_validity, opening_time, closing_time,
       email_notifications, order_notifications, promo_notifications, distributorId]
    );

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const distributorId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const [[distributor]] = await pool.query(
      'SELECT Password FROM DISTRIBUTOR WHERE Distributor_ID = ?',
      [distributorId]
    );

    const isMatch = await bcrypt.compare(currentPassword, distributor.Password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE DISTRIBUTOR SET Password = ? WHERE Distributor_ID = ?',
      [hashedPassword, distributorId]
    );

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.changeEmail = async (req, res) => {
  try {
    const distributorId = req.user.id;
    const { currentPassword, newEmail } = req.body;

    if (!currentPassword || !newEmail) {
      return res.status(400).json({ message: 'Current password and new email are required' });
    }

    const [[distributor]] = await pool.query(
      'SELECT Password FROM DISTRIBUTOR WHERE Distributor_ID = ?',
      [distributorId]
    );

    if (!distributor) {
      return res.status(404).json({ message: 'Distributor not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, distributor.Password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const [[existing]] = await pool.query(
      'SELECT Distributor_ID FROM DISTRIBUTOR WHERE Email = ? AND Distributor_ID != ?',
      [newEmail, distributorId]
    );
    if (existing) {
      return res.status(400).json({ message: 'That email is already in use' });
    }

    await pool.query(
      'UPDATE DISTRIBUTOR SET Email = ? WHERE Distributor_ID = ?',
      [newEmail, distributorId]
    );

    res.status(200).json({ message: 'Email changed successfully' });
  } catch (err) {
    console.error('Change email error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};