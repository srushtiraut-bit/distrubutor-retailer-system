import axiosInstance from './axiosConfig';

export const getDistributorDashboard = () => axiosInstance.get('/distributor/dashboard');