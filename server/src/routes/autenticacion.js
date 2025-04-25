const express = require('express');
const router = express.Router();

const passport = require('passport');
const { SiEstaLogueado, SiNoEstaLogueado  } = require('../lib/auth');
const helpers = require('../lib/helpers');

router.get('/', SiNoEstaLogueado,  (req, res) => {
  console.log("entro a loguearme");
  res.render('auth/signin');
});

router.get('/signup', SiNoEstaLogueado, (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', SiNoEstaLogueado, passport.authenticate('local.signup', {
    //successRedirect:  '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

   router.post('/signin', SiNoEstaLogueado,  (req, res, next) => {
    
    const fecha_global = req.body.fecha_global;
    const user_global = req.body.username;
    global.user_global= user_global;
    console.log(global.user);
    // Año
    var dia = new Date(fecha_global);
  
    var anno = JSON.stringify(req.body.fecha_global);
    var anno = anno.slice(1,5);
    global.anno = anno;
    global.fecha_entrada = req.body.fecha_global;

    console.log("Fecha Global " + global.fecha_entrada);
    // Mes
    var fecha_mes = JSON.stringify(req.body.fecha_global);
    console.log("Entre en esta fecha global: " + fecha_mes);
    var x = Buffer.from(fecha_mes);
    var y = x.slice(6,8);
    global.mes = parseInt(y);
    global.desde_principo = 1;
    
    passport.authenticate('local.signin', {
    successRedirect:  `/${user_global}`,
    failureRedirect: '/signin',
    failureFlash: true    
    }) (req, res, next);
  });

 
   router.get('/signin', SiNoEstaLogueado,  (req, res) => {
      console.log("entro a loguearme");
      res.render('auth/signin');
   });

   router.get('/logout', SiEstaLogueado, (req, res) => {
    console.log("entro a Salir");
    req.logOut();
    res.render('auth/signin');
   });

  router.get('/profile', SiEstaLogueado, (req, res) => {
    res.render('profile');
 });

/* router.get('/ladetec', SiEstaLogueado, (req, res) => {
  const vURL = 'http://localhost:3000/' + user_global;
  console.log('Ejecutando la web en ' + vURL);  
  res.redirect(vURL);
   
});

router.get('/ladetecProd', SiEstaLogueado, (req, res) => {
  const vURL = 'http://localhost:3000/' + user_global;
  console.log('Lamando los estaticos en la web ' + vURL);  
  res.redirect(vURL);
   
});*/




module.exports = router;