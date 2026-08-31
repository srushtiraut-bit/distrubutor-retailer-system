import axiosInstance from './axiosConfig';

// ===============================
// RETAILER
// ===============================

// Record payment after retailer confirms UPI payment
export const recordPayment = (data) =>
  axiosInstance.post('/payment', data);


// ===============================
// DISTRIBUTOR
// ===============================

// Get payment records
export const getMyPayments = () =>
  axiosInstance.get('/payment/my-payments');


// Update payment
export const updatePayment = (orderId, data) =>
  axiosInstance.put(`/payment/${orderId}`, data);