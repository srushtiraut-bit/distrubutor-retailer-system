import axiosInstance from './axiosConfig';

export const getDashboardStats = () => axiosInstance.get('/retailer/dashboard-stats');
export const getRecentOrders = () => axiosInstance.get('/retailer/recent-orders');