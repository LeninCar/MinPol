// src/services/apiService.js

export const sendDataToBackend = async (data) => {
    try {
        const response = await fetch("https://backendminpol.onrender.com/process-data/", {
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
