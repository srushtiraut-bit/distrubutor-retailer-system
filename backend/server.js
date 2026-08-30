const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const distributorRoutes = require('./routes/distributor.routes');
const productRoutes = require('./routes/product.routes');
const stockRoutes = require('./routes/stock.routes');
const orderRoutes = require('./routes/order.routes');
const profitLossRoutes = require('./routes/profitLoss.routes');
const paymentRoutes = require('./routes/payment.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/distributor', distributorRoutes);
app.use('/api/product', productRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/profit-loss', profitLossRoutes);
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));