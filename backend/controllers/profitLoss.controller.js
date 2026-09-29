const ProfitLossModel = require('../models/profitLoss.model');
const ExpenseModel = require('../models/expense.model');

exports.getMyProfitLoss = async (req, res) => {
  try {
    const distributorId = req.user.id;
    const { startDate, endDate } = req.query; // e.g. ?startDate=2026-08-01&endDate=2026-08-31

    const useDateRange = startDate && endDate;

    const records = useDateRange
      ? await ProfitLossModel.findByDistributorAndDateRange(distributorId, startDate, endDate)
      : await ProfitLossModel.findAllByDistributor(distributorId);

    const summary = useDateRange
      ? await ProfitLossModel.getSummaryByDistributorAndDateRange(distributorId, startDate, endDate)
      : await ProfitLossModel.getSummaryByDistributor(distributorId);

    const totalExpenses = useDateRange
      ? await ExpenseModel.getTotalByDateRange(distributorId, startDate, endDate)
      : await ExpenseModel.getTotalByDistributor(distributorId);

    const totalProfit = summary.totalProfit || 0;
    const netProfit = totalProfit - totalExpenses;

    res.status(200).json({
      records,
      summary: {
        totalCost: summary.totalCost || 0,
        totalRevenue: summary.totalRevenue || 0,
        totalProfit: totalProfit,
        avgMargin: summary.avgMargin || 0,
        totalExpenses: totalExpenses,
        netProfit: netProfit,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};