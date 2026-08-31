import axiosInstance from './axiosConfig';

export const getDashboardStats = () => axiosInstance.get('/retailer/dashboard-stats');
export const getRecentOrders = () => axiosInstance.get('/retailer/recent-orders');
export const getAllOrders = () => axiosInstance.get('/retailer/orders');
export const getAllPayments = () => axiosInstance.get('/retailer/payments');
export const placeOrder = (data) => axiosInstance.post('/retailer/place-order', data);