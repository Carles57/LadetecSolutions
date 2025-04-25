/*const mysql = require('mysql');
const { database } = require('./keys');
const { promisify } = require('util');

const pool = mysql.createPool(database);

pool.query = promisify(pool.query);

module.exports = pool;
*/

const mysql = require('mysql');
const { database } = require('./keys');
const { promisify } = require('util');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
  if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          console.error('La conexion fue cerrada');
          } 
      if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Existen muchas conexiones');
        } 
    if (err.code === 'ECONNREFUSED') {
        console.error('La conexion fue RECHAZADA');
        } 
  }
  if (connection) connection.release();
  console.log('Base de Datos conectada');
  return;
});

pool.query = promisify(pool.query);

module.exports = pool;





// Cambio la importación de mysql a mariadb
/*const mariadb = require('mariadb');
const { database } = require('./keys');

// Crea el pool de conexiones con MariaDB
const pool = mariadb.createPool({
  ...database,
  // Añade estas configuraciones recomendadas para MariaDB
  connectionLimit: 10,
  idleTimeout: 60000,
  minimumIdle: 2,
  connectTimeout: 5000, // Tiempo máximo de espera para conexión
  resetAfterUse: true,
  acquireTimeout: 10000
});*/

// Mejoro el manejo de conexiones
/*const checkConnection = async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Conexión exitosa a MariaDB');
    
    // Verifica versión del servidor
    const rows = await conn.query("SELECT VERSION() AS version");
    console.log(`Versión de MariaDB: ${rows[0].version}`);
    
  } catch (err) {
    // Manejo específico de errores de MariaDB
    switch(err.code) {
      case 'ER_ACCESS_DENIED_ERROR':
        console.error('Error de autenticación en MariaDB');
        break;
      case 'ER_BAD_DB_ERROR':
        console.error('La base de datos no existe en MariaDB');
        break;
      case 'PROTOCOL_CONNECTION_LOST':  // Mantenido para compatibilidad
        console.error('Conexión perdida con MariaDB');
        break;
      default:
        console.error('Error desconocido:', err);
    }
    // Registra el error completo para diagnóstico
    console.error(err.stack); 
  } finally {
    if (conn) conn.release();  // Libera la conexión al pool
  }
};
*/

// Ejecuto la verificación al iniciar ?
//checkConnection().catch(console.error);

// Verificación de conexión 
 /*const checkConnection = async () => {
  let conn;
  try {
    conn = pool.getConnection();
    console.log('✅ Conexión OK');
    //const version = conn.query('SELECT VERSION() AS v');
    //console.log(`📌 Versión MariaDB: ${version[0].v}`);
  } catch (err) {
    console.error('❌ Error de conexión:', err.message);
  } finally {
    if (conn) conn.release();
  }
};*/

//checkConnection();


// Exporta SOLO el pool (si no necesitas getTransaction)
//module.exports = pool;


