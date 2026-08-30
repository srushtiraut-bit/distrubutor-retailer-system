import axiosInstance from './axiosConfig';

export const getMyOrders = () => axiosInstance.get('/order');
export const getOrderItems = (id) => axiosInstance.get(`/order/${id}/items`);
export const updateOrderStatus = (id, status) => axiosInstance.put(`/order/${id}/status`, { status });