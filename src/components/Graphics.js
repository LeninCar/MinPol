import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BarChartComponent from './BarChartComponent';
//import CostComparisonChart from './CostComparisonChart';

import './Graphics.css'; // Importa el archivo CSS

const Graphics = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const resultados = location.state?.resultados;
    const parametros = location.state?.parametros;

    useEffect(() => {
        // Simulamos un tiempo de carga
        setTimeout(() => setLoading(false), 1000);
    }, []);

    if (loading) {
        return <div className="loading-container">Cargando...</div>;
    }

    if (!resultados || !parametros) {
        return <div>No hay datos para mostrar</div>;
    }

    return (
        <div>
            <h2>Comparación de Distribuciones y Costos de Opiniones</h2>
            <BarChartComponent resultados={resultados} parametros={parametros} />
            {/* <CostComparisonChart parametros={parametros} /> */}
        </div>
    );
};

export default Graphics;