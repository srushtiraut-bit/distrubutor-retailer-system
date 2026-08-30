const ProductModel = require('../models/product.model');

exports.getMyProducts = async (req, res) => {
  try {
    const products = await ProductModel.findAllByDistributor(req.user.id);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { name, cost_price, selling_price, category, unit } = req.body;
    if (!name || !cost_price || !selling_price) {
      return res.status(400).json({ message: 'Name, cost price and selling price are required' });
    }
    const productId = await ProductModel.create({ distributorId: req.user.id, name, cost_price, selling_price, category, unit });
    res.status(201).json({ message: 'Product added', product_id: productId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cost_price, selling_price, category, unit } = req.body;
    const affected = await ProductModel.update(id, req.user.id, { name, cost_price, selling_price, category, unit });
    if (affected === 0) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const affected = await ProductModel.remove(id, req.user.id);
    if (affected === 0) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProductsByDistributor = async (req, res) => {
  try {
    const { distributorId } = req.params;
    const products = await ProductModel.findAllByDistributor(distributorId);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};