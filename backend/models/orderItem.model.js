const pool = require('../config/db');

const OrderItemModel = {
  async findByOrder(orderId) {
    const [rows] = await pool.query(
      `SELECT oi.order_item_id, oi.product_id, p.name AS product_name,
              oi.quantity, oi.cost_price, oi.selling_price, oi.subtotal
       FROM order_item oi
       JOIN product p ON oi.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    return rows;
  },
};

module.exports = OrderItemModel;