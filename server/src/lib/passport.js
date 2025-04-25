const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');
const { Result } = require('express-validator');

passport.use('local.signin', new LocalStrategy({
 usernameField: 'username',
 passwordField: 'password',
 passReqToCallback: true
}, async (req, username, password, done) => {
    
    const rows = await pool.query('select * from users where username = ?', [username]);
    if (rows.length > 0){
        ////console.log(rows[0]);
        global.area_activa = rows[0].id;
        ////console.log(area_activa);
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword ) {
            done(null, user, req.flash('success', 'Bienvenido ' + user.username));
        } else {
            done(null, false, req.flash('message', 'PassWord Incorrecto'));
        }
    } else {
        return done(null, false, req.flash('message', 'El Usuario no existe!'));
    }
}));    

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname } = req.body;
    const newUser = {
       username,
       password,
       fullname
    };
    
    newUser.password = await helpers.encryptPassword(password);
    console.log("El pass: " + password);
    const resultado = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = resultado.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('Select * from users where id = ?', [id]);
    done(null, rows[0]);
});