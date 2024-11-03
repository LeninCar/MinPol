import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DataDisplay from './components/DataDisplay';
import Graficos from './components/Graficos'; // Asegúrate de que el path sea correcto
import Navbar from './components/Navbar';
import Toolbar from '@mui/material/Toolbar';

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <Navbar />
                    <Toolbar /> {/* Espaciador de toolbar */}
                </header>
                
                {/* Define las rutas de la aplicación */}
                <Routes>
                    {/* Ruta para DataDisplay como página principal */}
                    <Route path="/" element={<DataDisplay />} />
                    
                    {/* Ruta para la vista de gráficos */}
                    <Route path="/graficos" element={<Graficos />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
