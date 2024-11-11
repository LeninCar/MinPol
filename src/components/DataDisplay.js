import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import './DataDisplay.css';
import './Graphics.css';
import { parseMPLFile, sendDataToBackend } from '../services/apiService';
import Swal from 'sweetalert2';
import { Divider } from '@mui/material';
import BarChartComponent from './BarChartComponent';
import CostComparisonChart from './CostComparisonChart';


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
    const [totalMovimientos, setTotalMovimientos] = useState(0);
    const [output, setOutput] = useState("");

    // const [showGraphButton, setShowGraphButton] = useState(false);

    const [loading, setLoading] = useState(false)

    const [tablesVisible, setTablesVisible] = useState(false);

    // const navigate = useNavigate();

    const [fileName, setFileName] = useState("");

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];

        try {
            setFileName(file.name);
            setOutput('');
            const parsedData = await parseMPLFile(file); // Llama al servicio para procesar el archivo
            setData(parsedData);
            setTimeout(() => setTablesVisible(true), 250);
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "success",
                title: "La información se ha cargado con éxito"
            });
        } catch (error) {
            console.error("Error al leer el archivo:", error);
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "error",
                title: "Error al leer el archivo:", error
            });
        }
    };

    const [outputJson, setOutputJson] = useState(null);

    const convertirOutputAJson = (output) => {
        const resultado = {};

        // Separar las secciones del texto por saltos de línea dobles
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
                if (clave === 'Polarizacion final') {
                    resultado.polarizacionFinal = parseFloat(valor);
                } else if (clave === 'Costo total') {
                    resultado.costoTotal = parseFloat(valor);
                } else if (clave === 'Mediana ponderada') {
                    resultado.medianaPonderada = parseFloat(valor);
                }
            });

        // Procesar los valores de x desde la sección específica
        const xMatch = output.match(/x:\[([\d, ]+)\]/);
        if (xMatch && xMatch[1]) {
            resultado.x = xMatch[1].split(',').map(num => parseInt(num.trim(), 10));
        }

        return resultado;
    };

    // const handleShowGraphs = () => {
    //     navigate('/graphics', { state: { resultados: outputJson, parametros: data } });
    // };

    const handleSendData = async () => {
        setLoading(true);
        try {
            const result = await sendDataToBackend(data);

            // Actualiza el estado con el resultado recibido
            setOutput(result.output);
            // setShowGraphButton(true);

            // Realiza la conversión a JSON directamente usando result.output
            if (result.output !== "=====UNSATISFIABLE=====\n") {
                const json = convertirOutputAJson(result.output);
                console.log(json)
                setTotalMovimientos(
                    json.movimientosRealizados
                        ? json.movimientosRealizados.reduce((acc, item) => acc + (item.value || 0), 0)
                        : 0
                );
                setOutputJson(json);
                console.log(outputJson);
                console.log(json);
            }


            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "success",
                title: "La información se ha calculado con éxito"
            });

        } catch (error) {
            console.error("Error:", error.message);
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "error",
                title: error.message
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="data-display-container">
            {loading && (
                <div className="fullscreen-loader">
                    <div className="loading-animation">
                    </div>
                </div>
            )}

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
                    disabled={data.totalPersonas === 0 || loading}
                >
                    {loading ? 'Calculando...' : 'Calcular'}
                </Button>
            </div>
            <div className="data-display-container">
                {fileName ? (
                    <Typography variant="body1" gutterBottom>
                        Archivo cargado: {fileName}
                    </Typography>
                ) : (
                    <Typography variant="body1" gutterBottom>
                        Aún no hay archivos cargados.
                    </Typography>
                )}
            </div>

            {data.totalPersonas > 0 && (
                <div className={`main-container fade-in ${tablesVisible ? 'visible' : ''}`}>
                    <Divider style={{ margin: '20px 0' }} />
                    {/* Primera fila */}
                    {output && (
                        <Typography variant="h6" gutterBottom>Detalle de Resultados</Typography>
                    )}
                    
                    {output && (                                      
                        <TableContainer
                            component={Paper}
                            className="table-container"
                            style={{
                                maxWidth: '900px', // Adjust the max width based on your layout
                                margin: '0 auto', // Centers the table horizontally
                                padding: '20px', // Adds padding for spacing
                                minHeight: '300px'
                            }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <Typography variant="h6" align="center" gutterBottom>
                                                Comparación de valores
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center" style={{ width: '50px' }}>Polarización Inicial</TableCell>
                                        <TableCell align="center" style={{ width: '50px' }}>{outputJson.polarizacionFinal}</TableCell>
                                        <TableCell align="center" style={{ width: '50px' }}>Polarización Final</TableCell>
                                        <TableCell align="center" style={{ width: '50px' }}>{outputJson.polarizacionFinal}</TableCell>
                                        <TableCell align="center" style={{ width: '50px' }}>
                                            {outputJson.polarizacionFinal < 1 ? "Se disminuyó la polarización" : "No se disminuyó la polarización"}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="center" style={{ width: '50px' }}>Costo Máximo</TableCell>
                                        <TableCell align="center" style={{ width: '50px' }}>{data.costoMaximo}</TableCell>
                                        <TableCell align="center" style={{ width: '50px' }}>Costo Total</TableCell>
                                        <TableCell align="center" style={{ width: '50px' }}>{outputJson.costoTotal}</TableCell>
                                        <TableCell align="center" style={{ width: '50px' }}>
                                            {outputJson.costoTotal <= data.costoMaximo ? "Se cumplió con la restricción del costo máximo" : "No se cumplió con la restricción del costo máximo"}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="center" style={{ width: '50px' }}>Cantidad de Movimientos Máximos</TableCell>
                                        <TableCell align="center" style={{ width: '50px' }}>{data.maxMovimientos}</TableCell>
                                        <TableCell align="center" style={{ width: '50px' }}>Cantidad de Movimientos Realizados</TableCell>
                                        <TableCell align="center" style={{ width: '50px' }}>{totalMovimientos}</TableCell>
                                        <TableCell align="center" style={{ width: '50px' }}>
                                            {totalMovimientos <= data.maxMovimientos ? "Se cumplió con la restricción de cantidad de movimientos" : "No se cumplió con la restricción de cantidad de movimientos"}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {output && (
                        <div className="row-container" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <div className="column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                <BarChartComponent resultados={outputJson} parametros={data} />
                            </div>
                            <div className="column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            {outputJson.polarizacionFinal > 0 ? (
                                <span className="custom-paragraph">
                                    Este gráfico compara la distribución inicial y final de opiniones para visualizar cómo las estrategias de moderación impactan en el extremismo de la red. 
                                    La distribución inicial muestra el nivel de extremismo antes de aplicar las estrategias, mientras que la distribución final refleja el estado de la red después de la moderación.
                                </span>
                            ) : (
                                <span className="custom-paragraph">
                                    Este gráfico compara la distribución inicial y final de opiniones para visualizar cómo las estrategias de moderación impactan en el extremismo de la red. 
                                    La distribución inicial muestra el nivel de extremismo antes de aplicar las estrategias, mientras que la distribución final refleja el estado de la red después de la moderación.
                                    En este caso, se ha llegado a un consenso, esto quiere decir que nuestra polarización es 0.
                                </span>
                            )}

                        
                            </div>
                        </div>
                    )}

                    {output && (
                        <div className="row-container" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <div className="column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                <CostComparisonChart resultados={outputJson} parametros={data} />
                            </div>
                            <div className="column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                {outputJson.movimientosRealizados.length > 0 ? (
                                    <span>
                                        {outputJson.movimientosRealizados.map((movimiento, index) => (
                                            <p key={index} className="movement-paragraph">
                                                Los movimientos realizados de {movimiento.i} a {movimiento.j} fueron: {movimiento.value}
                                            </p>
                                        ))}
                                    </span>
                                ) : (
                                    <span>No se han realizado movimientos.</span>
                                )}
                            </div>
                        </div>
                    )}
                    {output && (
                        <div className="row-container" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <div className="column" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                                <TableContainer
                                    component={Paper}
                                    className="scrollable-table-container"
                                    style={{ width: '100%', maxWidth: '2100px', minHeight: '300px'}}
                                >
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center" colSpan={data.opinionesPosibles + 1}>
                                                    <Typography variant="h6" align="center" gutterBottom>
                                                        Matriz de Transición de Opiniones
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="center" style={{ width: '50px' }}>De \ A</TableCell>
                                                {/* Generar las columnas dinámicamente desde 'Opinion 1' hasta 'Opinion 5' */}
                                                {Object.keys(outputJson.distribucionFinal).map((opinion, colIndex) => (
                                                    <TableCell key={colIndex} align="center" style={{ width: '50px' }}>
                                                        {opinion}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {/* Generar las filas dinámicamente */}
                                            {Object.keys(outputJson.distribucionFinal).map((opinion, rowIndex) => (
                                                <TableRow key={rowIndex}>
                                                    <TableCell align="center" style={{ width: '50px' }}>
                                                        {opinion}
                                                    </TableCell>
                                                    {/* Generar las celdas de cada fila */}
                                                    {Object.keys(outputJson.distribucionFinal).map((_, colIndex) => {
                                                        // Buscar el valor correspondiente en 'movimientosRealizados'
                                                        const cellValue = outputJson.movimientosRealizados.find(
                                                            item => item.i === rowIndex + 1 && item.j === colIndex + 1
                                                        );
                                                        return (
                                                            <TableCell key={colIndex} align="center" style={{ width: '50px' }}>
                                                                {cellValue ? cellValue.value : 0}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            ))}
                                            {/* Fila adicional para mostrar la distribución final */}
                                            <TableRow>
                                                <TableCell align="center" style={{ width: '50px' }}>Distribución Final</TableCell>
                                                {Object.keys(outputJson.distribucionFinal).map((opinion, colIndex) => (
                                                    <TableCell key={colIndex} align="center" style={{ width: '50px' }}>
                                                        {outputJson.distribucionFinal[opinion]}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                    )}
                    {output && (
                        <div className="row-container" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <div className="column" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>


                                {/* Condicional para mostrar UNSATISFIABLE */}
                                {output === "=====UNSATISFIABLE=====\n" ? (
                                    <Typography variant="h4" align="center" style={{ color: 'red', width: '100%' }}>
                                        UNSATISFIABLE
                                    </Typography>
                                ) : (
                                    <>
                                        {/* Tabla 1: gráficos */}
                                        {/* <TableContainer 
                                            component={Paper} 
                                            className="scrollable-table-container" 
                                            style={{ 
                                                flex: '1', 
                                                margin: '0 5px', 
                                                minHeight: '300px', 
                                                display: 'flex', 
                                                justifyContent: 'center',  
                                                alignItems: 'center'       
                                            }} 
                                        >
                                            <Table style={{ width: '100%' }}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell colSpan={2}>
                                                            <Typography variant="h6" align="center" gutterBottom>
                                                                Gráficos
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell align="center" colSpan={2}>
                                                            <Button variant="contained" color="success" onClick={handleShowGraphs}>
                                                                Ver Gráficos
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer> */}

                                        {/* Tabla 3: Movimientos Realizados */}
                                        <TableContainer
                                            component={Paper}
                                            className="scrollable-table-container"
                                            style={{ flex: '1', margin: '0 5px', minHeight: '300px' }}
                                        >
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell colSpan={2}>
                                                            <Typography variant="h6" align="center" gutterBottom>
                                                                Movimientos Realizados
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {outputJson.movimientosRealizados.map((movimiento, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell align="center" style={{ width: '50px' }}>De {movimiento.i} a {movimiento.j}</TableCell>
                                                            <TableCell align="center" style={{ width: '50px' }}>{movimiento.value}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                        {/* Tabla 2: Distribución Final de Opiniones */}
                                        <TableContainer
                                            component={Paper}
                                            className="scrollable-table-container"
                                            style={{ flex: '1', margin: '0 5px', minHeight: '300px' }}
                                        >
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell colSpan={2}>
                                                            <Typography variant="h6" align="center" gutterBottom>
                                                                Distribución Final de Opiniones
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell align="center" style={{ width: '50px' }}>Opinión</TableCell>
                                                        <TableCell align="center" style={{ width: '50px' }}>Núm. personas</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {Object.entries(outputJson.distribucionFinal).map(([key, value], index) => (
                                                        <TableRow key={index}>
                                                            <TableCell align="center" style={{ width: '50px' }}>Opinión {index + 1}</TableCell>
                                                            <TableCell align="center" style={{ width: '50px' }}>{value}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                        {/* Tabla 4: Otros cálculos */}
                                        {/* <TableContainer
                                            component={Paper}
                                            className="scrollable-table-container"
                                            style={{ flex: '1', margin: '0 5px', minHeight: '300px' }}
                                        >
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell colSpan={2}>
                                                            <Typography variant="h6" align="center" gutterBottom>
                                                                Comparación de valores
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell align="center" style={{ width: '50px' }}>Polarización Final</TableCell>
                                                        <TableCell align="center" style={{ width: '50px' }}>{outputJson.polarizacionFinal}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell align="center" style={{ width: '50px' }}>Costo Total</TableCell>
                                                        <TableCell align="center" style={{ width: '50px' }}>{outputJson.costoTotal}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell align="center" style={{ width: '50px' }}>Mediana Ponderada</TableCell>
                                                        <TableCell align="center" style={{ width: '50px' }}>{outputJson.medianaPonderada}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </> */}
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {output && (
                        <Divider style={{ margin: '20px 0' }} />
                    )}

                    <Typography variant="h6" gutterBottom>Datos Iniciales</Typography>

                    {/* Segunda fila */}
                    <div className="row-container" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <div className="column" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                            {/* Tabla 1: Costo Máximo Permitido y Máximo de Movimientos */}
                            <TableContainer component={Paper} className="scrollable-table-container" style={{ flex: '1', margin: '0 5px' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={2}>
                                                <Typography variant="h6" align="center" gutterBottom>
                                                    Costo Máximo Permitido y Máximo de Movimientos
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell variant="body2" align="center" style={{ width: '50px' }}>Costo máximo permitido</TableCell>
                                            <TableCell align="center" style={{ width: '50px' }}>{data.costoMaximo}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="body2" align="center" style={{ width: '50px' }}>Máximo de movimientos</TableCell>
                                            <TableCell align="center" style={{ width: '50px' }}>{data.maxMovimientos}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {/* Tabla 2: Distribución de Población por Opinión */}
                            <TableContainer component={Paper} className="scrollable-table-container" style={{ flex: '1', margin: '0 5px' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={2}>
                                                <Typography variant="h6" align="center" gutterBottom>
                                                    Distribución de Población por Opinión
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center" style={{ width: '50px' }}>Opinión</TableCell>
                                            <TableCell align="center" style={{ width: '50px' }}>Núm. personas</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.distribucion.map((num, index) => (
                                            <TableRow key={index}>
                                                <TableCell align="center" style={{ width: '50px' }}>{index + 1}</TableCell>
                                                <TableCell align="center" style={{ width: '50px' }}>{num}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {/* Tabla 3: Valores de las Opiniones Posibles */}
                            <TableContainer component={Paper} className="scrollable-table-container" style={{ flex: '1', margin: '0 5px' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={2}>
                                                <Typography variant="h6" align="center" gutterBottom>
                                                    Valores de las Opiniones Posibles
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center" style={{ width: '50px' }}>Opinión</TableCell>
                                            <TableCell align="center" style={{ width: '50px' }}>Valor</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.valoresOpiniones.map((valor, index) => (
                                            <TableRow key={index}>
                                                <TableCell align="center" style={{ width: '50px' }}>{index + 1}</TableCell>
                                                <TableCell align="center" style={{ width: '50px' }}>{valor}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                    {/* Tercera fila */}
                    <div className="row-container" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <div className="column" style={{ flex: '1', display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <TableContainer
                                component={Paper}
                                className="scrollable-table-container"
                                style={{ width: '100%', maxWidth: '2100px' }}
                            >
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={data.opinionesPosibles + 1}>
                                                <Typography variant="h6" align="center" gutterBottom>
                                                    Costos de Desplazamiento entre Opiniones
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center" style={{ width: '50px' }}>Opinión \\ Costo</TableCell>
                                            {[...Array(data.opinionesPosibles)].map((_, index) => (
                                                <TableCell align="center" style={{ width: '50px' }} key={index}>op. {index + 1}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.costosDesplazamiento.map((fila, i) => (
                                            <TableRow key={i}>
                                                <TableCell align="center" style={{ width: '50px' }}>op. {i + 1}</TableCell>
                                                {fila.map((costo, j) => (
                                                    <TableCell align="center" style={{ width: '50px' }} key={j}>{costo}</TableCell>
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