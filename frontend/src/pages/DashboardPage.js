import React from 'react';
import { useCustomerContext } from '../context/CustomerContext';

import '../styles/Dashboard.css';
import usersIcon from '../assets/users.png';
import moneyIcon from '../assets/money.png';
import averageIcon from '../assets/average.png';
import totalIcon from '../assets/total.png';
import bankIcon from '../assets/bank.png';


const DashboardPage = () => {
    const { stats } = useCustomerContext();

    if (!stats) {
        return <p style={{ color: 'var(--secondary-color)', textAlign: 'center', marginTop: '50px' }}>Cargando estadísticas del sistema...</p>;
    }

    const formatCurrency = (amount) => {
        if (!amount) return '0.00 US$';
        return parseFloat(amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + ' US$';
    };

    const formatNumber = (num) => {
        return num.toLocaleString('en-US');
    }

    // Definición de las tarjetas de estadísticas
    const statCards = [
        {
            title: "Total de Clientes",
            value: formatNumber(stats.totalCustomers),
            icon: <img src={usersIcon} alt="Clientes" style={{ width: '60px', height: '60px' }} />,
            colorStyle: { backgroundColor: '#fff', border:'3px solid var(--primary-color)',  color: '#000' }
        },
        {
            title: "Saldo Total en Cuentas",
            value: formatCurrency(stats.totalBalance),
            icon: <img src={moneyIcon} alt="Saldo Total" style={{ width: '60px', height: '60px' }} />,
            colorStyle: { backgroundColor: '#fff', border: '3px solid #3498db', color: '#000' }
        },
        {
            title: "Saldo Promedio por Cuenta",
            value: formatCurrency(stats.averageBalance),
            icon: <img src={averageIcon} alt="Saldo Promedio" style={{ width: '60px', height: '60px' }} />,
            colorStyle: { backgroundColor: '#fff', border: '3px solid #2ecc71', color: '#000' }
        },
        {
            title: "Total de Transacciones",
            value: formatNumber(stats.totalTransactions),
            icon: <img src={totalIcon} alt="Transacciones" style={{ width: '60px', height: '60px' }} />,
            colorStyle: { backgroundColor: '#fff', border: '3px solid #f39c12', color: '#000' }
        }
    ];

    const visionGeneralText =
        stats.totalTransactions > 0
            ? `El sistema ha gestionado un total de **${formatNumber(stats.totalTransactions)}** movimientos. Actualmente servimos a **${formatNumber(stats.totalCustomers)}** clientes, demostrando una solidez financiera con **${formatCurrency(stats.totalBalance)}** en activos.`
            : `El sistema está en línea y listo para operar. Actualmente servimos a **${formatNumber(stats.totalCustomers)}** clientes. Realice su primera transferencia para comenzar a registrar actividad.`;

    return (
        <div>
            {/* Encabezado de la página */}
            <h1 style={{ marginBottom: '5px' }}>
                <span style={{ marginRight: '10px', fontSize: '1.5em', verticalAlign: 'middle' }}>
                    <img src={bankIcon} alt="Dashboard" style={{ width: '40px', height: '40px' }} />
                </span>
                Dashboard
            </h1>
            <p style={{ color: 'var(--secondary-color)', marginBottom: '30px' }}>Resumen y estadísticas principales del sistema bancario</p>

            {/* Contenedor de las Tarjetas */}
            <div className="dashboard-card-container">
                {statCards.map((card, index) => (
                    <div key={index} className="dashboard-card" style={card.colorStyle}>
                        <div className="dashboard-card-icon">{card.icon}</div>
                        <div>
                            <p className="dashboard-card-title">{card.title}</p>
                            <h2 className="dashboard-card-value">{card.value}</h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* Visión General */}
            <h3 style={{marginTop: '40px', marginBottom: '15px'}}>Visión General</h3>
            <div className="card-style">
                <p
                    style={{ color: 'var(--secondary-color)' }}
                    dangerouslySetInnerHTML={{ __html: visionGeneralText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                />
            </div>
        </div>
    );
};

export default DashboardPage;