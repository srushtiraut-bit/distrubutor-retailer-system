import axiosInstance from './axiosConfig';

export const getProductsByDistributor = (distributorId) =>
  axiosInstance.get(`/products/distributor/${distributorId}`);