

import axios from 'axios';

const API_URL = '/api/customers';

export const createCustomer = async (customerData) => {
    // customerData debe tener: { firstName, lastName, balance }
    const response = await axios.post(API_URL, customerData);
    return response.data; // Devuelve el CustomerDTO completo
};

export const getAllCustomers = async () => {
    const response = await axios.get(API_URL);
    return response.data; // Devuelve List<CustomerDTO>
};