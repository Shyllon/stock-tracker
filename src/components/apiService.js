import axios from 'axios';

const API_BASE_URL = "http://localhost:5000";

export const getStocks = async () => {
  return await axios.get(`${API_BASE_URL}/stocks`);
};

export const createStock = async (stockData) => {
  return await axios.post(`${API_BASE_URL}/stocks`, stockData);
};

export const updateStock = async (id, stockData) => {
  return await axios.put(`${API_BASE_URL}/stocks/${id}`, stockData);
};

export const deleteStock = async (id) => {
  return await axios.delete(`${API_BASE_URL}/stocks/${id}`);
};

export const fetchStockPrice = async (ticker) => {
  return await axios.get(`${API_BASE_URL}/stocks/${ticker}`);
};
