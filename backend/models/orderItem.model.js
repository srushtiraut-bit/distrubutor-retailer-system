const pool = require('../config/db');

const OrderItemModel = {
  async findByOrder(orderId) {
    const [rows] = await pool.query(
      `SELECT oi.Order_Item_ID, oi.Product_ID, p.Name AS product_name,
              oi.Quantity, oi.Cost_Price, oi.Selling_Price, oi.Subtotal
       FROM ORDER_ITEM oi
       JOIN PRODUCT p ON oi.Product_ID = p.Product_ID
       WHERE oi.Order_ID = ?`,
      [orderId]
    );
    return rows;
  },
};

module.exports = OrderItemModel;