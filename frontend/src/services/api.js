import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const customerService = {
  getAllCustomers: () => api.get('/customers'),
  getCustomerById: (id) => api.get(`/customers/${id}`),
  createCustomer: (customerData) => api.post('/customers', customerData),
};

export const transactionService = {
  getAllTransactions: () => api.get('/transactions'),
  getTransactionsByAccount: (accountNumber) => 
    api.get(`/transactions/account/${accountNumber}`),
  transferMoney: (transferData) => api.post('/transactions', transferData),
};

export default api;