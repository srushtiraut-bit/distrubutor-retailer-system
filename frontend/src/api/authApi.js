import axiosInstance from './axiosConfig';

export const loginUser = (data) => axiosInstance.post('/auth/login', data);
export const signupUser = (data) => axiosInstance.post('/auth/signup', data);
export const forgotPassword = (data) => axiosInstance.post('/auth/forgot-password', data);
export const resetPassword = (data) => axiosInstance.post('/auth/reset-password', data);