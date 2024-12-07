// Función para crear y mostrar una notificación
function showNotification(message) {
    const notificationElement = document.createElement('div');
    notificationElement.classList.add('notification');
    notificationElement.innerText = message;

    // Agregar la notificación al contenedor
    document.getElementById('notifications').appendChild(notificationElement);

    // Hacer desaparecer la notificación después de 5 segundos
    setTimeout(() => {
        notificationElement.remove();
    }, 5000);
}

// Llamada para mostrar la notificación de prueba
window.onload = () => {
    showNotification('Notificación de testeo');
};
