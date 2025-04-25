// check-and-start-node-app.js
import { exec } from 'child_process';
import http from 'http';

// Configuración
const NODE_APP_PORT = 3000; // Puerto de tu app Node
const NODE_APP_SCRIPT = 'C:/LadetedNomina/node/mysql.js'; // Ruta al script de tu app Node

// Función para verificar si la app Node está corriendo
function checkNodeAppRunning() {
  return new Promise((resolve) => {
    http.get(`http://127.0.0.1:${NODE_APP_PORT}/health`, (res) => {
      if (res.statusCode === 200) resolve(true);
      else resolve(false);
    }).on('error', () => resolve(false));
  });
}

// Función para iniciar la app Node
function startNodeApp() {
  console.log('Iniciando aplicación Node...');
  const nodeProcess = exec(`node ${NODE_APP_SCRIPT}`, (err) => {
    if (err) console.error('Error al iniciar Node:', err);
  });
  return nodeProcess;
}

// Ejecutar la verificación
async function init() {
  const isRunning = await checkNodeAppRunning();
  if (!isRunning) {
    startNodeApp();
  } else {
    console.log('La app Node ya está en ejecución.');
  }
}

init();