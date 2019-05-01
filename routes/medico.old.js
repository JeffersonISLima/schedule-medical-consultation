// routes/auth-routes.js
const express = require('express');

const router = express.Router(); //  = authRoutes const authRoutes = express.Router();

// Doctor model
const bcrypt = require('bcrypt');
const Medico = require('../models/Medico');

// Autentication passport
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const ensureLogin = require("connect-ensure-login");


// Bcrypt to encrypt passwords
const bcryptSalt = 10;

// Sign Up
router.get('/cadastro', (req, res) => {
  res.render('./medicos/cadastro-medico');
});

router.post('/cadastro', (req, res, next) => {
  const {
    username, password, name, crm, specialty, telResidencial, cellphone,
  } = req.body;

  if (username === '' || password === '') {
    res.render('/cadastro', { message: 'Indicate email and password' });
    return;
  }

  Medico.findOne({ username })
    .then((user) => {
    //  console.log('caiu no then do find Medico')
      if (user !== null) {
        res.render('/cadastro', { message: 'The username already exists' });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newDoctor = new Medico({
        username,
        password: hashPass,
        name,
        crm,
        specialty,
        telResidencial,
        cellphone,
      });

      newDoctor.save((err) => {
        if (err) {
        // console.log(err)
          res.redirect('/cadastro');
        } else {
        // console.log('Medico salvo')
          res.redirect('/');
        }
      });
    })
    .catch((error) => {
      next(error);
    });
});

// ##################################################
router.get('/login', (req, res) => {
  res.render('./medicos/login-medico');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/medico/agenda',
  failureRedirect: '/medico/login',
  failureFlash: false,
  passReqToCallback: true,
}));

// Routes protected
router.get('/agenda', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('./medicos/secret/agendamento-marcado-medico', { user: req.user });
});

router.get('/login', (req, res) => {
  res.render('./medicos/login-medico');
});

/* FALTA FAZER AS ROTAS POST DE FORMULÁRIO */

module.exports = router;
