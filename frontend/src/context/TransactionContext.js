
import React, { createContext, useContext, useState, useEffect } from 'react';
import { transferMoney, getTransactionHistory } from '../services/transactionService';
import { useCustomerContext } from './CustomerContext';

// Crear el objeto Context
const TransactionContext = createContext();

// Crear el Hook personalizado
export const useTransactionContext = () => {
    return useContext(TransactionContext);
};

// Crear el Provider
export const TransactionProvider = ({ children }) => {
    const [history, setHistory] = useState([]);

    // Obtenemos la función de refresco del CustomerContext
    const { refreshCustomers } = useCustomerContext();

    // Obtiene datos de la DB
    const loadHistory = async () => {
        try {
            const data = await getTransactionHistory();
            setHistory(data);
        } catch (error) {
            console.error("Error al cargar el historial de transacciones:", error);
            // Si la aplicación requiere que esto sea fatal, puedes manejarlo aquí
        }
    };

    // Cargar el historial UNA VEZ al montar el componente
    useEffect(() => {
        loadHistory();
    }, []); // Array de dependencias vacío para solo ejecutar al montar

    // Función para realizar la transferencia de dinero
    const performTransfer = async (transferData) => {
        try {
            const newTransaction = await transferMoney(transferData);

            // Añadir la nueva transacción al historial local (para reflejar de inmediato)
            setHistory((prevHistory) => [...prevHistory, newTransaction]);

            await refreshCustomers();

            return newTransaction;
        } catch (err) {
            // Re-lanzar el error para que la página de transacciones lo muestre al usuario
            throw err;
        }
    };

    const contextValue = {
        history,
        performTransfer,
        loadHistory, // Exportamos loadHistory por si una vista necesita forzar un refresco
    };

    return (
        <TransactionContext.Provider value={contextValue}>
            {children}
        </TransactionContext.Provider>
    );
};