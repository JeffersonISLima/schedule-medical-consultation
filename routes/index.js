const express = require('express');

const router = express.Router();

/* GET home page */
router.get('/', (req, res) => {
//  res.render('index', { msg: req.query.msg}); MENSAGEM DE SUCESSO
  res.render('index');
});

// logout
router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

// login
router.get('/login', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

module.exports = router;
