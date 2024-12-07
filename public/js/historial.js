
        // Función para obtener el historial desde el servidor
        async function fetchHistorial() {
            try {
                const response = await fetch('/historial');
                const data = await response.json();

                const tableBody = document.getElementById('historial-table').querySelector('tbody');
                tableBody.innerHTML = ''; // Limpiar cualquier contenido anterior

                // Llenar la tabla con los datos del historial
                data.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${new Date(item.fecha_registro).toLocaleString()}</td>
                        <td>${item.humedad}</td>
                        <td>${item.temperatura}</td>
                        <td>${item.nombre_sensor}</td>
                    `;
                    tableBody.appendChild(row);
                });
            } catch (error) {
                console.error('Error al cargar los datos del historial:', error);
            }
        }

        // Función para generar el archivo Excel
        function generateExcel() {
            const table = document.getElementById('historial-table');
            const worksheet = XLSX.utils.table_to_sheet(table); // Convertir la tabla en una hoja de cálculo
            const workbook = XLSX.utils.book_new(); // Crear un nuevo libro de trabajo
            XLSX.utils.book_append_sheet(workbook, worksheet, "Historial"); // Agregar la hoja al libro

            // Generar el archivo y ofrecerlo para descarga
            XLSX.writeFile(workbook, "historial_condiciones_ambientales.xlsx");
        }

        // Llamar a la función al cargar la página
        window.onload = fetchHistorial;

        // Agregar el evento al botón para generar el Excel
        document.getElementById('downloadExcel').addEventListener('click', generateExcel);
