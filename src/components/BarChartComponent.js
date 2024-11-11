import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Registra los módulos necesarios para el gráfico de barras
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BarChartComponent = ({ resultados, parametros }) => {
    const distribucionInicial = parametros.distribucion || [];      // Distribución inicial
    const distribucionFinal = resultados.distribucionFinal || {};   // Distribución final
    const movimientos = resultados.movimientosRealizados || {};   // Movimientos realizados
    const costoMaximo = parametros.costoMaximo || 0;                // Costo máximo permitido
    const costoTotal = resultados.costoTotal || 0;                  // Costo total final


    // Configuración de los datos para el gráfico de barras
    const opinionChartData = {
        labels: Object.keys(distribucionFinal), // Etiquetas (Opinión 1, Opinión 2, etc.)
        datasets: [
            {
                label: 'Distribución Inicial',
                data: distribucionInicial,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Distribución Final',
                data: Object.values(distribucionFinal),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
        ],
    };

    // // Configuración de los datos para el gráfico de movimientos
    // const movimientosLabels = movimientos.map(mov => `De ${mov.i} a ${mov.j}`);
    // const movimientosData = movimientos.map(mov => mov.value);
    
    // const movimientosChartData = {
    //     labels: movimientosLabels,
    //     datasets: [
    //         {
    //             label: 'Cantidad de Movimientos',
    //             data: movimientosData,
    //             backgroundColor: 'rgba(54, 162, 235, 0.6)',
    //         },
    //     ],
    // };

    // Configuración de los datos para el gráfico de Comparación de Costos
    const costosChartData = {
        labels: ['Costo'],
        datasets: [
            {
                label: 'Costo Máximo Permitido',
                data: [costoMaximo],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
            {
                label: 'Costo Total Final',
                data: [costoTotal],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <div style={{ width: '600px', height: '400px', margin: '0 auto' }}>
                <h3>Distribución Inicial y Final de Opiniones</h3>
                <Bar 
                    data={opinionChartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: 'Comparación de Distribución Inicial y Final' },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Opinión',
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Número de Personas',
                                },
                                beginAtZero: true,
                            },
                        },
                    }}
                />
            </div>

            {/* <div style={{ width: '600px', height: '400px', margin: '0 auto' }}>
                <h3>Movimientos Realizados</h3>
                <Bar 
                    data={movimientosChartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { display: false },
                            title: { display: true, text: 'Cantidad de Movimientos Realizados' },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Movimiento',
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Cantidad',
                                },
                                beginAtZero: true,
                                ticks: {
                                    stepSize: 1, // Asegura que solo se muestren números enteros
                                    precision: 0, // Remueve cualquier decimal
                                },
                            },
                        },
                    }}
                />
            </div> */}

        </div>
    );
};

export default BarChartComponent;
