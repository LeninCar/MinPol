import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const CostComparisonChart = ({ parametros }) => {
    const { costosDesplazamiento, costoMaximo } = parametros;

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

    return (
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
    );
};

export default CostComparisonChart;
