const express = require('express');
const router = express.Router();
const humps = require('humps');
const env = process.env.NODE_ENV || 'development';
const config = require('../knexfile.js')[env];
const knex = require('knex')(config);
const bcrypt = require('bcrypt-as-promised');
// eslint-disable-next-line new-cap

router.post('/users', (req, res) => {
  bcrypt.hash(req.body.password, 12)
  .then((hashed_password) => {
    knex('users')
    .insert({
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      hashed_password: hashed_password,
    }, '*')
    .then((users) => {
      const user = users[0];
      delete user.hashed_password;
      res.status(200).json(humps.camelizeKeys(user));
    })
    .catch((err) => {
      res.send(401, err);
    });
  });
});

module.exports = router;
