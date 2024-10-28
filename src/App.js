import React from 'react';
import './App.css';
import DataDisplay from './components/DataDisplay';
import Navbar from './components/Navbar';
import Toolbar from '@mui/material/Toolbar';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <Navbar />
                {/* Toolbar vacío como espaciador */}
                <Toolbar/>
                
            </header>
            <DataDisplay />
        </div>
    );
}

export default App;
