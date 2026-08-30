const OrderModel = require('../models/order.model');
const OrderItemModel = require('../models/orderItem.model');
const StockModel = require('../models/stock.model');

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await OrderModel.findAllByDistributor(req.user.id);
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getOrderItems = async (req, res) => {
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

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Paid'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await OrderModel.findByIdForDistributor(id, req.user.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await OrderModel.updateStatus(id, status);

    if (status === 'Delivered' && order.order_status !== 'Delivered') {
      const items = await OrderItemModel.findByOrder(id);
      for (const item of items) {
        await StockModel.reduceForDelivery(item.product_id, req.user.id, item.quantity);
      }
    }

    res.status(200).json({ message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};