import axios from 'axios';

// Set up base URL for API requests
const API = axios.create({
  baseURL: 'http://localhost:8500/',
});

// translation history
export const getAllBill = () => API.get('/bills/AllBill');
export const getBillingBYUserId = (userId) => API.get(`/bills/user/${userId}`);
export const getBillById = (billId) => API.get(`/bills/getBill/${billId}`);
export const addBill = (billData) => API.post('/bills/addBill', billData);
export const deleteBill = (id) => API.delete(`/bills/deleteBill/${id}`);
