/* eslint-disable camelcase */
// routes /paciente/etc...
const express = require('express');

const router = express.Router(); //  = authRoutes const authRoutes = express.Router();

// const mongoose = require('mongoose');

// Patient model
const bcrypt = require('bcrypt');

// Autentication passport
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ensureLogin = require('connect-ensure-login');
const Paciente = require('../models/Paciente');
const Medico = require('../models/Medico');
const Agendamento = require('../models/Agendamento');

// Bcrypt to encrypt passwords
const bcryptSalt = 10;

// Sign Up
router.get('/cadastro', (req, res) => {
  res.render('./pacientes/cadastro-paciente');
});

router.post('/cadastro', (req, res, next) => {
  const {
    username,
    password,
    cpf,
    name,
    birthdate,
    telResidencial,
    cellphone,
    healthInsurance,
  } = req.body;

  if (username === '' || password === '') {
    res.render('/cadastro', { message: 'Indicate email and password' });
    return;
  }

  Paciente.findOne({ username })
    .then((user) => {
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
          res.redirect('/cadastro');
        } else {
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
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/paciente/agendamento',
    failureRedirect: '/',
    failureFlash: false,
    passReqToCallback: true,
  }),
);

// Routes protected
router.get('/agendamento', ensureLogin.ensureLoggedIn(), (req, res) => {
  Medico.find()
    .distinct('specialty')
    .then((result) => {
      res.render('./pacientes/secret/agendamento-paciente', {
        user: req.user,
        specialty: result,
      });
    })
    .catch(err => console.log(err));
});

router.post('/agendamento', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const {
    group1, specialty, doctor, date, hour,
  } = req.body;

  Medico.findOne({ name: doctor })
    .then((doc) => {
      const docId = doc._id;
      const newScheduling = new Agendamento({
        group1,
        specialty,
        doctor,
        date,
        hour,
        id_patient: req.user._id,
        id_doctor: docId,
      });
      // Add New Scheduling
      newScheduling.save((err) => {
        if (err) {
          res.redirect('/paciente/agendamento');
        } else {
          res.redirect(
            '/paciente/confirmacao/?msg=Agendamento realizado com sucesso',
          );
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/confirmacao', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('./pacientes/secret/confirmar-dados-consulta-paciente', {
    msg: req.query.msg,
  });
});

router.get('/imprimir', ensureLogin.ensureLoggedIn(), (req, res) => {
  /* Agendamento.find({ id_patient: req.user._id }) // req.user._id user logado
    .then((result) => {
      console.log("########", result);

      res.render('./pacientes/secret/imprimir-paciente', { patients: result });
    })
    .catch((err) => {
      throw new Error(err);
    }); */


  Agendamento.findOne({ id_patient: req.user._id }).sort({'created_at': -1})//.limit(1) // req.user._id user logado
    .then((result) => {
      console.log('########', result);
      res.render('./pacientes/secret/imprimir-paciente', { patient: result });
    })
    .catch((err) => {
      throw new Error(err);
    });
});
//  res.render('./pacientes/secret/imprimir-paciente', { user: req.user });


router.get('/medicos/:specialty', (req, res, next) => {
  const { specialty } = req.params;
  Medico.find({ specialty })
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      throw new Error(err);
    });
});


router.get('/date/:day/:dr', (req, res, next) => {
  const { day } = req.params;
  const { dr } = req.params;

  Medico.find({ name: dr })
    .then((response) => {
      Agendamento.find({ date: day, id_doctor: response[0]._id })
        .then((resDr) => {
          res.send(resDr);
        })
        .catch((err) => {
          throw new Error(err);
        });
    })
    .catch((err) => {
      throw new Error(err);
    });
});

// Find one - History of consults
router.get('/list', ensureLogin.ensureLoggedIn(), (req, res) => {
  Agendamento.find({ id_patient: req.user._id }) // req.user._id user logado
    .then((result) => {
      res.render('./pacientes/secret/history', { user: result });
    })
    .catch((err) => {
      throw new Error(err);
    });
});

// Delete one consult
router.get('/del/:id', ensureLogin.ensureLoggedIn(), (req, res) => {
  // console.log(req.params.id);
  Agendamento.findOneAndDelete(req.params.id)
    .then(() => {
      res.redirect('/paciente/list');
    })
    .catch((err) => {
      throw new Error(err);
    });
});

// Edit get - consultation data
router.get('/edit/:id', (req, res) => {
  Agendamento.findById(req.params.id)
    .then((result) => {
      res.render('./pacientes/secret/edit-consultation', { patient: result });
    })
    .catch((err) => {
      throw new Error(err);
    });
});

// Edit post - consultation data
router.post('/edit/:id', (req, res) => {
  Agendamento.findByIdAndUpdate(req.params.id, { $set: req.body })
    .then(() => {
      res.redirect('/paciente/list');
    })
    .catch((err) => {
      throw new Error(err);
    });
});

// Edit get - personal data
router.get('/edit/personal/:id', (req, res) => {
  Paciente.findById(req.params.id)
    .then((result) => {
      res.render('./pacientes/secret/edit-personal-data', { patient: result });
    })
    .catch((err) => {
      throw new Error(err);
    });
});

// Edit post - personal data
router.post('/edit/personal/:id', (req, res) => {
  Paciente.findByIdAndUpdate(req.params.id, { $set: req.body })
    .then(() => {
      res.redirect('/paciente/agendamento');
    })
    .catch((err) => {
      throw new Error(err);
    });
});

module.exports = router;
