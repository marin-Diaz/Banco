// src/components/Table.js

import React from 'react';

/**
 * Componente genérico para renderizar tablas.
 * @param {Array<Object>} data - La lista de objetos a mostrar (ej. clientes o transacciones).
 * @param {Array<Object>} columns - La configuración de las columnas.
 * Formato: [{ header: 'Encabezado', accessor: 'key' }, ...]
 */
const Table = ({ data, columns }) => {
    if (!data || data.length === 0) {
        return <p>No hay datos disponibles.</p>;
    }

    return (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            {/* --- Encabezados (Header) --- */}
            <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
                {columns.map((column, index) => (
                    <th
                        key={index}
                        style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}
                    >
                        {column.header}
                    </th>
                ))}
            </tr>
            </thead>
            {/* --- Filas de Datos (Body) --- */}
            <tbody>
            {data.map((item, rowIndex) => (
                <tr key={rowIndex} style={{ borderBottom: '1px solid #ddd' }}>
                    {columns.map((column, colIndex) => {
                        // Acceder al valor usando la clave (accessor)
                        let value = item[column.accessor];

                        // Formatear el saldo como moneda si es el campo 'balance'
                        if (column.accessor === 'balance' || column.accessor === 'amount') {
                            value = `$${Number(value).toFixed(2)}`;
                        }

                        return (
                            <td
                                key={colIndex}
                                style={{ padding: '8px', border: '1px solid #ddd' }}
                            >
                                {value}
                            </td>
                        );
                    })}
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default Table;