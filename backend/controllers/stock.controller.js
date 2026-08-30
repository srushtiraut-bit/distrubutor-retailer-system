const StockModel = require('../models/stock.model');

exports.getMyStock = async (req, res) => {
  try {
    const stock = await StockModel.findAllByDistributor(req.user.id);
    res.status(200).json(stock);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addStock = async (req, res) => {
  try {
    const { product_id, input_quantity, date, expiry } = req.body;
    if (!product_id || !input_quantity) {
      return res.status(400).json({ message: 'Product and input quantity are required' });
    }
    const stockId = await StockModel.create({ distributorId: req.user.id, product_id, input_quantity, date, expiry });
    res.status(201).json({ message: 'Stock added', stock_id: stockId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { input_quantity, output_quantity, date, expiry } = req.body;
    const affected = await StockModel.update(id, req.user.id, { input_quantity, output_quantity, date, expiry });
    if (affected === 0) return res.status(404).json({ message: 'Stock record not found' });
    res.status(200).json({ message: 'Stock updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteStock = async (req, res) => {
  try {
    const { id } = req.params;
    const affected = await StockModel.remove(id, req.user.id);
    if (affected === 0) return res.status(404).json({ message: 'Stock record not found' });
    res.status(200).json({ message: 'Stock deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};