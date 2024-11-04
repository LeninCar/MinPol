import React from 'react';
import { useLocation } from 'react-router-dom';
import BarChartComponent from './BarChartComponent';
import CostComparisonChart from './CostComparisonChart';

const Grafics = () => {
    const location = useLocation();
    const resultados = location.state?.resultados; // Contiene `distribucionFinal`
    const parametros = location.state?.parametros; // Contiene `distribucionInicial` y otros parámetros

    if (!resultados || !parametros) {
        return <div>No hay datos para mostrar</div>;
    }

    return (
        <div>
            <h2>Comparación de Distribuciones y Costos de Opiniones</h2>
            
            {/* Gráfico de barras para la distribución inicial y final */}
            <BarChartComponent resultados={resultados} parametros={parametros} />

            {/* Gráfico de líneas para la comparación de costos */}
            <CostComparisonChart parametros={parametros} />
        </div>
    );
};

export default Grafics;
