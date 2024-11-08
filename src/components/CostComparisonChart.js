import React from 'react';
import { Line, Bar } from 'react-chartjs-2'; // Asegúrate de importar Bar aquí
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const CostComparisonChart = ({ resultados,parametros }) => {

    const { costosDesplazamiento, costoMaximo} = parametros;
    const { costoTotal } = resultados;

    if (!costosDesplazamiento || costosDesplazamiento.length === 0) {
        return <div>No hay datos de costos de desplazamiento para mostrar</div>;
    }

    // Calcular el costo total por opinión
    const costosTotales = costosDesplazamiento.map(fila => fila.reduce((acc, costo) => acc + costo, 0));
    const labels = costosTotales.map((_, index) => `Opinión ${index + 1}`);

    // Configuración de datos para el gráfico de líneas
    const chartData = {
        labels,
        datasets: [
            {
                label: 'Costo Total de Desplazamiento por Opinión',
                data: costosTotales,
                borderColor: 'rgba(75, 192, 192, 0.6)',
                fill: false,
            },
            {
                label: 'Costo Máximo Permitido',
                data: Array(costosTotales.length).fill(costoMaximo),
                borderColor: 'rgba(255, 99, 132, 0.6)',
                borderDash: [5, 5],
                fill: false,
            },
        ],
    };

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
                <h3>Comparación de Costos de Desplazamiento y Costo Máximo</h3>
                <Line 
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: 'Costo de Desplazamiento por Opinión' },
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
                                    text: 'Costo',
                                },
                            },
                        },
                    }}
                />
            </div>
    
            <div style={{ width: '600px', height: '400px', margin: '0 auto' }}>
                <h3>Comparación de Costo Máximo y Costo Total Final</h3>
                <Bar 
                    data={costosChartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: 'Comparación de Costos' },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Tipo de Costo',
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Costo',
                                },
                                beginAtZero: true,
                            },
                        },
                    }}
                />
            </div>
        </div>
    );    
};

export default CostComparisonChart;
