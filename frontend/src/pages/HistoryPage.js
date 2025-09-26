import React, { useState } from 'react';
import { useTransactionContext } from '../context/TransactionContext';
import { useCustomerContext } from '../context/CustomerContext';
import HistoryIcon from '../assets/reloj.png';
import SearchIcon from '../assets/searchW.png';

const HistoryPage = () => {
    const { history, loadHistory, loadHistoryForAccount } = useTransactionContext();
    const { customers } = useCustomerContext();

    // Estados para la búsqueda
    const [searchTerm, setSearchTerm] = useState(''); // Lo que el usuario escribe

    // --- Helpers ---
    const getCustomerName = (accountNumber) => {
        const customer = customers.find(c => c.accountNumber === accountNumber);
        return customer ? `${customer.firstName} ${customer.lastName}` : 'N/A';
    };

    const formatAmount = (amount) => {
        return amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };
    // --- Fin Helpers ---

    // Manejador de Búsqueda
    const handleSearch = () => {
        const term = searchTerm.trim();

        loadHistoryForAccount(term);
    };

    // Lógica de Ordenamiento
    const hasTransactions = history && history.length > 0;

    const sortedTransactions = [...(history || [])]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const transactionsToDisplay = sortedTransactions;
    const hasResultsToDisplay = transactionsToDisplay.length > 0;
    const displaySearchTerm = hasTransactions && transactionsToDisplay.length === 0 && searchTerm.trim() !== '';

    return (
        <div>
            {/* Encabezado */}
            <h1 style={{ marginBottom: '5px' }}>
                <span style={{ marginRight: '10px', fontSize: '1.5em', verticalAlign: 'middle' }}>
                    <img src={HistoryIcon} alt="Historial" style={{ width: '40px', height: '40px' }} />
                </span>
                Historial de Transacciones
            </h1>
            <p style={{ color: 'var(--secondary-color)', marginBottom: '30px' }}>Buscar y consultar el historial de transacciones por cuenta</p>

            {/* BUSCAR TRANSACCIONES */}
            <div className="card-style" style={{ marginBottom: '30px' }}>
                <h4>Buscar Transacciones</h4>
                <p style={{ color: 'var(--secondary-color)', fontSize: '0.9em', marginBottom: '15px' }}>
                    Ingrese el número de cuenta para ver su historial de transacciones
                </p>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <input
                        type="text"
                        name="accountNumberSearch"
                        placeholder="Ingrese el número de cuenta"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flexGrow: 1, margin: 0 }}
                    />
                    <button
                        onClick={handleSearch}
                        className="btn-primary-style"
                        style={{ padding: '12px 15px', display: 'flex', alignItems: 'center' }}
                    >
                        <span style={{ marginRight: '5px', fontSize: '1.2em' }}>
                            <img src={SearchIcon} alt="Buscar" style={{ width: '20px', height: '20px' }} />
                        </span> Buscar
                    </button>
                </div>
            </div>

            {/* TODAS LAS TRANSACCIONES */}
            <div className="card-style">
                <h4 style={{ marginBottom: '10px' }}>Total de Transacciones: {history.length}</h4>
                <p style={{ color: 'var(--secondary-color)', fontSize: '0.9em', marginBottom: '25px' }}>
                    Historial completo de todas las transacciones en el sistema
                </p>

                {!hasTransactions && <p style={{ color: 'var(--secondary-color)' }}>No se ha registrado ninguna transacción todavía.</p>}

                {/* Mensaje de error cuando la búsqueda no encuentra nada */}
                {displaySearchTerm && (
                    <p className="alert-danger">No se encontraron transacciones para la cuenta **{searchTerm.trim()}**.</p>
                )}

                {hasResultsToDisplay && (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={styles.table}>
                            <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Cuenta Origen</th>
                                <th style={styles.th}>Cuenta Destino</th>
                                <th style={styles.th}>Monto</th>
                                <th style={styles.th}>Estado</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactionsToDisplay.map((tx, index) => {
                                const txId = index + 1;
                                const isSuccess = true;
                                const stateBackgroundColor = isSuccess ? '#1E1E1E' : 'var(--danger-color)';
                                const stateTextColor = isSuccess ? '#FFFFFF' : stateBackgroundColor;

                                return (
                                    <tr key={txId} style={styles.tr}>
                                        <td style={styles.td}>{txId}</td>

                                        <td style={styles.td}>
                                            <div style={{ fontWeight: 'bold' }}>{tx.senderAccountNumber}</div>
                                            <div style={{ fontSize: '0.8em', color: 'var(--secondary-color)' }}>{getCustomerName(tx.senderAccountNumber)}</div>
                                        </td>

                                        <td style={styles.td}>
                                            <div style={{ fontWeight: 'bold' }}>{tx.receiverAccountNumber}</div>
                                            <div style={{ fontSize: '0.8em', color: 'var(--secondary-color)' }}>{getCustomerName(tx.receiverAccountNumber)}</div>
                                        </td>

                                        <td style={{ ...styles.td, fontWeight: 'bold' }}>
                                            {formatAmount(tx.amount)} US$
                                        </td>

                                        <td style={styles.td}>
                                                <span style={{
                                                    backgroundColor: stateBackgroundColor,
                                                    color: stateTextColor,
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.85em',
                                                    display: 'inline-block'
                                                }}>
                                                    Exitosa
                                                </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

// Estilos específicos para la tabla
const styles = {
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
        textAlign: 'left',
    },
    th: {
        padding: '12px 15px',
        borderBottom: '2px solid #ddd',
        fontWeight: '600',
        fontSize: '0.9em',
        color: 'var(--secondary-color)',
        textTransform: 'uppercase',
    },
    td: {
        padding: '15px',
        borderBottom: '1px solid #eee',
        verticalAlign: 'middle',
    },
    tr: {},
};

export default HistoryPage;