import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';

// Función para leer el archivo como texto usando Promesas y FileReader
const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
};

// Contenedor principal que organiza el contenido en filas, ajustado
const MainContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: '16px', 
    padding: '16px', 
    marginTop: '16px', 
    fontSize: '0.85em' 
});

// Contenedor para cada fila
const RowContainer = styled('div')({
    display: 'flex',
    gap: '16px', 
    width: '100%',
});

// Contenedor para las columnas izquierda y derecha
const Column = styled('div')({
    flex: '1',
});

// Estilos personalizados para cada tabla con scroll y limitación de ancho
const ScrollableTableContainer = styled(TableContainer)(({ theme }) => ({
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.15)',
    borderRadius: '8px',
    padding: '8px', 
    maxHeight: '225px', 
    overflowY: 'auto',
    overflowX: 'auto',
    maxWidth: 'calc(40vw)', 
    width: '100%',
}));

const SmallTableCell = styled(TableCell)({
    fontSize: '0.75rem', 
    padding: '3px 6px', 
});

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
    const [showGraphButton, setShowGraphButton] = useState(false); // Estado para controlar el botón de gráficos

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
            if (response.ok) { 
                setOutput(result.output);
                setShowGraphButton(true); // Mostrar el botón de gráficos cuando se obtiene el resultado
            } else {
                console.error("Error:", result.detail);
            }
        } catch (error) {
            console.error("Error al enviar datos al backend:", error);
        }
    };

    return (
        <div style={{ padding: '16px' }}>
            <Typography variant="h6" gutterBottom>Opiniones de Población</Typography>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    component="label"
                    style={{ fontSize: '0.85em' }}
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
                    style={{ fontSize: '0.85em' }}
                >
                    Calcular
                </Button>
            </div>

            {data.totalPersonas > 0 && (
                <MainContainer>
                    {/* Primera fila */}
                    <RowContainer>
                        <Column>
                            <ScrollableTableContainer component={Paper}>
                                <Typography variant="body1" gutterBottom>Distribución de Población por Opinión</Typography>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <SmallTableCell>Núm. personas</SmallTableCell>
                                            <SmallTableCell>Opinión</SmallTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.distribucion.map((num, index) => (
                                            <TableRow key={index}>
                                                <SmallTableCell>{num}</SmallTableCell>
                                                <SmallTableCell>{index + 1}</SmallTableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollableTableContainer>
                        </Column>
                        <Column>
                            <div>
                                <Typography variant="body1" gutterBottom>Costo Máximo Permitido y Máximo de Movimientos</Typography>
                                <Typography variant="body2">Costo máximo permitido: {data.costoMaximo}</Typography>
                                <Typography variant="body2" style={{ marginBottom: '16px' }}>Máximo de movimientos: {data.maxMovimientos}</Typography>
                                {output && (
                                    <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Typography variant="body1" gutterBottom style={{ margin: 0 }}>Resultado de MiniZinc</Typography>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            style={{ fontSize: '0.75em', marginLeft: '120px' }}
                                            onClick={() => console.log('Mostrar gráficos')} // Acción del botón de gráficos
                                        >
                                            Ver Gráficos
                                        </Button>
                                    </div>
                                )}
                                {output && (
                                    <Typography variant="body2" component="pre" style={{ marginTop: '10px' }}>{output}</Typography>
                                )}
                            </div>
                        </Column>
                    </RowContainer>
                    {/* Segunda fila */}
                    <RowContainer>
                        <Column>
                            <ScrollableTableContainer component={Paper}>
                                <Typography variant="body1" gutterBottom>Valores de las Opiniones Posibles</Typography>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <SmallTableCell>Opinión</SmallTableCell>
                                            <SmallTableCell>Valor</SmallTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.valoresOpiniones.map((valor, index) => (
                                            <TableRow key={index}>
                                                <SmallTableCell>{index + 1}</SmallTableCell>
                                                <SmallTableCell>{valor}</SmallTableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollableTableContainer>
                        </Column>
                        <Column>
                            <ScrollableTableContainer
                                component={Paper}
                                style={{
                                    overflowX: data.opinionesPosibles > 5 ? 'auto' : 'hidden',
                                    width: '100%',
                                }}
                            >
                                <Typography variant="body1" gutterBottom>Costos de Desplazamiento entre Opiniones</Typography>
                                <Table
                                    style={{
                                        minWidth: data.opinionesPosibles > 5 ? data.opinionesPosibles * 100 : 'auto',
                                    }}
                                >
                                    <TableHead>
                                        <TableRow>
                                            <SmallTableCell>Opinión \\ Costo</SmallTableCell>
                                            {[...Array(data.opinionesPosibles)].map((_, index) => (
                                                <SmallTableCell key={index}>op. {index + 1}</SmallTableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.costosDesplazamiento.map((fila, i) => (
                                            <TableRow key={i}>
                                                <SmallTableCell>op. {i + 1}</SmallTableCell>
                                                {fila.map((costo, j) => (
                                                    <SmallTableCell key={j}>{costo}</SmallTableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollableTableContainer>
                        </Column>
                    </RowContainer>
                </MainContainer>
            )}
        </div>
    );
};

export default DataDisplay;
