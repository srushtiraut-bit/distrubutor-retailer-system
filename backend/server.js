const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const distributorRoutes = require('./routes/distributor.routes');
app.use('/api/distributors', distributorRoutes);
const retailerRoutes = require('./routes/retailer.routes');
app.use('/api/retailer', retailerRoutes);
