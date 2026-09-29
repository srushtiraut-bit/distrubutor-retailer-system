import axiosInstance from './axiosConfig';

export const addExpense = async (data) => {
  const res = await axiosInstance.post('/expenses', data);
  return res.data;
};

export const getExpenses = async () => {
  const res = await axiosInstance.get('/expenses');
  return res.data;
};

export const deleteExpense = async (id) => {
  const res = await axiosInstance.delete(`/expenses/${id}`);
  return res.data;
};