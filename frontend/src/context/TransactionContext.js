import React, { createContext, useContext, useState, useEffect } from 'react';
//Importar la nueva función para búsqueda por cuenta
import { transferMoney, getTransactionHistory, getTransactionsForAccount } from '../services/transactionService';
import { useCustomerContext } from './CustomerContext';

//Crear el objeto Context
const TransactionContext = createContext();

//Crear el Hook personalizado
export const useTransactionContext = () => {
    return useContext(TransactionContext);
};

//Crear el Provider
export const TransactionProvider = ({ children }) => {
    const [history, setHistory] = useState([]);
    const { refreshCustomers } = useCustomerContext();

    //FUNCIÓN DE CARGA: Obtiene todo el historial de la base de datos
    const loadHistory = async () => {
        try {
            const data = await getTransactionHistory();
            setHistory(data);
        } catch (error) {
            console.error("Error al cargar el historial de transacciones:", error);
        }
    };

    //Carga transacciones para una sola cuenta
    const loadHistoryForAccount = async (accountNumber) => {
        try {
            if (!accountNumber || accountNumber.trim() === '') {
                // Si la búsqueda está vacía, cargamos todo el historial
                await loadHistory();
                return;
            }

            // Llama al servicio del backend con el número de cuenta
            const data = await getTransactionsForAccount(accountNumber);

            // Reemplazamos el historial global con el resultado de la búsqueda
            setHistory(data);
        } catch (error) {
            console.error("Error al buscar transacciones para la cuenta:", accountNumber, error);
            // Si hay error (ej. cuenta no existe), vaciamos la lista para mostrar el mensaje de "no encontrado"
            setHistory([]);
        }
    };


    // Cargar el historial UNA VEZ al montar el componente
    useEffect(() => {
        loadHistory();
    }, []);

    // Función para realizar la transferencia de dinero
    const performTransfer = async (transferData) => {
        try {
            const newTransaction = await transferMoney(transferData);

            setHistory((prevHistory) => [...prevHistory, newTransaction]);

            await refreshCustomers();

            return newTransaction;
        } catch (err) {
            throw err;
        }
    };

    const contextValue = {
        history,
        performTransfer,
        loadHistory,
        loadHistoryForAccount,
    };

    return (
        <TransactionContext.Provider value={contextValue}>
            {children}
        </TransactionContext.Provider>
    );
};