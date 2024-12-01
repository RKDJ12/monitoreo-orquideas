const express = require('express');
const path = require('path');
const mysql = require('mysql');  // Asumiendo que usas MySQL

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mapr'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado a la base de datos');
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para obtener el historial de condiciones ambientales
app.get('/historial', (req, res) => {
  const query = 'SELECT * FROM condicionesambientales ORDER BY fecha_registro DESC LIMIT 50';  // Obtener los últimos 50 registros
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);  // Devolver los resultados como JSON
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'main.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
