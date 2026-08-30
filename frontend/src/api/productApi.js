import axiosInstance from './axiosConfig';

export const getMyProducts = () => axiosInstance.get('/product');
export const addProduct = (data) => axiosInstance.post('/product', data);
export const updateProduct = (id, data) => axiosInstance.put(`/product/${id}`, data);
export const deleteProduct = (id) => axiosInstance.delete(`/product/${id}`);