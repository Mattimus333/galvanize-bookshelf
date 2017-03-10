'use strict';
// eslint-disable-next-line new-cap
const express = require('express');
const humps = require('humps');
const env = process.env.NODE_ENV || 'development';
const config = require('../knexfile.js')[env];
const knex = require('knex')(config);
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/favorites', (req, res) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      res.status(401).set('Content-Type', 'text/plain').send('Unauthorized');
    } else {
      knex('favorites')
      .innerJoin('books', 'favorites.book_id', 'books.id')
      .then((favorites) => {
        res.status(200).send(humps.camelizeKeys(favorites));
      })
      .catch((err) => {
        res.status(500);
      });
    }
  });
});

router.get('/favorites/check', (req, res) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err) => {
    if (err) {
      res.status(401).set('Content-Type', 'text/plain').send('Unauthorized');
    } else {
      knex('favorites')
      .innerJoin('books', 'favorites.book_id', 'books.id')
      .where('book_id', '=', req.query.bookId)
      .then((queryResult) => {
        if (queryResult.length === 0) {
          res.status(200).send(false);
        }
        res.status(200).send(true);
      })
      .catch(() => {
        res.status(500);
      });
    }
  });
})

module.exports = router;
