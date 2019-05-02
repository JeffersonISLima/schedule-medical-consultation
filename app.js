require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

// ################################# passport
const session = require('express-session');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Patient = require('./models/Paciente');
// const Doctor = require('./models/Medico');
// ################################# passport


mongoose
  .connect('mongodb://localhost/schedule-medical-consultation', { useNewUrlParser: true })
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err);
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// #### Begin passport

// Autentication Patient
app.use(session({
  secret: 'our-passport-local-strategy-app',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 6000000 },
}));

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  Patient.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

passport.use(new LocalStrategy((username, password, next) => {
  Patient.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: 'Incorrect username' });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: 'Incorrect password' });
    }
    return next(null, user);
  });
}));
// End Autentication Patient

app.use(passport.initialize());
app.use(passport.session());
// #### End passport

// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// Express View engine setup

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true,
}));

// ################################################
// Here - middleware passport

// ################################################


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// Routes
const index = require('./routes/index');
const paciente = require('./routes/paciente');
app.use('/', index);
app.use('/paciente', paciente);

/* const medico = require('./routes/medico');

app.use('/medico', medico); */



/* const login = require('./routes/paciente');

app.use('/paciente', login); */

module.exports = app;
