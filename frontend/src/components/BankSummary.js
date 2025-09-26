// src/components/BankSummary.js

import React from 'react';
import { useCustomerContext } from "../context/CustomerContext";

const BankSummary = () => {
    const { customers } = useCustomerContext();

    const totalClients = customers.length;
    const totalBalance = customers.reduce((sum, c) => sum + Number(c.balance), 0);
    const averageBalance = totalClients > 0 ? totalBalance / totalClients : 0;

    const formattedTotal = totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formattedAverage = averageBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Función de ayuda para crear la tarjeta de métrica
    const MetricCard = ({ title, value, unit, icon, description }) => (
        <div className="card-style" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h5 style={{ margin: 0, fontSize: '0.9em', color: 'var(--secondary-color)' }}>{title}</h5>
                <span style={{ fontSize: '1.2em', color: 'var(--primary-color)' }}>{icon}</span>
            </div>
            <div style={{ marginBottom: '10px' }}>
                <p style={{ margin: 0, fontSize: '2em', fontWeight: 'bold', lineHeight: 1 }}>{value}</p>
                <p style={{ margin: 0, fontSize: '1.2em', color: 'var(--secondary-color)' }}>{unit}</p>
            </div>
            <p style={{ margin: 0, fontSize: '0.8em', color: '#888' }}>{description}</p>
        </div>
    );

    return (
        <div style={{ marginBottom: '30px' }}>
            {/* Botón de "Sistema Activo" */}
            <div style={{ float: 'right', padding: '5px 10px', backgroundColor: 'var(--success-color)', color: 'white', borderRadius: '4px', fontSize: '0.9em', fontWeight: 'bold' }}>
                Sistema Activo
            </div>

            <h2 style={{ marginBottom: '10px' }}>Dashboard</h2>
            <p style={{ color: 'var(--secondary-color)', marginBottom: '30px' }}>Resumen general del sistema bancario</p>

            {/* Contenedor de métricas (3 columnas) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>

                <MetricCard
                    title="Total de Clientes"
                    value={totalClients}
                    unit="Cuentas registradas en el sistema"
                    icon=""
                />
                <MetricCard
                    title="Saldo Total"
                    value={`$${formattedTotal}`}
                    unit="Suma de todos los saldos"
                    icon="$"
                />
                <MetricCard
                    title="Saldo Promedio"
                    value={`$${formattedAverage}`}
                    unit="Por cuenta registrada"
                    icon=""
                />
            </div>
        </div>
    );
};

export default BankSummary;