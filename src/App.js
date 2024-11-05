import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DataDisplay from './components/DataDisplay';
import Graphics from './components/Graphics'; 
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
                    
                    <Route path="/graphics" element={<Graphics />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
