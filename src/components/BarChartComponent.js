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

    // Configuración de los datos para el gráfico de barras
    const chartData = {
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

    return (
        <div style={{ width: '600px', height: '400px', margin: '0 auto' }}>
            <h3>Distribución Inicial y Final de Opiniones</h3>
            <Bar 
                data={chartData}
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
                        },
                    },
                }}
            />
        </div>
    );
};

export default BarChartComponent;
