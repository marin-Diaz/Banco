// src/components/CustomerForm.js

import React, { useState } from 'react';
import { useCustomerContext } from '../context/CustomerContext';

const CustomerForm = ({ onCreationSuccess }) => {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        initialDeposit: 0
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);

    // Obtenemos la función de creación del cliente del contexto
    const { createCustomer } = useCustomerContext();

    const handleChange = (e) => {
        const { name, value } = e.target;
        // La validación del depósito inicial debe asegurar que sea un número positivo.
        let updatedValue = value;
        if (name === 'initialDeposit') {
            // Asegura que sea un número válido y no sea negativo
            updatedValue = Math.max(0, parseFloat(value) || 0);
        }

        setFormData(prevData => ({
            ...prevData,
            [name]: updatedValue
        }));
        setFormError(null); // Limpia el error al empezar a escribir
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación básica
        if (!formData.firstName || !formData.lastName || formData.initialDeposit === undefined) {
            setFormError("Todos los campos son obligatorios.");
            return;
        }

        setIsSubmitting(true);
        setFormError(null);

        try {
            // Llama a la lógica de creación del contexto (que llama al servicio)
            await createCustomer(formData);

            // Limpia el formulario y notifica al componente padre
            setFormData({
                firstName: '',
                lastName: '',
                initialDeposit: 0
            });
            onCreationSuccess("Cliente creado exitosamente!");

        } catch (err) {
            // El error ya viene formateado desde el CustomerContext
            setFormError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card-style" style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '20px' }}>Crear Nueva Cuenta de Cliente</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group-grid">
                    <div className="form-group">
                        <label htmlFor="firstName">Nombre</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Apellido</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="initialDeposit">Depósito Inicial (US$)</label>
                        <input
                            type="number"
                            id="initialDeposit"
                            name="initialDeposit"
                            value={formData.initialDeposit}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                </div>

                {/* Mostrar mensajes de error o éxito */}
                {formError && <p className="error-message">{formError}</p>}

                <button
                    type="submit"
                    className="button primary-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creando...' : 'Crear Cliente'}
                </button>
            </form>
        </div>
    );
};

export default CustomerForm;