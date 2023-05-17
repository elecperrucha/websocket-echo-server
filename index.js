const WebSocket = require('ws');

// Crear un servidor WebSocket
const wss = new WebSocket.Server({ port: 8080 });

// Almacenar todas las conexiones activas
const conexiones = new Set();

// Almacenar los mensajes del servidor en una variable
const mensajes = [];

// Manejar eventos de conexión
wss.on('connection', (ws) => {
  // Agregar nueva conexión al conjunto
  conexiones.add(ws);

  // Enviar los mensajes anteriores al nuevo usuario
  mensajes.forEach((mensaje) => {
    ws.send(mensaje);
  });

  // Manejar eventos de mensajes recibidos
  ws.on('message', (message) => {
    console.log('Mensaje recibido:', message);

    // Almacenar el mensaje en el array
    mensajes.push(message);

    // Enviar el mensaje a todos los usuarios conectados
    conexiones.forEach((conexion) => {
      if (conexion !== ws && conexion.readyState === WebSocket.OPEN) {
        conexion.send(message);
      }
    });
  });

  // Manejar eventos de cierre de conexión
  ws.on('close', () => {
    console.log('Conexión cerrada');

    // Eliminar la conexión del conjunto
    conexiones.delete(ws);
  });
});

console.log('Servidor WebSocket iniciado en el puerto 8080');
