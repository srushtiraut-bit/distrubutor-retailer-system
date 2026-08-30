const PaymentModel = require('../models/payment.model');

exports.getMyPayments = async (req, res) => {
  try {
    const payments = await PaymentModel.findAllByDistributor(req.user.id);
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { amount_paid, payment_status, payment_mode } = req.body;

    const payment = await PaymentModel.findByOrderForDistributor(orderId, req.user.id);
    if (!payment) return res.status(404).json({ message: 'Payment record not found' });

    await PaymentModel.updateStatus(payment.payment_id, { amount_paid, payment_status, payment_mode });
    res.status(200).json({ message: 'Payment updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};