import axiosInstance from './axiosConfig';

export const loginUser = (data) => axiosInstance.post('/auth/login', data);
export const signupUser = (data) => axiosInstance.post('/auth/signup', data);