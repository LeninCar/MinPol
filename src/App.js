import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DataDisplay from './components/DataDisplay';
import Grafics from './components/Grafics'; 
import Navbar from './components/Navbar';
import Toolbar from '@mui/material/Toolbar';

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <Navbar />
                    <Toolbar /> 
                </header>
                
                <Routes>
                    <Route path="/" element={<DataDisplay />} />
                    
                    <Route path="/grafics" element={<Grafics />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
