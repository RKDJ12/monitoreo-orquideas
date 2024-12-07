// Conexión MQTT
const client = mqtt.connect('ws://broker.hivemq.com:8000/mqtt');
const id_sensor = 1;
client.on('connect', () => {
    console.log('Conectado al broker MQTT');

    // Suscripción a los tópicos 'orquideas/temperatura' y 'orquideas/humedad'
    client.subscribe(['orquideas/temperatura', 'orquideas/humedad'], (err) => {
        if (!err) {
            console.log('Suscrito a los tópicos "orquideas/temperatura" y "orquideas/humedad"');
        }
    });
});

// Recibir datos de MQTT
client.on('message', (topic, message) => {
    console.log(`Mensaje recibido en el tópico ${topic}: ${message.toString()}`);

    // Manejar los diferentes tópicos
    if (topic === 'orquideas/temperatura') {
        const temperatura = message.toString();
        document.getElementById('temperature').textContent = `${temperatura}°C`;
    } else if (topic === 'orquideas/humedad') {
        const humedad = message.toString();
        document.getElementById('humidity').textContent = `${humedad}%`;
    }

    // Enviar los datos a la base de datos mediante una petición POST
    fetch('/api/save-sensor-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            humedad: document.getElementById('humidity').textContent,  // Usamos el valor actualizado
            temperatura: document.getElementById('temperature').textContent,  // Usamos el valor actualizado
            timestamp: new Date().toISOString(),
            id_sensor: id_sensor
        }),
    })
    .then(response => response.json())
    .then(data => console.log('Datos guardados en la base de datos:', data))
    .catch(error => console.error('Error al guardar los datos:', error));
});

// Este código se ejecuta cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar valores a "Esperando datos..." antes de que lleguen los datos de MQTT
    document.getElementById('humidity').textContent = 'Esperando datos...';
    document.getElementById('temperature').textContent = 'Esperando datos...';
});

//notis
