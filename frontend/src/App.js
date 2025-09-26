
import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';

import CustomerPage from './pages/CustomerPage';
import TransactionPage from './pages/TransactionPage';
import HistoryPage from "./pages/HistoryPage";

import DashboardPage from "./pages/DashboardPage";
import dashboardIcon from './assets/home.png';
import usersIcon from './assets/usersNV.png';
import transferIcon from './assets/transferNV.png';
import historyIcon from './assets/history.png';
import bankIcon from './assets/bank.png';

import './styles/Global.css';
import './styles/Sidebar.css';

function App() {
    return (
        // Aplicar la clase principal del layout de barra lateral
        <div className="sidebar-layout">
            <div className="sidebar">
                <h2>Banco Digital</h2>

                <ul className="nav-links-list">
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) => (isActive ? 'active-link' : '')}
                        >
                            <img src={dashboardIcon} alt="Dashboard" style={{ width: '40px', marginRight: '8px' }} />
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/clientes"
                            className={({ isActive }) => (isActive ? 'active-link' : '')}
                        >
                            <img src={usersIcon} alt="Clientes" style={{ width: '40px', marginRight: '8px' }} />
                            Gestión de Clientes
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/transferencias"
                            className={({ isActive }) => (isActive ? 'active-link' : '')}
                        >
                            <img src={transferIcon} alt="Transferencias" style={{ width: '40px', marginRight: '8px' }}/>
                            Transferencias
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/historial"
                            className={({ isActive }) => (isActive ? 'active-link' : '')}
                        >
                            <img src={historyIcon} alt="Historial" style={{ width: '40px', marginRight: '8px' }} />
                            Historial
                        </NavLink>
                    </li>
                </ul>
            </div>

            <div className="content-area">
                <Routes>
                    <Route path="/" element={<DashboardPage />} />

                    <Route path="/clientes" element={<CustomerPage />} />
                    <Route path="/transferencias" element={<TransactionPage />} />
                    <Route path="/historial" element={<HistoryPage />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;