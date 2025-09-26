// src/context/CustomerContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllCustomers, createCustomer as createCustomerApi } from '../services/customerService';
// Importar el servicio del dashboard
import { getDashboardStats } from '../services/dashboardService';

// Crear el objeto Context
const CustomerContext = createContext();

// Crear el Hook personalizado para acceder al contexto fácilmente
export const useCustomerContext = () => {
    return useContext(CustomerContext);
};

// Crear el Provider (El componente que envuelve toda la aplicación)
export const CustomerProvider = ({ children }) => {
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Nuevo estado para las estadísticas del dashboard
    const [stats, setStats] = useState(null);

    // Función para cargar los datos del dashboard
    const loadStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error("Fallo al cargar las estadísticas del dashboard:", error);
            // No establecemos un error fatal aquí, solo registramos.
        }
    };


    // Función para cargar los datos de la API (renombrada a refreshCustomers para claridad)
    const refreshCustomers = async () => {
        try {
            setIsLoading(true);
            const data = await getAllCustomers();
            setCustomers(data);
            setError(null);

            // Cargar las estadísticas después de cargar/refrescar clientes
            await loadStats();

        } catch (err) {
            console.error("Error fetching customers:", err);
            setError("No se pudieron cargar los datos de clientes.");
        } finally {
            setIsLoading(false);
        }
    };

    // Función para agregar un nuevo cliente y actualizar el estado
    const addCustomer = async (customerData) => {
        try {
            const newCustomer = await createCustomerApi(customerData);

            // Actualiza el estado global con el nuevo cliente
            setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);

            // Recarga las estadísticas para reflejar el nuevo cliente y saldo total
            await loadStats();

            return newCustomer;
        } catch (err) {
            throw err;
        }
    };

    // Carga inicial de datos al montar el Provider
    useEffect(() => {
        refreshCustomers();
    }, []);

    // Objeto de valor que se compartirá con todos los componentes
    const contextValue = {
        customers,
        stats,
        isLoading,
        error,
        addCustomer,
        refreshCustomers,
    };

    return (
        <CustomerContext.Provider value={contextValue}>
            {children}
        </CustomerContext.Provider>
    );
};