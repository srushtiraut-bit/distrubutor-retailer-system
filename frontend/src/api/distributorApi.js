import axiosInstance from './axiosConfig';

export const getAllDistributors = () => axiosInstance.get('/distributors');