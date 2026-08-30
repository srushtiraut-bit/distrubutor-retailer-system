const ProfitLossModel = require('../models/profitLoss.model');

exports.getMyProfitLoss = async (req, res) => {
  try {
    const distributorId = req.user.id;
    const records = await ProfitLossModel.findAllByDistributor(distributorId);
    const summary = await ProfitLossModel.getSummaryByDistributor(distributorId);

    res.status(200).json({
      records,
      summary: {
        totalCost: summary.totalCost || 0,
        totalRevenue: summary.totalRevenue || 0,
        totalProfit: summary.totalProfit || 0,
        avgMargin: summary.avgMargin || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};