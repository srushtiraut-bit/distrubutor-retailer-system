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

    const totalExpenses = Number(
      useDateRange
        ? await ExpenseModel.getTotalByDateRange(distributorId, startDate, endDate)
        : await ExpenseModel.getTotalByDistributor(distributorId)
    ) || 0;

    const totalProfit = Number(summary.totalProfit) || 0;

    res.status(200).json({
      records,
      summary: {
        totalCost: Number(summary.totalCost) || 0,
        totalRevenue: Number(summary.totalRevenue) || 0,
        totalProfit,
        avgMargin: Number(summary.avgMargin) || 0,
        totalExpenses,
        netProfit: totalProfit - totalExpenses,
      },
    });
  } catch (err) {
    console.error('Profit loss error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};