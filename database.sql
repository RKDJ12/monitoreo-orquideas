Create database MAPR;
-- Crear tabla Usuarios
CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla CalendarioRiego
CREATE TABLE CalendarioRiego (
    id_calendario INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    dia VARCHAR(20) NOT NULL,
    hora TIME NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

-- Crear tabla Sensores
CREATE TABLE Sensores (
    id_sensor INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre_sensor VARCHAR(100) NOT NULL,
    tipo_conexion ENUM('Bluetooth', 'Wi-Fi') NOT NULL,
    estado BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

-- Crear tabla CondicionesAmbientales
CREATE TABLE CondicionesAmbientales (
    id_condicion INT AUTO_INCREMENT PRIMARY KEY,
    id_sensor INT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    humedad DECIMAL(5, 2) NOT NULL,
    temperatura DECIMAL(5, 2) NOT NULL,
    FOREIGN KEY (id_sensor) REFERENCES Sensores(id_sensor)
);

-- Crear tabla Notificaciones
CREATE TABLE Notificaciones (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);