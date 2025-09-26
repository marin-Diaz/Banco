import axios from 'axios';

const API_URL = '/api/transactions';

export const transferMoney = async (transferData) => {
    try {
        const response = await axios.post(API_URL, transferData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getTransactionsForAccount = async (accountNumber) => {
    const response = await axios.get(`${API_URL}/${accountNumber}`);
    return response.data;
};

export const getTransactionHistory = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener el historial completo:", error);
        throw error;
    }
};