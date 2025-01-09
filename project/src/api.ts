import axios from 'axios';
import { StockPosition, Transaction } from './types';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000 // 5 second timeout
});

// Add error handling to API calls
const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error
    throw new Error(error.response.data.error || 'Server error');
  } else if (error.request) {
    // No response received
    throw new Error('No response from server. Please check if the server is running.');
  } else {
    // Request setup error
    throw new Error('Error setting up request');
  }
};

export const addTransaction = async (data: Transaction) => {
  try {
    const response = await api.post('/transactions', data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getPositions = async () => {
  try {
    const response = await api.get<StockPosition[]>('/positions');
    return response.data;
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

export const getGains = async (period: 'today' | 'week' | 'month' | 'year') => {
  try {
    const response = await api.get(`/gains/${period}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    return [];
  }
};