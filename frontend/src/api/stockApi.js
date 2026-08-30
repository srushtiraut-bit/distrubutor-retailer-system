import axiosInstance from './axiosConfig';

export const getMyStock = () => axiosInstance.get('/stock');
export const addStock = (data) => axiosInstance.post('/stock', data);
export const updateStock = (id, data) => axiosInstance.put(`/stock/${id}`, data);
export const deleteStock = (id) => axiosInstance.delete(`/stock/${id}`);