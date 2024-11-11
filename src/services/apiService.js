
export const parseMPLFile = async (file) => {
    const readFileAsText = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    };

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
            maxMovimientos: parseInt(lines[6 + m]),
            
        };

        return parsedData;
    } catch (error) {
        console.error("Error al leer el archivo:", error);
        throw error;
    }
};

export const sendDataToBackend = async (data) => {
    try {
        // const response = await fetch("https://backendminpol.onrender.com/process-data/", {
        const response = await fetch("http://127.0.0.1:8000/process-data/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!response.ok) { 
            throw new Error(result.detail || 'Error en la solicitud al backend');
        }
        return result;
    } catch (error) {
        console.error("Error al enviar datos al backend:", error);
        throw error;
    }
};


