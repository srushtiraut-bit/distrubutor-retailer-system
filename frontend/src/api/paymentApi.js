import axiosInstance from './axiosConfig';

export const getMyPayments = () => axiosInstance.get('/payment');
export const updatePayment = (orderId, data) => axiosInstance.put(`/payment/${orderId}`, data);