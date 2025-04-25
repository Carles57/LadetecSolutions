import { exec } from 'child_process';
import http from 'http';
import { fileURLToPath } from 'url';
import path from 'path';

//nombre del fichero js
const __filename = fileURLToPath(import.meta.url);
// camino completo
const __dirname = path.dirname(__filename);
const rootPath = path.join(__dirname,'..')

console.log(rootPath);
   // Ruta a un archivo en la raíz de Astro
   const filePath = path.join(__dirname, 'tu-archivo.txt');

const NODE_APP_PORT =  3000;
//const NODE_APP_SCRIPT = process.env.NODE_APP_SCRIPT || './mysql.js';
const NODE_APP_SCRIPT = `${rootPath}/LadetecNodeAll/src/index.js`;
console.log(NODE_APP_SCRIPT);
let nodeProcess;

async function checkNodeAppRunning(retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    const isRunning = await new Promise((resolve) => {
      http.get(`http://127.0.0.1:${NODE_APP_PORT}/health`, (res) => {
        resolve(res.statusCode === 200);
      }).on('error', () => resolve(false));
    });

    if (isRunning) return true;
    console.log(`Intento ${i + 1}: Esperando ${delay}ms...`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  return false;
}

function startNodeApp() {
  console.log('Iniciando API en Node...');
  nodeProcess = exec(`node ${NODE_APP_SCRIPT}`);

  nodeProcess.stdout.on('data', (data) => {
    console.log(`[Node App] stdout: ${data}`);
  });

  nodeProcess.stderr.on('data', (data) => {
    console.error(`[Node App] stderr: ${data}`);
  });

  nodeProcess.on('close', (code) => {
    console.log(`[Node App] proceso cerrado con código ${code}`);
  });

  return nodeProcess;
}

process.on('SIGINT', () => {
  if (nodeProcess) {
    console.log('Deteniendo aplicación Node...');
    nodeProcess.kill();
  }
  process.exit();
});

async function init() {
  const isRunning = await checkNodeAppRunning();
  if (!isRunning) {
    startNodeApp();
  } else {
    console.log('La app Node ya está en ejecución.');
  }
}

init();