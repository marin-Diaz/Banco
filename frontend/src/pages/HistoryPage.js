

import React, { useState } from 'react';
import { useTransactionContext } from '../context/TransactionContext';
import { useCustomerContext } from '../context/CustomerContext';
import historyIcon from '../assets/history.png';
import searchIcon from '../assets/searchW.png';

const HistoryPage = () => {
    const { history } = useTransactionContext();
    const { customers } = useCustomerContext();

    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearchTerm, setAppliedSearchTerm] = useState('');

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

    const handleSearch = () => {
        setAppliedSearchTerm(searchTerm.trim());
    };

    // Lógica de Filtrado y Ordenamiento
    const hasTransactions = history && history.length > 0;

    const sortedTransactions = [...(history || [])]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const filteredTransactions = sortedTransactions.filter(tx => {
        if (!appliedSearchTerm) return true;

        return tx.senderAccountNumber.includes(appliedSearchTerm) || tx.receiverAccountNumber.includes(appliedSearchTerm);
    });

    const hasFilteredResults = filteredTransactions.length > 0;

    return (
        <div>
            {/* Encabezado */}
            <h1 style={{ marginBottom: '5px' }}>
                <span style={{ marginRight: '10px', fontSize: '1.5em', verticalAlign: 'middle' }}>
                    <img src={historyIcon} alt="Historial" style={{ width: '40px', height: '40px' }} />
                </span>
                Historial de Transacciones
            </h1>
            <p style={{ color: 'var(--secondary-color)', marginBottom: '30px' }}>Buscar y consultar el historial de transacciones por cuenta</p>

            {/* SECCIÓN 1: BUSCAR TRANSACCIONES */}
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
                            <img src={searchIcon} alt={"Buscar" } style={{ width: '20px', height: '20px' }} />
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

                {/* --- RENDERING CONDICIONAL DE LA TABLA --- */}
                {!hasTransactions && <p style={{ color: 'var(--secondary-color)' }}>No se ha registrado ninguna transacción todavía.</p>}

                {hasTransactions && !hasFilteredResults && appliedSearchTerm && (
                    <p className="alert-danger">No se encontraron transacciones para la cuenta **{appliedSearchTerm}**.</p>
                )}

                {hasFilteredResults && (
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
                            {filteredTransactions.map((tx, index) => {
                                const txId = index + 1;
                                const isSuccess = true;

                                // DEFINICIÓN DE COLORES PARA EL BADGE
                                const stateBackgroundColor = isSuccess ? '#1E1E1E' : 'var(--danger-color)'; // Fondo oscuro para Exitosa
                                const stateTextColor = isSuccess ? '#FFFFFF' : stateBackgroundColor; // Texto blanco

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

// Estilos específicos para la tabla (sin cambios)
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