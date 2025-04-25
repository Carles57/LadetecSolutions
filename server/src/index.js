const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySqlStore = require('express-mysql-session');
const passport = require('passport');
const { database } = require('./keys');
//const bootstrap = require('bootstrap');
const cors = require('cors');
require('dotenv').config();
const moment = require('moment-timezone');
const fs = require('fs'); 
const xmlrpc = require('xmlrpc');
const mariadb = require('mariadb');

const host = process.env.HOST; // 0.0.0.0
const port = process.env.PORT; // 3000

// Cliente XML-RPC para Odoo
const odooClient = xmlrpc.createClient({
  url: `${process.env.ODOO_URL}/xmlrpc/2/object`
});
  
        
// Inicializacion
const app = express();
require('./lib/passport');
app.use(express.static(__dirname + '/src')); 
app.use(session({
   secret: 'faztmysqlnodesession',
   resave: false,
   saveUninitialized: false,
   cookie:{
    secure:false,
    sameSite: "lax",
    httpOnly:true,
   },
   store: new MySqlStore(database)
   
}));
app.use(flash());
app.use(cors({
  origin: 'http://localhost:4321',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true

}));

// Set
app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars'),
 
  
}));

app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


const fechaEnCuba = moment().tz('America/Havana').format('YYYY-MM-DD HH:mm:ss');
console.log(fechaEnCuba);

//global.fecha_entrada = anno + "-"+ mes + "-" + dia;

console.log("Fecha y Hora Actual: " + fechaEnCuba);

app.use(function(req,res,next) {
  app.locals.success = req.flash('success');
  app.locals.message = req.flash('message');
  app.locals.user = req.user;
  app.locals.fecha_entrada = fechaEnCuba; //anno + "-"+ mes + "-" + dia;
    ////console.log("/" + req.method);
    next();
  }); 


  // Ruta relativa a la carpeta 'dist' de Astro
/*  const projectRoot = path.join(__dirname, '..');
const astroStaticPath = path.join(projectRoot, 'dist/client');
console.log("Ruta es " + astroStaticPath);
app.use(express.static(astroStaticPath)); 
console.log("Y ahora: " + astroStaticPath);
*/

// Routes
app.use(require('./routes'));
app.use(require('./routes/autenticacion'));
app.use('/links', require('./routes/links'));

//Public
app.use(express.static(path.join(__dirname, 'public')));
app.use('/fonts/', express.static(path.join(__dirname, 'public/fonts')));

  app.get('/profile', (req,res)=>
  {
  res.render('profile');
    
   }); 



// Servidor
app.listen(app.get('port'), () =>{
    console.log('Servidor en el puerto', app.get('port')); 

}); 
