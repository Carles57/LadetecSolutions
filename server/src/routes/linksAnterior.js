const jsdom = require("jsdom");
const express = require('express');
const router = express.Router();
const pool = require('../database');
const passport = require('passport');
const helpers = require('../lib/helpers');
const { SiEstaLogueado  } = require('../lib/auth');
const Excel = require('exceljs');

var savepdf = require('html-pdf');
var fs = require('fs');
var path = require('path');
const { clearScreenDown } = require("readline");
const { setMes, setAnno } = require("../lib/helpers");
const { Console } = require("console");
var options = {format:'A4'};
const moment = require('moment-timezone');
const xmlrpc = require('xmlrpc');
const mariadb = require('mariadb');
const util = require('util');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);


// Rutas para Ladetec
// Para conexion con Odoo Ladetec
// Configurar cliente XML-RPC reutilizable
const createOdooClient = (endpoint) => {
    const client = xmlrpc.createClient({
        url: `${process.env.ODOO_URL}/xmlrpc/2/${endpoint}`,
        headers: {
            'Content-Type': 'text/xml',
            'User-Agent': 'Node-Odoo-Connector/1.0'
        }
    });
    
    client.methodCallAsync = util.promisify(client.methodCall);
    return client;
};

// Autenticación Odoo (versión corregida)
const authenticateOdoo = async () => {
    const commonClient = createOdooClient('common');
    try {
        const uid = await commonClient.methodCallAsync('authenticate', [
            process.env.ODOO_DB,
            process.env.ODOO_USERNAME,
            process.env.ODOO_PASSWORD,
            {}
        ]);

        if (typeof uid !== 'number') {
            throw new Error('Autenticación fallida: Credenciales inválidas');
        }
        return uid;
    } catch (error) {
        console.error('Error de autenticación:', {
            message: error.message,
            stack: error.stack,
            body: error.body
        });
        throw new Error('Error de conexión con Odoo');
    }
};

// Función para ejecutar métodos Odoo (versión optimizada)
const executeOdooMethod = async (client, model, method, args = [], kwargs = {}) => {
    try {
        return await client.methodCallAsync('execute_kw', [
            process.env.ODOO_DB,
            await authenticateOdoo(), // Reutiliza la autenticación
            model,
            method,
            args,
            kwargs
        ]);
    } catch (error) {
        console.error('Error en método Odoo:', {
            model,
            method,
            error: error.body || error.message
        });
        throw error;
    }
};

