
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // Asegúrate de tener este import
import { CustomerProvider } from './context/CustomerContext';
import { TransactionProvider } from './context/TransactionContext';
import './styles/Global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <CustomerProvider>
                <TransactionProvider>
                    <App />
                </TransactionProvider>
            </CustomerProvider>
        </BrowserRouter>
    </React.StrictMode>
);