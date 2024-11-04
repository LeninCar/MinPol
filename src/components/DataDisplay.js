import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './DataDisplay.css';
import { parseMPLFile, sendDataToBackend } from '../services/apiService';

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
    const [output, setOutput] = useState("");

    const [showGraphButton, setShowGraphButton] = useState(false);

    const navigate = useNavigate();

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        
        try {
            const parsedData = await parseMPLFile(file); // Llama al servicio para procesar el archivo
            setData(parsedData);
        } catch (error) {
            console.error("Error al leer el archivo:", error);
        }
    };

    const [outputJson, setOutputJson] = useState(null);
    
    const convertirOutputAJson = (output) => {
        const resultado = {};
    
        // Separar las secciones del texto
        const secciones = output.trim().split('\n\n').map(s => s.trim());
    
        // Procesar la sección de distribución final de opiniones
        const distribucion = {};
        secciones[0]
            .split('\n')
            .slice(1) // Ignora el encabezado
            .forEach(line => {
                const [opinion, valor] = line.split(': ').map(s => s.trim());
                distribucion[opinion] = parseInt(valor, 10);
            });
        resultado.distribucionFinal = distribucion;
    
        // Procesar la sección de movimientos realizados
        const movimientos = [];
        secciones[1]
            .split('\n')
            .slice(1) // Ignora el encabezado
            .forEach(line => {
                const match = line.match(/De (\d+) a (\d+): (\d+)/);
                if (match) {
                    movimientos.push({
                        i: parseInt(match[1], 10),
                        j: parseInt(match[2], 10),
                        value: parseInt(match[3], 10)
                    });
                }
            });
        resultado.movimientosRealizados = movimientos;
    
        // Procesar los valores finales de polarización, costo total y mediana ponderada
        secciones[2]
            .split('\n')
            .forEach(line => {
                const [clave, valor] = line.split(': ').map(s => s.trim());
                if (clave === 'Polarización final') {
                    resultado.polarizacionFinal = parseFloat(valor);
                } else if (clave === 'Costo total') {
                    resultado.costoTotal = parseFloat(valor);
                } else if (clave === 'Mediana ponderada') {
                    resultado.medianaPonderada = parseFloat(valor);
                }
            });
    
        return resultado;
    };

    const handleShowGraphs = () => {
        navigate('/grafics', { state: { resultados: outputJson, parametros: data } });
    };
    const handleSendData = async () => {
        try {
            const result = await sendDataToBackend(data);
            
            // Actualiza el estado con el resultado recibido
            setOutput(result.output);
            setShowGraphButton(true);
    
            // Realiza la conversión a JSON directamente usando result.output
            const json = convertirOutputAJson(result.output);
            setOutputJson(json); // Guarda el JSON en el estado
            console.log(json);    // Muestra el JSON en la consola
    
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    return (
        <div className="data-display-container">
            <Typography variant="h6" gutterBottom>Opiniones de Población</Typography>
            <div className="button-container">
                <Button
                    variant="contained"
                    color="primary"
                    component="label"
                >
                    Cargar archivo .mpl
                    <input
                        type="file"
                        accept=".mpl"
                        hidden
                        onChange={handleFileUpload}
                    />
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendData}
                    disabled={data.totalPersonas === 0}
                >
                    Calcular
                </Button>
            </div>

            {data.totalPersonas > 0 && (
                <div className="main-container">
                    {/* Primera fila */}
                    <div className="row-container">
                        <div className="column">
                            <Typography variant="body1" gutterBottom>Distribución de Población por Opinión</Typography>
                            <TableContainer component={Paper} className="scrollable-table-container">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Núm. personas</TableCell>
                                            <TableCell>Opinión</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.distribucion.map((num, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{num}</TableCell>
                                                <TableCell>{index + 1}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <div className="column">
                            <div>
                                <Typography variant="body1" gutterBottom>Costo Máximo Permitido y Máximo de Movimientos</Typography>
                                <Typography variant="body2">Costo máximo permitido: {data.costoMaximo}</Typography>
                                <Typography variant="body2">Máximo de movimientos: {data.maxMovimientos}</Typography>
                                {output && (
                                    <div className="output-container">
                                        <Typography variant="body1" gutterBottom>Resultado de MiniZinc</Typography>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={handleShowGraphs}
                                        >
                                            Ver Gráficos
                                        </Button>
                                    </div>
                                )}
                                {output && (
                                    <Typography variant="body2" component="pre">{output}</Typography>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Segunda fila */}
                    <div className="row-container">
                        <div className="column">
                            <Typography variant="body1" gutterBottom>Valores de las Opiniones Posibles</Typography>
                            <TableContainer component={Paper} className="scrollable-table-container">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Opinión</TableCell>
                                            <TableCell>Valor</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.valoresOpiniones.map((valor, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{valor}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <div className="column">
                            <Typography variant="body1" gutterBottom>Costos de Desplazamiento entre Opiniones</Typography>
                            <TableContainer component={Paper} className="scrollable-table-container">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Opinión \\ Costo</TableCell>
                                            {[...Array(data.opinionesPosibles)].map((_, index) => (
                                                <TableCell key={index}>op. {index + 1}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.costosDesplazamiento.map((fila, i) => (
                                            <TableRow key={i}>
                                                <TableCell>op. {i + 1}</TableCell>
                                                {fila.map((costo, j) => (
                                                    <TableCell key={j}>{costo}</TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataDisplay;
