const pool = require('../config/db');

const OrderItemModel = {
  async findByOrder(orderId) {
    const [rows] = await pool.query(
      `SELECT oi.Order_Item_ID AS order_item_id,
              oi.Product_ID AS product_id,
              p.Name AS product_name,
              oi.Quantity AS quantity,
              oi.Cost_Price AS cost_price,
              oi.Selling_Price AS selling_price,
              oi.Subtotal AS subtotal
       FROM ORDER_ITEM oi
       JOIN PRODUCT p ON oi.Product_ID = p.Product_ID
       WHERE oi.Order_ID = ?`,
      [orderId]
    );
    return rows;
  },
};

module.exports = OrderItemModel;