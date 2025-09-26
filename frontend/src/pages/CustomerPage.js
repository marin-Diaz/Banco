

import React, { useState } from 'react';
import { useCustomerContext } from "../context/CustomerContext";
import Table from "../components/Table";
import BankSummary from "../components/BankSummary";
import usersNVIcon from '../assets/usersNV.png';

// Asumimos que los estilos globales y de layout se importan en App.js/index.js
const MESSAGE_TIMEOUT = 5000;
const CustomerPage = () => {
    const { customers, isLoading, error, addCustomer } = useCustomerContext();
    const [formData, setFormData] = useState({ firstName: '', lastName: '', accountNumber: '', balance: 0 });
    const [message, setMessage] = useState('');

    const customerColumns = [
        // ... (definición de customerColumns) ...
        { header: 'ID', accessor: 'id' },
        { header: 'Cuenta', accessor: 'accountNumber' },
        { header: 'Nombre', accessor: 'firstName' },
        { header: 'Apellido', 'accessor': 'lastName' },
        { header: 'Saldo', accessor: 'balance' },
    ];

    // ... (handleChange y handleSubmit) ...
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'number' ? Number(value) : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Limpiar cualquier mensaje anterior
        try {
            const newCustomer = await addCustomer(formData);

            // Mostrar el mensaje de éxito
            setMessage(`Cliente ${newCustomer.firstName} creado con éxito. Cuenta: ${newCustomer.accountNumber}`);
            setFormData({ firstName: '', lastName: '', accountNumber: '', balance: 0 });

            // NUEVA LÓGICA: Configurar el timer para limpiar el mensaje
            setTimeout(() => {
                setMessage('');
            }, MESSAGE_TIMEOUT); // Usar la constante de 5 segundos

        } catch (err) {
            const backendErrorMessage = err.response?.data?.message || err.response?.data || 'Error desconocido';

            // Si hay error, el mensaje permanece hasta la próxima acción
            setMessage(`Error al crear cliente: ${backendErrorMessage.includes('Duplicate entry') ? 'El número de cuenta ya existe.' : backendErrorMessage}`);

            console.error('Error al crear el cliente:', err);
        }
    };

    if (isLoading) return <div className="loading-spinner">Cargando clientes...</div>;
    if (error) return <div className="alert-danger">Error: {error}</div>;

    const sortedCustomers = [...customers].sort((a, b) => b.id - a.id);
    return (
        <div>
            {/* Encabezado principal como en el mockup */}
            <h1 style={{ marginBottom: '5px' }}>
                <span style={{ marginRight: '10px', fontSize: '1.5em', verticalAlign: 'middle' }}>
                    <img src={usersNVIcon} alt="Gestion de clientes" style={{
                        marginRight: '10px',
                        fontSize: '1.5em',
                        verticalAlign: 'middle',
                        // Ajusta el tamaño si es necesario, o usa un tamaño fijo (ej: 30px)
                        width: '30px',
                        height: '30px',
                    }}  />
                </span>
                Gestión de Clientes
            </h1>
            <p style={{ color: 'var(--secondary-color)', marginBottom: '30px' }}>Crear y administrar cuentas de clientes</p>

            {/* Contenedor de 2 columnas (1.5:1) */}
            <div style={{ display: 'flex', gap: '30px' }}>

                {/* --- Columna Izquierda: Formulario de Creación (1.5 partes) --- */}
                <div style={{ flex: 1.5 }}>
                    <div className="card-style">
                        <h4>Crear Nuevo Cliente</h4>
                        <p style={{ color: 'var(--secondary-color)', fontSize: '0.9em', marginBottom: '25px' }}>
                            Complete el formulario para registrar un nuevo cliente
                        </p>
                        <form onSubmit={handleSubmit}>

                            {/* Nombre y Apellido en línea */}
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="firstName">Nombre</label>
                                    <input
                                        type="text" // Asegura que sea 'text' para que Global.css lo afecte
                                        id="firstName"
                                        name="firstName"
                                        placeholder="Ingrese el nombre"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="lastName">Apellido</label>
                                    <input
                                        type="text" // Asegura que sea 'text'
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Ingrese el apellido"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Número de Cuenta */}
                            <label htmlFor="accountNumber">Número de Cuenta</label>
                            <input
                                type="text" // Asegura que sea 'text'
                                id="accountNumber"
                                name="accountNumber"
                                placeholder="Ingrese el número de cuenta"
                                value={formData.accountNumber}
                                onChange={handleChange}
                                required
                            />

                            {/* Saldo Inicial */}
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Saldo Inicial</label>
                            {/* Ajustamos el placeholder a '0.00' como en el mockup */}
                            <input name="balance" type="number" placeholder="0.00" value={formData.balance} onChange={handleChange} required min="0" />

                            <button type="submit" className="btn-primary-style" style={{ width: '100%', marginTop: '15px' }}>
                                Crear Cliente
                            </button>
                        </form>
                    </div>

                    {/* Mensaje de respuesta */}
                    {message && (
                        <div className={message.startsWith('Error') ? 'alert-danger' : 'alert-success'}>
                            {message}
                        </div>
                    )}
                </div>

                {/* --- Columna Derecha: Clientes Registrados (1 parte) --- */}
                <div style={{ flex: 1 }}>
                    <div className="card-style">
                        <h4>Clientes Registrados</h4>
                        <p style={{ color: 'var(--secondary-color)', fontSize: '0.9em', marginBottom: '20px' }}>
                            {customers.length} clientes en el sistema
                        </p>

                        <div
                            style={{
                                // Propiedades de scroll y altura
                                maxHeight: '400px',
                                overflowY: 'auto',

                                // Usamos solo un contenedor de bloque simple (más robusto que flex para scroll vertical)
                                marginTop: '20px',
                                paddingRight: '10px'
                            }}
                        >
                            {/* Renderizado de la lista de clientes */}
                            {sortedCustomers.map(c => (
                                <div
                                    key={c.accountNumber}
                                    style={{
                                        padding: '15px 0',
                                        borderBottom: '1px solid #eee',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '15px'
                                    }}
                                >
                                    <div>
                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{c.firstName} {c.lastName}</p>
                                        <p style={{ margin: '0', fontSize: '0.9em', color: 'var(--secondary-color)' }}>Cuenta: {c.accountNumber}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p
                                            style={{
                                                margin: '0',
                                                fontWeight: 'bold',
                                                color: 'var(--text-color)'
                                            }}
                                        >
                                            ${c.balance.toFixed(2)} US$
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {sortedCustomers.length === 0 && <p style={{ color: 'var(--secondary-color)' }}>No hay clientes registrados.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerPage;