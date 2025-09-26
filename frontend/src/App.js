import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import CustomerPage from './pages/CustomerPage';
import TransactionPage from './pages/TransactionPage';
import HistoryPage from "./pages/HistoryPage";
import DashboardPage from "./pages/DashboardPage";
import './styles/Global.css';
import './styles/Sidebar.css';
import homeIcon from './assets/home.png';
import usersIcon from './assets/usersNV.png';
import transferIcon from './assets/transferNV.png';
import historyIcon from './assets/history.png';

function App() {
    return (
        <div className="sidebar-layout">
            <div className="sidebar">
                <h2>Banco Digital</h2>
                <ul className="nav-links-list">
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) => (isActive ? 'active-link' : '')}
                        >
                            <img src={homeIcon} alt="Dashboard" style={{ width: '30px', height: '30px', marginLeft: '8px', verticalAlign: 'middle' }} />
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/clientes"
                            className={({ isActive }) => (isActive ? 'active-link' : '')}
                        >
                            <img src={usersIcon} alt="Clientes" style={{ width: '30px', height: '30px', marginLeft: '8px', verticalAlign: 'middle' }} />
                            Gestión de Clientes
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/transferencias"
                            className={({ isActive }) => (isActive ? 'active-link' : '')}
                        >
                            <img src={transferIcon} alt="Transferencias" style={{ width: '30px', height: '30px', marginLeft: '8px', verticalAlign: 'middle' }} />
                            Transferencias
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/historial"
                            className={({ isActive }) => (isActive ? 'active-link' : '')}
                        >
                            <img src={historyIcon} alt="Historial" style={{ width: '30px', height: '30px', marginLeft: '8px', verticalAlign: 'middle' }} />
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