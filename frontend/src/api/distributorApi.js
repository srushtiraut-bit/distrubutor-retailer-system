import axiosInstance from './axiosConfig';

export const getDistributorDashboard = () => axiosInstance.get('/distributor/dashboard');
export const getAllDistributors = () => axiosInstance.get('/distributor/all');