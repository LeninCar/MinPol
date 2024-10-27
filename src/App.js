import React from 'react';
import './App.css';
import DataDisplay from './components/DataDisplay';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Opiniones de Población</h1>
            </header>
            <DataDisplay />
        </div>
    );
}

export default App;