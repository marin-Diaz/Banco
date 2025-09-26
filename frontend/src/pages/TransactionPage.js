import React, { useState } from 'react';
import { useTransactionContext } from '../context/TransactionContext';
import { useCustomerContext } from '../context/CustomerContext';
import transferIcon from '../assets/transfer.png';

const MESSAGE_TIMEOUT = 5000;

const TransactionPage = () => {
    const { performTransfer, transactions } = useTransactionContext();
    const { customers } = useCustomerContext();

    const [message, setMessage] = useState(''); // Mensaje de éxito/error
    const [transferData, setTransferData] = useState({
        senderAccountNumber: '',
        receiverAccountNumber: '',
        amount: 0
    });
    const [validationErrors, setValidationErrors] = useState({});

    // Función para manejar cambios en el formulario
    const handleTransferChange = (e) => {
        const { name, value, type } = e.target;
        setTransferData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
        // Limpiar validaciones al cambiar
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Función de validación básica
    const validate = () => {
        let errors = {};
        if (!transferData.senderAccountNumber) errors.senderAccountNumber = "Seleccione la cuenta de origen.";
        if (!transferData.receiverAccountNumber) errors.receiverAccountNumber = "Seleccione la cuenta de destino.";
        if (transferData.amount <= 0) errors.amount = "El monto debe ser mayor a cero.";
        if (transferData.senderAccountNumber === transferData.receiverAccountNumber && transferData.amount > 0) {
            errors.receiverAccountNumber = "La cuenta de destino no puede ser la misma que la de origen.";
        }

        // Validación de saldo
        const sender = customers.find(c => c.accountNumber === transferData.senderAccountNumber);
        if (sender && sender.balance < transferData.amount) {
            errors.amount = "Saldo insuficiente en la cuenta de origen.";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };


    // Función principal de envío del formulario
    const handleTransferSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setValidationErrors({});

        if (!validate()) {
            return;
        }

        try {
            const newTransaction = await performTransfer(transferData);

            // Mostrar el mensaje de éxito
            setMessage(`Transferencia de $${newTransaction.amount.toFixed(2)} a cuenta ${newTransaction.receiverAccountNumber} exitosa!`);

            // Limpiar formulario después del éxito
            setTransferData({ senderAccountNumber: '', receiverAccountNumber: '', amount: 0 });

            // Configurar el timer para limpiar el mensaje tras 5s
            setTimeout(() => {
                setMessage('');
            }, MESSAGE_TIMEOUT);

        } catch (error) {
            const backendMessage = error.response?.data?.message || 'Error desconocido al realizar la transferencia.';
            setMessage(`Error: ${backendMessage}`);
            console.error('Error de transferencia:', error);
        }
    };

    // Función para formatear saldos en la lista de resumen
    const formatBalance = (balance) => {
        return balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    const getSortedCustomers = () => {
        const { senderAccountNumber, receiverAccountNumber } = transferData;

        // Si no hay clientes cargados, devuelve []
        if (!customers || customers.length === 0) {
            return [];
        }

        // Si no hay cuentas seleccionadas en el formulario, devuelve la lista original.
        if (!senderAccountNumber && !receiverAccountNumber) {
            return customers;
        }

        const sender = customers.find(c => c.accountNumber === senderAccountNumber);
        const receiver = customers.find(c => c.accountNumber === receiverAccountNumber && c.accountNumber !== senderAccountNumber);
        const remainingCustomers = customers.filter(c => c.accountNumber !== senderAccountNumber && c.accountNumber !== receiverAccountNumber
        );

        // Construir la nueva lista
        let sortedList = [];

        if (sender) {
            sortedList.push(sender);
        }
        if (receiver) {
            sortedList.push(receiver);
        }

        return sortedList.concat(remainingCustomers);
    };

    const sortedCustomers = getSortedCustomers();

    return (
        <div>
            <h1 style={{ marginBottom: '5px' }}>
                <span style={{ marginRight: '10px', fontSize: '1.5em', verticalAlign: 'middle' }}>
                    <img src={transferIcon} alt="Transferencias" style={{ width: '40px', height: '40px' }} />
                </span>
                Transferencias
            </h1>
            <p style={{ color: 'var(--secondary-color)', marginBottom: '30px' }}>Realizar transferencias entre cuentas</p>

            <div style={{ display: 'flex', gap: '30px' }}>

                <div style={{ flex: 1.5 }}>
                    <div className="card-style">
                        <h4>Nueva Transferencia</h4>
                        <p style={{ color: 'var(--secondary-color)', fontSize: '0.9em', marginBottom: '25px' }}>
                            Complete los datos para realizar una transferencia
                        </p>

                        <form onSubmit={handleTransferSubmit}>

                            <label>Cuenta de Origen</label>
                            <select
                                name="senderAccountNumber"
                                value={transferData.senderAccountNumber}
                                onChange={handleTransferChange}
                                required
                            >
                                <option value="" disabled>Seleccione cuenta de origen</option>
                                {customers.map(c => (
                                    <option key={c.accountNumber} value={c.accountNumber}>
                                        {c.accountNumber}
                                    </option>
                                ))}
                            </select>
                            {validationErrors.senderAccountNumber && <p className="error-message">{validationErrors.senderAccountNumber}</p>}

                            <label>Cuenta de Destino</label>
                            <select
                                name="receiverAccountNumber"
                                value={transferData.receiverAccountNumber}
                                onChange={handleTransferChange}
                                required
                            >
                                <option value="" disabled>Seleccione cuenta de destino</option>
                                {customers.filter(c => c.accountNumber !== transferData.senderAccountNumber).map(c => (
                                    <option key={c.accountNumber} value={c.accountNumber}>
                                        {c.accountNumber}
                                    </option>
                                ))}
                            </select>
                            {validationErrors.receiverAccountNumber && <p className="error-message">{validationErrors.receiverAccountNumber}</p>}

                            <label>Monto a Transferir</label>
                            <input
                                name="amount"
                                type="number"
                                placeholder="$ 0.00"
                                value={transferData.amount || ''}
                                onChange={handleTransferChange}
                                required
                                min="1"
                                step="0.01"
                            />
                            {validationErrors.amount && <p className="error-message">{validationErrors.amount}</p>}

                            <button type="submit" className="btn-primary-style" style={{ width: '100%', marginTop: '30px' }}>
                                Realizar Transferencia
                            </button>
                        </form>
                    </div>

                    {message && (
                        <div className={message.startsWith('Error') ? 'alert-danger' : 'alert-success'}>
                            {message}
                        </div>
                    )}
                </div>

                <div style={{ flex: 1 }}>
                    <div className="card-style">
                        <h4>Resumen de Cuentas</h4>
                        <p style={{ color: 'var(--secondary-color)', fontSize: '0.9em', marginBottom: '20px' }}>
                            Saldos actuales de todas las cuentas
                        </p>

                        <div
                            style={{
                                maxHeight: '400px',
                                overflowY: 'auto',
                                marginTop: '20px',
                                paddingRight: '10px'
                            }}
                        >
                            {sortedCustomers.map(c => (
                                <div
                                    key={c.accountNumber}
                                    style={{
                                        padding: '15px 0',
                                        borderBottom: '1px solid #eee',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '15px' ,
                                        backgroundColor: (c.accountNumber === transferData.senderAccountNumber || c.accountNumber === transferData.receiverAccountNumber)
                                            ? '#f0f8ff'
                                            : 'transparent',
                                        transition: 'background-color 0.3s'
                                    }}
                                >
                                    <div>
                                        <p style={{ fontWeight: 'bold', margin: '0' }}>{c.firstName} {c.lastName}</p>
                                        <p style={{ margin: '0', fontSize: '0.9em', color: 'var(--secondary-color)' }}>Cuenta: {c.accountNumber}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ margin: '0', fontWeight: 'bold', color: 'var(--text-color)' }}>
                                            ${formatBalance(c.balance)} US$
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {customers.length === 0 && <p style={{ color: 'var(--secondary-color)' }}>No hay cuentas registradas.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default TransactionPage;