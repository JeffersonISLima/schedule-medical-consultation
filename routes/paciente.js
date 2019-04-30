// routes/auth-routes.js
const express = require('express');

const router = express.Router(); //  = authRoutes const authRoutes = express.Router();

const mongoose = require('mongoose');

/* const app = express(); */

// Patient model
const bcrypt = require('bcrypt');

// Autentication passport
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ensureLogin = require('connect-ensure-login');
const Paciente = require('../models/Paciente');
const Medico = require('../models/Medico');
const Agendamento = require('../views/pacientes/secret/agendamento-paciente');

// Bcrypt to encrypt passwords
const bcryptSalt = 10;

// Sign Up
router.get('/cadastro', (req, res) => {
  res.render('./pacientes/cadastro-paciente');
});

router.post('/cadastro', (req, res, next) => {
  const {
    username, password, cpf, name, birthdate, telResidencial, cellphone, healthInsurance,
  } = req.body;

  if (username === '' || password === '') {
    res.render('/cadastro', { message: 'Indicate email and password' });
    return;
  }

  Paciente.findOne({ username })
    .then((user) => {
    //  console.log('caiu no then do find Medico')  Debug
      if (user !== null) {
        res.render('/cadastro', { message: 'The username already exists' });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newPatient = new Paciente({
        username,
        password: hashPass,
        cpf,
        name,
        birthdate,
        telResidencial,
        cellphone,
        healthInsurance,
      });

      newPatient.save((err) => {
        if (err) {
        //  console.log(err)          Debug
          res.redirect('/cadastro');
        } else {
        //  console.log('Pacinte salvo')     Debug
          res.redirect('/');
        }
      });
    })
    .catch((error) => {
      next(error);
    });
});

// Sign In
router.get('/login', (req, res) => {
  res.render('./pacientes/login-paciente');
});
router.post('/login', passport.authenticate('local', {
  successRedirect: '/paciente/agendamento',
  failureRedirect: '/paciente/login',
  failureFlash: false,
  passReqToCallback: true,
}));

// Routes protected
router.get('/agendamento', ensureLogin.ensureLoggedIn(), (req, res) => {
  Medico.find().distinct('specialty')
    .then((result) => {
      res.render('./pacientes/secret/agendamento-paciente', { user: req.user.healthInsurance, specialty: result });
    })
    .catch(err => console.log(err));
});

router.get('/data-hora', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('./pacientes/secret/data-hora-paciente', { user: req.user });
});

router.get('/confirmacao', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('./pacientes/secret/confirmar-dados-consulta-paciente', { user: req.user });
});

router.get('/imprimir', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('./pacientes/secret/imprimir-paciente', { user: req.user });
});

router.get('/medicos/:specialty', (req, res, next) => {
  const { specialty } = req.params;
  console.log(req.params);
  Medico.find({ specialty })
    .then((response) => {
      console.log('######################', response);
      res.send(response);
    })
    .catch((err) => {
      throw new Error(err);
    });
});

module.exports = router;
