// src/components/Table.js

import React from 'react';

const Table = ({ data, columns }) => {
    if (!data || data.length === 0) {

        return <div className="alert alert-info">No hay datos disponibles.</div>;
    }

    return (

        <table className="table table-striped table-hover shadow-sm">
            {/* --- Encabezados (Header) --- */}
            <thead>
            {/* Eliminamos el estilo en línea de la fila */}
            <tr>
                {columns.map((column, index) => (
                    <th
                        key={index}
                        scope="col"
                    >
                        {column.header}
                    </th>
                ))}
            </tr>
            </thead>
            {/* --- Filas de Datos (Body) --- */}
            <tbody>
            {data.map((item, rowIndex) => (
                // Eliminamos el estilo en línea de la fila
                <tr key={rowIndex}>
                    {columns.map((column, colIndex) => {
                        // Acceder al valor usando la clave (accessor)
                        let value = item[column.accessor];

                        // Formatear el saldo como moneda
                        if (column.accessor === 'balance' || column.accessor === 'amount') {
                            value = `$${Number(value).toFixed(2)}`;
                        }

                        return (
                            // Eliminamos los estilos en línea de la celda
                            <td key={colIndex}>
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