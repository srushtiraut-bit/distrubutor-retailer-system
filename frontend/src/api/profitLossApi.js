import axiosInstance from './axiosConfig';

export const getMyProfitLoss = () => axiosInstance.get('/profit-loss');