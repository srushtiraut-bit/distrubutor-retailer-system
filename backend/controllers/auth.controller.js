// backend/controllers/auth.controller.js

const bcrypt = require('bcryptjs');
const DistributorModel = require('../models/distributor.model');
const RetailerModel = require('../models/retailer.model');
const generateToken = require('../utils/generateToken');

const getModel = (role) =>
  role === 'distributor' ? DistributorModel : RetailerModel;

// ------------------- SIGNUP -------------------
exports.signup = async (req, res) => {
  try {
    const {
      role,
      name,
      contact,
      address,
      gst_no,
      shop_type,      // only used for retailer
      email,
      password
    } = req.body;

    if (!['distributor', 'retailer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const Model = getModel(role);

    const existingUser = await Model.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const id =
      role === 'distributor'
        ? await Model.create({ name, contact, address, gst_no, email, hashedPassword })
        : await Model.create({ name, contact, address, shop_type, gst_no, email, hashedPassword });

    const token = generateToken(id, role);

    res.status(201).json({
      message: 'Signup successful',
      token,
      user: { id, name, email, role }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ------------------- LOGIN -------------------
exports.login = async (req, res) => {
  try {
    const { role, email, password } = req.body;

    if (!['distributor', 'retailer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const Model = getModel(role);
    const user = await Model.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const idField = role === 'distributor' ? 'Distributor_ID' : 'Retailer_ID';
    const token = generateToken(user[idField], role);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user[idField],
        name: user.Name,
        email: user.Email,
        role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};