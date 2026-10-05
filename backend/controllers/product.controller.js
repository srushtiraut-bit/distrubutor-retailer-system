const ProductModel = require('../models/product.model');
const pool = require('../config/db');

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
    const distributorId = req.params.distributorId;

    const [rows] = await pool.query(
      `SELECT p.Product_ID,
              p.Product_ID AS id,
              p.Product_ID AS product_id,
              p.Distributor_ID,
              p.Distributor_ID AS distributor_id,
              p.Name,
              p.Name AS name,
              p.Cost_Price,
              p.Cost_Price AS cost_price,
              p.Selling_Price,
              p.Selling_Price AS selling_price,
              p.Category,
              p.Category AS category,
              p.Unit,
              p.Unit AS unit,
              CAST(COALESCE(s.total_remaining, 0) AS SIGNED) AS Remaining_Quantity,
              CAST(COALESCE(s.total_remaining, 0) AS SIGNED) AS remaining_quantity,
              CAST(COALESCE(s.total_remaining, 0) AS SIGNED) AS available,
              CAST(COALESCE(s.total_remaining, 0) AS SIGNED) AS available_quantity,
              CAST(COALESCE(s.total_remaining, 0) AS SIGNED) AS stock
       FROM PRODUCT p
       LEFT JOIN (
         SELECT Product_ID, SUM(Remaining_Quantity) AS total_remaining
         FROM STOCK
         GROUP BY Product_ID
       ) s ON s.Product_ID = p.Product_ID
       WHERE p.Distributor_ID = ?
       ORDER BY p.Name`,
      [distributorId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Get products by distributor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};