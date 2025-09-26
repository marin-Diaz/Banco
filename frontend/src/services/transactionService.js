

import axios from 'axios';

const API_URL = '/api/transactions';

export const transferMoney = async (transferData) => {
    // transferData debe tener: { senderAccountNumber, receiverAccountNumber, amount }
    try {
        const response = await axios.post(API_URL, transferData);
        return response.data; // Devuelve el TransactionDTO
    } catch (error) {
        // Es crucial lanzar el error para manejar el 400 (saldo insuficiente, cuenta no encontrada, etc.)
        throw error.response.data;
    }
};

export const getTransactionsForAccount = async (accountNumber) => {
    const response = await axios.get(`${API_URL}/${accountNumber}`);
    return response.data; // Devuelve List<TransactionDTO>
};

export const getTransactionHistory = async () => {
    try {
        // Usar el endpoint 'all' para que coincida con @GetMapping("/all") en el Controller
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener el historial completo:", error);
        throw error;
    }
};