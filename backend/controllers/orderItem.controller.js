const OrderModel = require('../models/order.model');
const OrderItemModel = require('../models/orderItem.model');

exports.getItemsByOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findByIdForDistributor(id, req.user.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const items = await OrderItemModel.findByOrder(id);
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};