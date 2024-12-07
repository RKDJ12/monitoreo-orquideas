const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a la base de datos
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

// Middleware para procesar datos en formato JSON o URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal (login)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});

// Ruta para registrar usuarios
app.post('/register', (req, res) => {
  const { nombre_usuario, email, password } = req.body;

  if (!nombre_usuario || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Encriptar la contraseña
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: 'Error al encriptar la contraseña' });
    }

    const query = 'INSERT INTO UsuariosLogin (nombre_usuario, email, contraseña) VALUES (?, ?, ?)';
    db.query(query, [nombre_usuario, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'El usuario o el correo ya existen' });
        }
        throw err;
      }

      console.log(`Usuario registrado con ID: ${result.insertId}`);
      res.redirect('/main'); // Redirige a la página principal tras registrarse
    });
  });
});

// Ruta para el login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  const query = 'SELECT * FROM UsuariosLogin WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      // Comparar las contraseñas
      bcrypt.compare(password, results[0].contraseña, (err, isMatch) => {
        if (err) throw err;

        if (isMatch) {
          console.log(`Usuario autenticado: ${results[0].nombre_usuario}`);
          res.redirect('/main'); // Redirige a la página principal tras autenticarse
        } else {
          res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }
      });
    } else {
      res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }
  });
});

// Ruta para la página principal
app.get('/main', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'main.html'));
});

// Ruta para guardar datos de sensores
app.post('/api/save-sensor-data', (req, res) => {
  const { humidity, temperature, sensor_id, timestamp } = req.body;

  if (!humidity || !temperature || !sensor_id) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const query = `
    INSERT INTO CondicionesAmbientales (id_sensor, humedad, temperatura, fecha_registro)
    VALUES (?, ?, ?, ?)`; // SQL para insertar los datos

  db.query(query, [sensor_id, humidity, temperature, timestamp], (err, result) => {
    if (err) {
      console.error('Error al guardar los datos:', err);
      return res.status(500).json({ error: 'Error al guardar los datos' });
    }

    console.log('Datos guardados en la base de datos');
    res.status(200).json({ success: 'Datos guardados correctamente' });
  });
});

// Ruta para obtener historial de condiciones ambientales
app.get('/historial', (req, res) => {
  const query = `
    SELECT c.fecha_registro, c.humedad, c.temperatura, s.nombre_sensor
    FROM CondicionesAmbientales c
    JOIN Sensores s ON c.id_sensor = s.id_sensor
    ORDER BY c.fecha_registro DESC
    LIMIT 50`; // Obtiene los 50 últimos registros

  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results); // Devuelve los resultados en formato JSON
  });
});
// Ruta para obtener todos los sensores
app.get('/sensores', (req, res) => {
  const query = 'SELECT * FROM Sensores'; // SQL para obtener todos los sensores

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener sensores:', err);
      return res.status(500).json({ error: 'Error al obtener los sensores' });
    }
    res.json(results); // Devuelve los resultados en formato JSON
  });
});
// Ruta para activar o desactivar un sensor
app.post('/sensores/:id_sensor/toggle', (req, res) => {
  const sensorId = req.params.id_sensor;
  const query = 'UPDATE Sensores SET estado = NOT estado WHERE id_sensor = ?';

  db.query(query, [sensorId], (err, results) => {
    if (err) {
      console.error('Error al cambiar el estado del sensor:', err);
      return res.status(500).json({ error: 'Error al cambiar el estado del sensor' });
    }
    res.json({ success: true });
  });
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
