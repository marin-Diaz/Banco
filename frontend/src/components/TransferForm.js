import React, { useState } from 'react';
import { transactionService } from '../services/api';

const TransferForm = () => {
  const [formData, setFormData] = useState({
    senderAccountNumber: '',
    receiverAccountNumber: '',
    amount: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await transactionService.transferMoney(formData);
      setMessage('✅ Transferencia realizada con éxito');
      setFormData({ senderAccountNumber: '', receiverAccountNumber: '', amount: '' });
    } catch (error) {
      setMessage('❌ Error en la transferencia: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{padding: '20px', maxWidth: '500px'}}>
      <h2>💸 Realizar Transferencia</h2>
      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
        <div>
          <label>Cuenta Origen: </label>
          <input
            type="text"
            name="senderAccountNumber"
            value={formData.senderAccountNumber}
            onChange={handleChange}
            required
            style={{padding: '5px', width: '200px'}}
          />
        </div>
        <div>
          <label>Cuenta Destino: </label>
          <input
            type="text"
            name="receiverAccountNumber"
            value={formData.receiverAccountNumber}
            onChange={handleChange}
            required
            style={{padding: '5px', width: '200px'}}
          />
        </div>
        <div>
          <label>Monto: $</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            style={{padding: '5px', width: '200px'}}
          />
        </div>
        <button type="submit" style={{padding: '10px', background: '#007bff', color: 'white', border: 'none'}}>
          Transferir
        </button>
      </form>
      {message && <p style={{color: message.includes('✅') ? 'green' : 'red'}}>{message}</p>}
    </div>
  );
};

export default TransferForm;