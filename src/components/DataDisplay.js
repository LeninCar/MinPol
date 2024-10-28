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

    // Función para mostrar los valores almacenados en las variables de data en la consola
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
            // Leer el archivo completo como texto
            const text = await readFileAsText(file);
            const lines = text.trim().split(/\r?\n/); // Dividir en líneas

            const m = parseInt(lines[1]); // Número de opiniones (m)

            // Procesar cada línea de acuerdo con su estructura en el archivo
            const parsedData = {
                totalPersonas: parseInt(lines[0]),  // Número total de personas
                opinionesPosibles: m,               // Número de posibles opiniones
                distribucion: lines[2].split(',').map(Number),  // Distribución de personas por opinión
                valoresOpiniones: lines[3].split(',').map(Number),  // Valores de cada opinión
                costosExtras: lines[4].split(',').map(Number),  // Costos extra asociados a cada opinión
                costosDesplazamiento: lines.slice(5, 5 + m).map(line => line.split(',').map(Number)),  // Matriz de costos de desplazamiento
                costoMaximo: parseFloat(lines[5 + m]),  // Costo máximo permitido
                maxMovimientos: parseInt(lines[6 + m])  // Máximo de movimientos permitidos
            };

            // Actualizar el estado con los datos parseados
            setData(parsedData);
            logData(parsedData); // Llamada a logData para mostrar los datos en consola
        } catch (error) {
            console.error("Error al leer el archivo:", error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Opiniones de Población</Typography>
            <Button
                variant="contained"
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
