import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

// Función para leer el archivo como texto usando Promesas y FileReader
const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
};

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

    const logData = (data) => {
        console.log("Total de Personas:", data.totalPersonas);
        console.log("Opiniones Posibles (m):", data.opinionesPosibles);
        console.log("Distribución:", data.distribucion);
        console.log("Valores de Opiniones:", data.valoresOpiniones);
        console.log("Costos Extras:", data.costosExtras);
        console.log("Costos de Desplazamiento:", data.costosDesplazamiento);
        console.log("Costo Máximo Permitido:", data.costoMaximo);
        console.log("Máximo de Movimientos:", data.maxMovimientos);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        
        try {
            const text = await readFileAsText(file);
            const lines = text.trim().split(/\r?\n/);

            const m = parseInt(lines[1]);

            const parsedData = {
                totalPersonas: parseInt(lines[0]),
                opinionesPosibles: m,
                distribucion: lines[2].split(',').map(Number),
                valoresOpiniones: lines[3].split(',').map(Number),
                costosExtras: lines[4].split(',').map(Number),
                costosDesplazamiento: lines.slice(5, 5 + m).map(line => line.split(',').map(Number)),
                costoMaximo: parseFloat(lines[5 + m]),
                maxMovimientos: parseInt(lines[6 + m])
            };

            setData(parsedData);
            logData(parsedData);
        } catch (error) {
            console.error("Error al leer el archivo:", error);
        }
    };

    const sendDataToBackend = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/process-data/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log("Respuesta del backend:", result);
        } catch (error) {
            console.error("Error al enviar datos al backend:", error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Opiniones de Población</Typography>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
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
                    onClick={sendDataToBackend}
                    disabled={data.totalPersonas === 0}
                >
                    Calcular
                </Button>
            </div>

            {data.totalPersonas > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <Typography variant="h5" gutterBottom>Distribución de Población por Opinión</Typography>
                    <TableContainer component={Paper}>
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

                    <Typography variant="h5" gutterBottom>Valores de las Opiniones Posibles</Typography>
                    <TableContainer component={Paper}>
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

                    <Typography variant="h5" gutterBottom>Costos de Desplazamiento entre Opiniones</Typography>
                    <TableContainer component={Paper}>
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

                    <Typography variant="h5" gutterBottom>Costo Máximo Permitido y Máximo de Movimientos</Typography>
                    <Typography variant="body1">Costo máximo permitido: {data.costoMaximo}</Typography>
                    <Typography variant="body1">Máximo de movimientos: {data.maxMovimientos}</Typography>
                </div>
            )}
        </div>
    );
};

export default DataDisplay;
