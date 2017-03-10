'use strict';

// eslint-disable-next-line new-cap
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const env = process.env.NODE_ENV || 'development';
const config = require('../knexfile.js')[env];
const knex = require('knex')(config);
const bcrypt = require('bcrypt-as-promised');
const humps = require('humps')

router.use(cookieParser());

router.get('/token', (req, res) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      res.status(200).json(false);
    }
  });
});

router.post('/token', (req, res) => {
  knex('users')
  .where('email', '=', req.body.email)
  .select('hashed_password', 'id', 'first_name', 'last_name', 'email')
  .then((user) => {
    if (user.length === 0) {
      res.set('Content-Type', 'text/plain');
      res.send(400, 'Bad email or password');
    }
    bcrypt.compare(req.body.password, user[0].hashed_password)
    .then( resp => {
      const claim = {userId: user[0].id};
      const token = jwt.sign(claim, process.env.JWT_KEY, {
        expiresIn: '7 days'
      });
      delete user[0].hashed_password;
      res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        secure: router.get('env') === 'production',
      });
      //going wrong RIGHT HERE
      res.status(200).json(humps.camelizeKeys(user[0]));
    })
    .catch((err) => {
      res.set('Content-Type', 'text/plain');
      res.send(400, 'Bad email or password');
    });
  })
  .catch((err) => {
    res.send(400, err);
  });
});

module.exports = router;
