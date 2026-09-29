import axiosInstance from './axiosConfig';

export const getDistributorDashboard = () => axiosInstance.get('/distributor/dashboard');
export const getAllDistributors = () => axiosInstance.get('/distributor/all');
export const getProfile = () => axiosInstance.get('/distributor/profile');
export const updateProfile = (data) => axiosInstance.put('/distributor/profile', data);
export const changePassword = (data) => axiosInstance.put('/distributor/change-password', data);
export const changeEmail = (data) => axiosInstance.put('/retailer/change-email', data);