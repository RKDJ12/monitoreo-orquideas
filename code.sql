SELECT fecha_registro, humedad, temperatura
FROM CondicionesAmbientales
WHERE id_sensor = 1 AND fecha_registro BETWEEN '2024-01-01 00:00:00' AND '2024-01-02 00:00:00'
ORDER BY fecha_registro;