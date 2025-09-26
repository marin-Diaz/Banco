import axios from 'axios';

const API_URL = '/api/customers/stats';

export const getDashboardStats = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error al obtener estadísticas del dashboard:", error);
        throw error;
    }
};