
// Función para obtener los sensores desde el servidor
async function fetchSensores() {
    const response = await fetch('/sensores');
    const data = await response.json();
    
    const tableBody = document.getElementById('sensores-table').querySelector('tbody');
    tableBody.innerHTML = ''; // Limpiar cualquier contenido anterior
    
    // Llenar la tabla con los datos de los sensores
    data.forEach(sensor => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sensor.nombre_sensor}</td>
            <td>${sensor.tipo_conexion}</td>
            <td>${sensor.estado ? 'Activo' : 'Inactivo'}</td>
            <td>
                <button onclick="toggleSensor(${sensor.id_sensor})">${sensor.estado ? 'Desactivar' : 'Activar'}</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para activar o desactivar un sensor
async function toggleSensor(sensorId) {
    const response = await fetch(`/sensores/${sensorId}/toggle`, { method: 'POST' });
    const data = await response.json();
    
    if (data.success) {
        fetchSensores(); // Volver a cargar la lista de sensores después de modificar el estado
    } else {
        alert('Hubo un error al cambiar el estado del sensor.');
    }
}

// Llamar a la función al cargar la página
window.onload = fetchSensores;