// Descargar desde Odoo
router.get('/sync-data/:date', async (req, res) => {
    try {
        // Validación de fecha
        const date = req.params.date;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({ error: 'Formato de fecha inválido. Use YYYY-MM-DD' });
        }

        // Obtener datos de Odoo
        const modelsClient = createOdooClient('object');
        
        // 1. Buscar IDs
        const analyticIds = await executeOdooMethod(
          modelsClient,
          'account.analytic.line',
          'search',
          [[['date', '=', date]]] 
      );

        if (!analyticIds.length) {
            return res.json({ 
                success: true,
                message: `No hay registros para ${date}`
            });
        }

        // 2. Obtener detalles
        const analytics = await executeOdooMethod(
            modelsClient,
            'account.analytic.line',
            'read',
            [analyticIds],
            { 
                fields: [
                    'name', 
                    'date', 
                    'unit_amount', 
                    'employee_id', 
                    'project_id'
                ] 
            }
        );

        // Procesar datos para MariaDB
        const values = analytics.map(analytic => {
            const employee = analytic.employee_id || [null, ''];
            const project = analytic.project_id || [null, ''];

            return [
                analytic.name || 'Sin nombre',
                analytic.date,
                parseFloat(analytic.unit_amount) || 0.0,
                employee[0],  // ID
                project[0],    // ID
                employee[1] || 'Sin nombre',
                project[1] || 'Sin proyecto'
            ];
        });

        
        await pool.query('DELETE FROM analytic_time WHERE date = ?', [date]);
        await pool.query(
            "INSERT INTO analytic_time (name, date, unit_amount, employee_id, project_id, nombre, proyecto) VALUES ?",
            [values]
        );

        res.json({
            success: true,
            date: date,
            records_processed: analytics.length
        });

    } catch (error) {
        console.error('Error general:', {
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
        res.status(500).json({
            success: false,
            error: error.message,
            error_type: error.constructor.name
        });
    }
});
// Fin 

// Ejecutar 


router.post('/runscript', async (req, res) => {
  const scriptPath = path.join(__dirname, '/getDBOdoo.py');
  console.log("Ruta: " + scriptPath);
  try {
    const { month, year } = req.body;
    console.log("Recibo: Mes: " + month + " y " + year);
    // Validación de seguridad
    //if (!Number.isInteger(month) || month < 1 || month > 12) {
     // return res.status(400).json({ error: 'Mes inválido' });
    //}

    // Ejecutar el script Python
    const { stdout, stderr } = await execAsync(
     `python3 "${scriptPath}" ${year} ${month}`,
      { timeout: 30000 }
    );

    res.status(200).json({
      message: stdout || 'Ejecución completada',
      error: stderr
    });

  } catch (error) {
    res.status(500).json({
      error: error.message || 'Error en la ejecución del script'
    });
  }
});

router.post('/checkdata', async (req, res) => {
  const { month, year } = req.body;
  //const { month, year } = req.params;
  // Validación de parámetros
  if (month === undefined || year === undefined) {
    return res.status(400).json({ 
      error: 'Parámetros requeridos: month y year' 
    });
  }

  const monthInt = parseInt(month);
  const yearInt = parseInt(year);

  if (isNaN(monthInt)) {
    return res.status(400).json({ 
      error: 'El parámetro month debe ser un número' 
    });
  }

  if (isNaN(yearInt)) {
    return res.status(400).json({ 
      error: 'El parámetro year debe ser un número' 
    });
  }

  if (monthInt < 1 || monthInt > 12) {
    return res.status(400).json({ 
      error: 'El mes debe estar entre 1 y 12' 
    });
  }

  try {
    // Consulta para verificar datos existentes
    const query = `
      SELECT 
        COUNT(*) AS count,
        MAX(date) AS last_date
      FROM analytic_time
      WHERE EXTRACT(MONTH FROM STR_TO_DATE(date, '%Y-%m-%d')) = ?
        AND EXTRACT(YEAR FROM STR_TO_DATE(date, '%Y-%m-%d')) = ?
    `;

    // Ejecutar consulta usando el pool de conexiones
    const [results] = await pool.query(query, [monthInt, yearInt]);
    const count = results[0]?.count || 0;

    res.json({
      exists: count > 0,
      count: count,
      month: monthInt,
      year: yearInt,
      last_date: results[0]?.last_date || null
    });

  } catch (error) {
    console.error('Error en verificación de datos:', error);
    res.status(500).json({ 
      error: 'Error al verificar datos en la base de datos',
      details: error.message 
    });
  }
});


router.get('/getdata/:month/:year', async (req, res) => {
  //const { month, year } = req.body;
  const { month, year } = req.params;
  // Validación de parámetros
  if (month === undefined || year === undefined) {
    return res.status(400).json({ 
      error: 'Parámetros requeridos: month y year' 
    });
  }

  const monthInt = parseInt(month);
  const yearInt = parseInt(year);

  if (isNaN(monthInt)) {
    return res.status(400).json({ 
      error: 'El parámetro month debe ser un número' 
    });
  }

  if (isNaN(yearInt)) {
    return res.status(400).json({ 
      error: 'El parámetro year debe ser un número' 
    });
  }

  if (monthInt < 1 || monthInt > 12) {
    return res.status(400).json({ 
      error: 'El mes debe estar entre 1 y 12' 
    });
  }

  try {
    // Consulta para verificar datos existentes
    const query = `
      SELECT 
        COUNT(*) AS count,
        MAX(date) AS last_date
      FROM analytic_time
      WHERE EXTRACT(MONTH FROM STR_TO_DATE(date, '%Y-%m-%d')) = ?
        AND EXTRACT(YEAR FROM STR_TO_DATE(date, '%Y-%m-%d')) = ?
    `;

    // Ejecutar consulta usando el pool de conexiones
    const [results] = await pool.query(query, [monthInt, yearInt]);
    const count = results[0]?.count || 0;

    res.json({
      exists: count > 0,
      count: count,
      month: monthInt,
      year: yearInt,
      last_date: results[0]?.last_date || null
    });

  } catch (error) {
    console.error('Error en verificación de datos:', error);
    res.status(500).json({ 
      error: 'Error al verificar datos en la base de datos',
      details: error.message 
    });
  }
});

// Users

router.get('/Users', async (req, res) => {
   console.log('Entro la ruta' );
   try {
     const results = await pool.query('SELECT id, username, direccion, fullname, email FROM users');
     res.json(results);
   } catch (err) {
     console.error('Error en la consulta SQL:', err.message);
     res.status(500).json({ error: err.message });
   }
 });

 // Ruta para obtener todos los usuarios (MODIFICADO)

 router.get('/roles', async (req, res) => {
   console.log('Tomo los roles' );
   try {
     const results = await pool.query('SELECT * FROM roles');
     res.json(results);
   } catch (err) {
     console.error('Error en la consulta SQL:', err.message);
     res.status(500).json({ error: err.message });
   }
 });

 // Metodos de Pago
 router.get('/PaymentMethods', async (req, res) => {
  console.log('Entro en la ruta de los activos..' );
  try {
    const results = await pool.query('SELECT id, name, created_at, activo FROM payment_methods where activo = 1');
    //console.log("Mis metodos: " + results);
    res.json(results);
  } catch (err) {
    console.error('Error en la consulta SQL:', err.message);
    res.status(500).json({ error: err.message });
  }
});

 // Metodos de Pago
 router.get('/PaymentAllMethods', async (req, res) => {
  console.log('Entro en la ruta de All' );
  try {
    const results = await pool.query('SELECT id, name, created_at, activo FROM payment_methods');
    res.json(results);
  } catch (err) {
    console.error('Error en la consulta SQL:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// Ejemplo en Node.js (usando mysql2/promise)
router.get('/PaymentMethodsId/:id', async (req, res) => {
  console.log("Filtro los metodos de pago");
  try {
    const results = await pool.query(`
      SELECT 
        M.id AS method_id,
        M.name,
        M.activo,
        T.cambio
      FROM payment_methods M
      INNER JOIN tasas_de_cambio T ON M.id = T.id_methods
      WHERE M.id = ?
    `, [req.params.id]);  

    res.json(results); 
  } catch (error) {
    console.error("Error en SQL:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.post('/create_payment_methods', async (req, res) => {
  const { name, activo } = req.body;
  if (!name || !activo) {
    return res.status(400).json({ error: 'Se requieren los campos name y description' });
  }
  try {
    const results = await pool.query(
      'INSERT INTO payment_methods (name, activo) VALUES (?, ?)',
      [name, description]
    );

    res.status(201).json({ message: 'Metodo registrado exitosamente', id: results.lastID });
  } catch (err) {
    console.error('Error en la consulta SQL:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put('/update_methods/:id', async (req, res) => {
  const id = req.params.id;
  console.log("Actualizo el metodo " + id);

  
  const { name, activo } = req.body;
  console.log("Actualizo el metodo con activo " + activo);
  if (!name || !activo) {
    return res.status(400).json({ error: 'Se requieren todos los datos' });
  }

  try {
    const results = await pool.query(
      'UPDATE payment_methods SET name = ?, activo = ? WHERE id = ?',
      [name, activo, id]
    );

    if (results.changes === 0) {
      return res.status(404).json({ error: 'Metodo no encontrado' });
    }

    res.json({ message: 'Metodo actualizado exitosamente' });
  } catch (err) {
    console.error('Error en la consulta SQL:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/create_methods', async (req, res) => {
  const { name, activo } = req.body;

  if (!name || !activo) {
    return res.status(400).json({ error: 'Se requieren los campos name y activo 0/1' });
  }

  try {  

    // Validar nombre de usuario único
    const existingMet = await pool.query('SELECT * FROM payment_methods WHERE name = ?', name);
    if (existingMet) {
      return res.status(409).json({ error: 'El metodo ya existe' });
    }   

    // Insertar usuario
    const results = await pool.query(
      'INSERT INTO payment_methods (name, activo) VALUES (?, ?)',
      [name, activo]
    );

    res.status(201).json({ message: 'Medodo creado exitosamente', id: results.lastID });
  } catch (err) {
    console.error('Error en la consulta SQL:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put('/set_methods/:id/:valor', async (req, res) => {
  const id = req.params.id;
  const valor = req.params.valor;
  console.log("Actualizo el metodo " + id);
  const { name, activo } = req.body;

  if (!name || !activo) {
    return res.status(400).json({ error: 'Se requieren todos los datos' });
  }

  try {
    const results = await pool.query(
      'UPDATE payment_methods SET activo = ? WHERE id = ?',
      [valor, id]
    );

    if (results.changes === 0) {
      return res.status(404).json({ error: 'Metodo no encontrado' });
    }

    res.json({ message: 'Metodo actualizado exitosamente' });
  } catch (err) {
    console.error('Error en la consulta SQL:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put('/get_methods_activo', async (req, res) => {
  console.log("Tomo  el metodo activo");
  
  try {
    const results = await pool.query(
      'Select * payment_methods WHERE activo = 1');

    if (results.changes === 0) {
      return res.status(404).json({ error: 'Metodo no encontrado' });
    }

    res.json({ message: 'Metodo activo tomado exitosamente' });
  } catch (err) {
    console.error('Error en la consulta SQL:', err.message);
    res.status(500).json({ error: err.message });
  }
});

 router.get('/employee_hours_All', async (req, res) => {
  //const fecha = req.params.date;
  //console.log(fecha);
    
  console.log('Tomo a todos los empleados, entro a employee _hours...' );
  try {
   
      const results = await pool.query(
        'SELECT Distinct(E.name) as name,  E.id, A.employee_id, E.work_email, E.work_phone,   A.date, sum(A.unit_amount) as horas, E.tasa from employee E LEFT JOIN analytic_time A ON A.employee_id = E.id  group by E.id  order by A.id ASC '       
      );   
    res.json(results);
  } catch (err) {
    console.error('Error en la consulta SQL:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/analytic_time_combinado/:employee_id/:date', async (req, res) => {
  try {
    const { employee_id, date } = req.params;
    const { filterType } = req.query; // Nuevo parámetro de consulta
    console.log("Entro en el combinado con fecha: " + date);
    console.log(`Filtro: ${filterType} | Fecha: ${date} | ID: ${employee_id}`);

    let query;
    let params;

    if (filterType === 'month') {
      // Consulta para MES (total de horas)
      query = `
        SELECT 
          E.name AS Nombre,
          A.name as tarea,
          A.proyecto,
          A.unit_amount AS horas,
          A.date
        FROM employee E
        INNER JOIN analytic_time A ON A.employee_id = E.id
        WHERE E.id = ?
          AND SUBSTRING(A.date, 1, 7) = ?
        ORDER BY A.date ASC
      `;
      params = [employee_id, date];
      
    } else {
      console.log("Entro en consulta por el dia");
      // Consulta para DÍA (tareas detalladas)
      query = `
        SELECT 
          name AS tarea,
          unit_amount AS horas,
          proyecto,
          date
        FROM analytic_time

        WHERE employee_id = ?
          AND date = ?
        ORDER BY date ASC
      `;
      params = [employee_id, date];
    }

    const results = await pool.query(query, params);
    res.json(results); // Asegurar estructura consistente

  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      error: "Error en el servidor. Contacte al administrador." 
    });
  }
});



 // Fin Metodos de Pago

router.get('/analytic_time_month/:employee_id/:monthYear', async (req, res) => {
  try {
    const { employee_id, monthYear } = req.params;
    console.log("Fecha: " + monthYear);

    const [year, month] = monthYear.split('-');
   // year = "2025"; // monthYear.slice(3,4);
  //  month = "04";
    console.log("Centuria: " + year);
    console.log("Mes: " + month);
    const results = await pool.query(`
       SELECT name, proyecto, SUM(unit_amount) as horas 
      FROM analytic_time 
      WHERE employee_id = ?
        AND YEAR(date) = ? 
        AND MONTH(date) = ?
      GROUP BY name, proyecto
    `, [employee_id, year, month]);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

 router.get('/analityc_times/:date', async (req, res) => {
  const fecha = req.params.date;

  console.log('Tomo los empleados' );
  console.log('Fecha recibida:', req.params.date);
  try {
      const results = await pool.query(
        'Select E.id, E.name, A.employee_id,A.date,A.unit_amount from employee E inner join analytic_time A ON E.id = A.employee_id  where A.date =?',
        [fecha]
      );   
    res.json(results);
  } catch (err) {
    console.error('Error en la consulta SQL:', err.message);
    res.status(500).json({ error: err.message });
  }
});


router.get('/analytic_time/:employee_id/:date', async (req, res) => {
  try {
    const { employee_id, date } = req.params;
    console.log("entro a la consulta de tiempos de trabajo con fecha: " + date + " y usuario: " + employee_id);
    // Consulta CORREGIDA (sin GROUP BY ni SUM)
    const results = await pool.query(`
    SELECT 
        A.name,
        A.unit_amount AS horas,
        A.proyecto,
        E.name as Nombre,
        E.id,
        A.employee_id
      FROM analytic_time A inner join employee E ON E.id = A.employee_id
      WHERE A.employee_id = ?
        AND A.date = ?
      ORDER BY id DESC  
    `, [employee_id, date]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: "Error en el servidor. Contacte al administrador." 
    });
  }
});
router.get('/employee_details/:employeeId/:date', async (req, res) => {
  try {
    const { employeeId, date } = req.params;
    
    // 1. Obtener totales
    const totalQuery = `
      SELECT SUM(unit_amount) as horas_total 
      FROM analytic_time 
      WHERE employee_id = ? AND DATE(date) = ?
    `;
    
    // 2. Obtener actividades detalladas
    const actividadesQuery = `
      SELECT employee_id, name, SUM(unit_amount) as horas, description 
      FROM analytic_time 
      WHERE employee_id = ? AND DATE(date) = ?
      GROUP BY employee_id `;

      const detallesQuery = `select E.id, A.employee_id, E.name as Nombre, A.proyecto, A.name as Tarea,A.unit_amount, A.date from employee 
            E inner join analytic_time A ON A.employee_id = E.id WHERE employee_id = ? AND DATE(date) = ?
             `;

    const [totalResult, detallesResult] = await Promise.all([
      pool.query(totalQuery, [employeeId, date]),
      pool.query(detallesQuery, [employeeId, date])
    ]);

    res.json({
      nombre: 'Nombre del empleado', // Deberías obtenerlo de tu DB
      horas_total: totalResult[0].horas_total || 0,
      actividades: detallesResult
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/employee', async (req, res) => {
 //const fecha = req.params.date;
 // Validar formato de fecha (YYYY-MM-DD)
 //if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
 // return res.status(400).json({ error: 'Formato de fecha inválido. Use YYYY-MM-DD' });
//}   
  console.log(' Cargo a todos  los empleados por ruta /employee' );
  try {
   
      const results = await pool.query(
        'Select E.id, E.name, E.work_email, E.work_phone, E.tasa from employee E');   
    res.json(results);
  } catch (err) {
    console.error('Error en la consulta SQL:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Ruta para obtener un usuario por ID (MODIFICADO)
router.get('/employee/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const results = await pool.query('SELECT * FROM employee WHERE id = ?', id);

    if (!results) {
      return res.status(404).json({ error: 'No se encontraron datos' });
    }
    const user = results[0];
    res.json(user);
  } catch (err) {
    console.error('Error en la consulta SQL:', err.message);
    res.status(500).json({ error: err.message });
  }
});

 router.put('/update_employee/:id', async (req, res) => {
   const id = req.params.id;
   console.log("Actualizo employee " + id);
   const { name, work_email, work_phone, tasa } = req.body;
 
   if (!name || !work_email || !work_phone || !tasa) {
     return res.status(400).json({ error: 'Se requieren todos los datos' });
   }
 
   try {
     const results = await pool.query(
       'UPDATE employee SET name = ?, work_email = ?, work_phone = ?, tasa = ? WHERE id = ?',
       [name, work_email, work_phone, tasa, id]
     );
 
     if (results.changes === 0) {
       return res.status(404).json({ error: 'Empleado no encontrado' });
     }
 
     res.json({ message: 'Empleado actualizado exitosamente' });
   } catch (err) {
     console.error('Error en la consulta SQL:', err.message);
     res.status(500).json({ error: err.message });
   }
 });

 

 router.get('/employee_hours/:date', async (req, res) => {
  const fecha = req.params.date;
  console.log("Esta es la fecha: " + fecha);
    
  console.log('Tomo los tiempos de la fecha en employee_hours!' );
  try {
   
      const results = await pool.query(
`SELECT E.id, A.employee_id, E.name,E.work_email, E.work_phone,   A.date, sum(A.unit_amount) as horas, E.tasa from employee E inner join analytic_time A ON A.employee_id = E.id WHERE SUBSTRING(A.date, 6, 2) = SUBSTRING(?, 6, 2)
 group by E.id order by A.id ASC `,
        [fecha]
      );
      
      
     /* const results = await pool.query(
        `SELECT E.id, A.employee_id, E.name,E.work_email, E.work_phone,   A.date, sum(A.unit_amount) as horas, E.tasa from employee E inner join analytic_time A ON A.employee_id = E.id WHERE A.date = ?
         group by E.id order by A.id ASC `,
                [fecha]
              );
*/

    res.json(results);
  } catch (err) {
    console.error('Error en la consulta SQL:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Ruta para obtener registros por DÍA completo
router.get('/analytic_time_decidir/:filter_type/:employee_id/:date', async (req, res) => {
  try {
    const { filter_type, employee_id, date } = req.params; // ¡No olvides el filter_type!

    let sqlQuery; // Variable para almacenar la consulta dinámica

    if (filter_type === 'day') {
      // Consulta para día específico (fecha exacta)
      sqlQuery = `
        SELECT 
          E.id,
          E.name AS empleado,
          A.date AS fecha,
          SUM(A.unit_amount) AS horas,
          A.tarea,
          A.proyecto
        FROM analytic_time A
        INNER JOIN employee E ON E.id = A.employee_id
        WHERE A.employee_id = ? AND A.date = ?
        GROUP BY A.date, A.id
        ORDER BY A.date DESC`;
        
    } else if (filter_type === 'month') {
      // Consulta para mes (todos los registros del mes)
      sqlQuery = `
        SELECT 
          E.id,
          E.name AS empleado,
          DATE_FORMAT(A.date, '%Y-%m') AS mes, 
          SUM(A.unit_amount) AS horas_totales,
          A.tarea,
          A.proyecto
        FROM analytic_time A
        INNER JOIN employee E ON E.id = A.employee_id
        WHERE A.employee_id = ? AND DATE_FORMAT(A.date, '%Y-%m') = ?
        GROUP BY mes, A.tarea, A.proyecto
        ORDER BY mes DESC`;
        
    } else {
      return res.status(400).json({ error: 'Tipo de filtro inválido. Use "day" o "month"' });
    }

    // Ejecutar consulta dinámica
    const results = await pool.query(sqlQuery, [employee_id, date]);
    
    res.json(results[0] || []);

  } catch (err) {
    console.error('Error en analytic_time:', err);
    res.status(500).json({ error: `Error al obtener registros (${filter_type})` });
  }
});

// Ruta para obtener registros por MES
router.get('/analytic_time/:employee_id/:date', async (req, res) => {
  try {
    const { employee_id, year, month } = req.params;
    
    const results = await pool.query(
      `SELECT 
        E.id,
        E.name AS empleado,
        DATE_FORMAT(A.date, '%Y-%m') AS mes,
        SUM(A.unit_amount) AS horas_mes,
        A.proyecto
       FROM analytic_time A
       INNER JOIN employee E ON E.id = A.employee_id
       WHERE A.employee_id = ? 
         AND YEAR(A.date) = ? 
         AND MONTH(A.date) = ?
       GROUP BY mes, A.proyecto
       ORDER BY mes DESC`,
      [employee_id, year, month]
    );

    res.json(results[0] || {});
    
  } catch (err) {
    console.error('Error en monthly:', err);
    res.status(500).json({ error: 'Error al obtener registros mensuales' });
  }
});

  // Tasas de Cambio
  // Insertar nueva tasa de cambio
  router.post('/tasas_cambio', async (req, res) => {
    const { id_methods, date, cambio } = req.body;
    console.log("Entro a registar las tasas de cambio. Fecha: " + date);
  
    // Validación básica
    if (!id_methods || !date || !cambio) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
  
    try {
      const result = await pool.query(
        'INSERT INTO tasas_de_cambio (id_methods, date, cambio) VALUES (?, ?, ?)',
        [id_methods, date, cambio]
      );
      
      res.json({
        id: result.insertId.toString(),
        message: 'Tasa creada exitosamente',
        data: { id_methods, date, cambio }
      });
      
    } catch (err) {
      console.error('Error en INSERT:', err);
      res.status(500).json({ 
        error: 'Error creando tasa de cambio',
        detalle: err.message 
      });
    }
  });

// employee_payment_splits

 // Insertar nueva tasa de cambio
 router.post('/payment-splits', async (req, res) => {
  const { employee_id, date, splits } = req.body; // 👈 Usar employee_id

  console.log("Datos recibidos:", { employee_id, date, splits });

  if (!employee_id || !date || !splits?.length) { // 👈 Validación corregida
    return res.status(400).json({ error: 'employee_id, date o splits faltan' });
  }

  try {
    // Insertar múltiples splits
    const inserts = splits.map(async split => {
      await pool.query(
        `INSERT INTO employee_payment_splits 
        (payment_method_id, date, hours, employee_id, exchange_rate) 
        VALUES (?, ?, ?, ?, ?)`,
        [
          split.payment_method_id,
          date,
          split.hours,
          employee_id,
          split.exchange_rate
        ]
      );
    });

    await Promise.all(inserts);
    
    res.json({ message: 'Splits creados exitosamente' });
    
  } catch (err) {
    console.error('Error en INSERT:', err);
    res.status(500).json({ 
      error: 'Error creando splits de pago',
      detalle: err.message 
    });
  }
});

// Ruta para obtener historial de pagos por empleado
router.get('/getEmployeePayments/:employeeId', async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        YEAR(fecha) AS year,
        MONTH(fecha) AS month,
        SUM(total_devengar) AS total_devengar
      FROM employee_payments
      WHERE id_employee = ?
      GROUP BY YEAR(fecha), MONTH(fecha)
      ORDER BY year, month
    `, [req.params.employeeId]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para obtener todos los empleados
 router.get('/getAllPayments/:year/:month', async (req, res) => {
   const year = req.params.year;
   const month = req.params.month;
   try {
     const results = await pool.query(`SELECT employee.id, employee.tasa,
      employee.name, employee_payments.id_employee, employee_payments.tasa_horaria, employee_payments.fecha,
      employee_payments.total_devengar, employee_payments.created_at, employee_payments.activo,employee_payments.validado 
      from employee_payments inner join employee 
      ON employee_payments.id_employee = employee.id  where substring(fecha,1,4) = ? and substring(fecha,6,2)= ?
     `,
       [year,month]);
       console.log("URL de petición:", `/links/getAllPayments/${year}/${month}`);
       console.log(results);
       res.setHeader('Content-Type', 'application/json');
     res.json(results);
   } catch (err) {
     console.error('Error en la consulta SQL:', err.message);
     res.status(500).json({ error: err.message });
   }
 });

// 2025-03-04
function getMes(dateStr){
  console.log("Mes: " + dateStr);
  const mes = dateStr.slice(5,7);
  console.log("Mes: " + mes);
  return mes;
}

function getCenturia(dateStr){
  console.log("Centuria: " + dateStr);
  const cen = dateStr.slice(0,4);
  console.log("Centuria: " + cen);
  return cen;
}
router.post('/update-employee-payments', async (req, res) => {
  const { selectedDate } = req.body; // Formato: 'YYYY-MM-DD'
  const action = "invalidar";
  var status;
  if(action === "invalidar"){
    status = 0;
  } else {
    status = 1;
  }
  console.log("Recibiendo fecha en UpdatePayment: " + selectedDate );
  const el_mes = getMes(selectedDate);
  const centuria = getCenturia(selectedDate);
  // Validar fecha
  if (!selectedDate || !isValidDate(selectedDate)) {
    return res.status(400).json({ error: 'Fecha inválida (Usar formato YYYY-MM-DD)' });
  }

  try {
    // Extraer mes y año de la fecha recibida
    const dateObj = new Date(selectedDate);
    const monthStart = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
    const monthEnd = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);

    // 1. Verificar registros existentes para el mes
    const existingRecords = await pool.query(
      `SELECT COUNT(*) as total 
       FROM employee_payments 
       WHERE fecha = ? 
       AND activo = 1`,
      [selectedDate]
    );

    // 2. Manejar conflicto de registros existentes
  /*  if (existingRecords.rows[0].total > 0 ) {
      return res.status(409).json({
        error: `Existen registros activos para ${dateObj.toLocaleString('default', { month: 'long', year: 'numeric' })}`,
        options: 'Usar ?action=invalidar o ?action=sobrescribir'
      });
    }*/

    // 3. Acciones sobre registros existentes
    if (action) {
      switch (action.toLowerCase()) {
        case 'invalidar':
          await pool.query(
            `UPDATE employee_payments 
             SET activo = 0 
             WHERE fecha = ?`,
            [selectedDate]
          );
          break;

        case 'sobrescribir':
          await pool.query(
            `DELETE FROM employee_payments 
             MONTH(date) = ?`,
            [el_mes]
          );
          break;

        default:
          return res.status(400).json({ error: 'Acción no válida' });
      }
    }

    // 4. Consolidar pagos mensuales
    const newPayments = await pool.query(
      `INSERT INTO employee_payments
          (id_employee, tasa_horaria, fecha, total_devengar, activo)
          SELECT 
              eps.employee_id,
              MAX(e.tasa) as tasa,
              eps.date,
              SUM(eps.hours * e.tasa * eps.exchange_rate) as total,
              ?
          FROM employee_payment_splits eps
          INNER JOIN employee e ON eps.employee_id = e.id
          WHERE 
              MONTH(eps.date) = ? 
              AND YEAR(eps.date) = ?     
          GROUP BY eps.employee_id, eps.date
          RETURNING *`,
      [status, el_mes, centuria] 
    );

    res.status(201).json({
      message: `Pagos consolidados para ${monthStart.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`,
      empleados_procesados: newPayments.rowCount,
      periodo: {
        inicio: monthStart.toISOString().split('T')[0],
        fin: monthEnd.toISOString().split('T')[0]
      }
    });

  } catch (err) {
    console.error('Error en el proceso:', err);
    res.status(500).json({ 
      error: 'Error al procesar pagos mensuales',
      detalle: err.message 
    });
  }
});

// Función de validación de fecha
function isValidDate(dateString) {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false;
  const date = new Date(dateString);
  return !isNaN(date) && date.toISOString().slice(0,10) === dateString;
}
  


 
 // Ruta para eliminar un usuario por ID (MODIFICADO)
 router.delete('/delete_user/:id', async (req, res) => {
   const id = req.params.id;
 
   try {
     const results = await pool.query('DELETE FROM users WHERE id = ?', id);
     
     if (results.changes === 0) {
       return res.status(404).json({ error: 'Usuario no encontrado' });
     }
 
     res.json({ message: 'Usuario eliminado exitosamente' });
   } catch (err) {
     console.error('Error en la consulta SQL:', err.message);
     res.status(500).json({ error: err.message });
   }
 });
 
 // Ruta para actualizar un usuario por ID (MODIFICADO)
 router.put('/update_user/:id', async (req, res) => {
   const id = req.params.id;
   const { username, fullname } = req.body;
 
   if (!username || !fullname) {
     return res.status(400).json({ error: 'Se requieren los campos username y fullname' });
   }
 
   try {
     const results = await pool.query(
       'UPDATE users SET username = ?, fullname = ? WHERE id = ?',
       [username, fullname, id]
     );
 
     if (results.changes === 0) {
       return res.status(404).json({ error: 'Usuario no encontrado' });
     }
 
     res.json({ message: 'Usuario actualizado exitosamente' });
   } catch (err) {
     console.error('Error en la consulta SQL:', err.message);
     res.status(500).json({ error: err.message });
   }
 });
 

 
 // Ruta para obtener todos los empleados
 router.get('/get_all_employee', async (req, res) => {
   try {
     const results = await pool.query('SELECT id, name, work_phone, work_email, tasa FROM employee');
     res.json(results);
   } catch (err) {
     console.error('Error en la consulta SQL:', err.message);
     res.status(500).json({ error: err.message });
   }
 });


 
 // Ruta para obtener un usuario por ID (MODIFICADO)
 router.get('/getUser/:id', async (req, res) => {
   const id = req.params.id;
 
   try {
     const results = await pool.query('SELECT * FROM users WHERE id = ?', id);
 
     if (!results) {
       return res.status(404).json({ error: 'No se encontraron datos' });
     }
     const user = results[0];
     res.json(user);
   } catch (err) {
     console.error('Error en la consulta SQL:', err.message);
     res.status(500).json({ error: err.message });
   }
 });
 
 // Endpoint para registrar un nuevo permiso (MODIFICADO)
 router.post('/create_permission', async (req, res) => {
   const { name, description } = req.body;
 
   if (!name || !description) {
     return res.status(400).json({ error: 'Se requieren los campos name y description' });
   }
 
   try {
     const results = await pool.query(
       'INSERT INTO permissions (name, description) VALUES (?, ?)',
       [name, description]
     );
 
     res.status(201).json({ message: 'Permiso registrado exitosamente', id: results.lastID });
   } catch (err) {
     console.error('Error en la consulta SQL:', err.message);
     res.status(500).json({ error: err.message });
   }
 });
 

 // Ruta para crear un nuevo usuario (MODIFICADO)
 router.post('/create_user', async (req, res) => {
   const { username, fullname, password, role_id } = req.body;
 
   if (!username || !fullname || !password || !role_id) {
     return res.status(400).json({ error: 'Se requieren los campos username, fullname, password y role_id' });
   }
 
   try {
     // Validar rol
     const existingRole = await pool.query('SELECT * FROM roles WHERE id = ?', role_id);
     if (!existingRole) {
       return res.status(400).json({ error: 'El rol especificado no existe' });
     }
 
     // Validar nombre de usuario único
     const existingUser = await pool.query('SELECT * FROM users WHERE username = ?', username);
     if (existingUser) {
       return res.status(409).json({ error: 'El nombre de usuario ya existe' });
     }
 
     // Hashear contraseña
     const hashedPassword = await bcrypt.hash(password, 10);
 
     // Insertar usuario
     const results = await pool.query(
       'INSERT INTO users (username, fullname, password, role_id) VALUES (?, ?, ?, ?)',
       [username, fullname, hashedPassword, role_id]
     );
 
     res.status(201).json({ message: 'Usuario creado exitosamente', id: results.lastID });
   } catch (err) {
     console.error('Error en la consulta SQL:', err.message);
     res.status(500).json({ error: err.message });
   }
 });


// Fin rutas para shop


//

 

 
module.exports = router;


