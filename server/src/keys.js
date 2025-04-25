/*module.exports = {
    database: {
      host: 'localhost',
      user: 'ladetec',
      password: 'ladetec',
      database: 'solutions',
      port: 3306,
      connectTimeout: 10000, // 10 segundos
       //socketTimeout: 30000, // 30 segundos
       //waitForConnections: true,
       connectionLimit: 10
       //queueLimit: 0
   }
 };*/


 /*const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'ladetec',
  password: 'ladetec',
  database: 'solutions',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});*/


module.exports = {
  database: {
    host: 'localhost',
    user: 'ladetec',
    password: 'ladetec',
    database: 'solutions'	 
 }
};

//module.exports = pool;