import React, { useState } from 'react';
import Papa from 'papaparse';

const DataDisplay = () => {
    const [data, setData] = useState({
        totalPersonas: 0,
        opinionesPosibles: 0,
        distribucion: [],
        valoresOpiniones: [],
        costosExtras: [],
        costosDesplazamiento: [],
        costoMaximo: 0,
        maxMovimientos: 0
    });

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        Papa.parse(file, {
            complete: (result) => {
                const lines = result.data.map(line => line[0]);

                setData({
                    totalPersonas: parseInt(lines[0]),
                    opinionesPosibles: parseInt(lines[1]),
                    distribucion: lines[2].split(',').map(Number),
                    valoresOpiniones: lines[3].split(',').map(Number),
                    costosExtras: lines[4].split(',').map(Number),
                    costosDesplazamiento: lines.slice(5, 5 + parseInt(lines[1])).map(line => line.split(',').map(Number)),
                    costoMaximo: parseFloat(lines[5 + parseInt(lines[1])]),
                    maxMovimientos: parseInt(lines[6 + parseInt(lines[1])])
                });
            },
            skipEmptyLines: true
        });
    };

    return (
        <div>
            <h2>Cargar archivo de entrada</h2>
            <input type="file" accept=".mpl" onChange={handleFileUpload} />

            {data.totalPersonas > 0 && (
                <div>
                    <h3>Distribución de Población por Opinión</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Núm. personas</th>
                                <th>Opinión</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.distribucion.map((num, index) => (
                                <tr key={index}>
                                    <td>{num}</td>
                                    <td>{index + 1}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3>Valores de las Opiniones Posibles</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Opinión</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.valoresOpiniones.map((valor, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{valor}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3>Costos de Desplazamiento entre Opiniones</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Opinión \\ Costo</th>
                                {[...Array(data.opinionesPosibles)].map((_, index) => (
                                    <th key={index}>op. {index + 1}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.costosDesplazamiento.map((fila, i) => (
                                <tr key={i}>
                                    <td>op. {i + 1}</td>
                                    {fila.map((costo, j) => (
                                        <td key={j}>{costo}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3>Costo Máximo Permitido y Máximo de Movimientos</h3>
                    <p>Costo máximo permitido: {data.costoMaximo}</p>
                    <p>Máximo de movimientos: {data.maxMovimientos}</p>
                </div>
            )}
        </div>
    );
};

export default DataDisplay;
