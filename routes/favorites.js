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
      .catch(() => {
        res.status(400);
      });
    }
  });
});

router.get('/favorites/check', (req, res) => {
  if (isNaN(req.query.bookId) || req.query.bookId === undefined) {
    res.status(400).set('Content-Type', 'text/plain').send('Book ID must be an integer');
  } else {
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
          res.status(400);
        });
      }
    });
  }
});

router.post('/favorites', (req, res) => {
  if (isNaN(req.body.bookId) || req.body.bookId === undefined) {
    res.status(400).set('Content-Type', 'text/plain').send('Book ID must be an integer');
  } else {
    jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
      if (err) {
        res.status(401).set('Content-Type', 'text/plain').send('Unauthorized');
      } else {
        const favoriteBook = {
          book_id: req.body.bookId,
          user_id: payload.userId,
        };
        knex('favorites')
        .insert(favoriteBook, '*')
        .then((fav) => {
          delete fav[0].created_at;
          delete fav[0].updated_at;
          res.status(200).send(humps.camelizeKeys(fav[0]));
        })
        .catch(() => {
          res.status(404).set('Content-Type', 'text/plain').send('Book not found');
        });
      }
    });
  }
});

router.delete('/favorites', (req, res) => {
  if (isNaN(req.body.bookId) || req.body.bookId === undefined) {
    res.status(400).set('Content-Type', 'text/plain').send('Book ID must be an integer');
  } else {
    jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
      if (err) {
        res.status(401).set('Content-Type', 'text/plain').send('Unauthorized');
      } else {
        let deletedUser;
        knex('favorites')
        .select('book_id', 'user_id')
        .where('book_id', '=', req.body.bookId)
        .then((user) => {
          if (user.length === 0) {
              res.status(404).set('Content-Type', 'text/plain').send('Favorite not found');
          } else {
            deletedUser = user;
            knex('favorites')
            .where('id', '=', req.body.bookId)
            .del()
            .then(() => {
              res.status(200).send(humps.camelizeKeys(deletedUser[0]));
            });
          }
        })
        .catch(() => {
          res.status(404).set('Content-Type', 'text/plain').send('Favorite not found');
        })
      }
    });
  }
});

module.exports = router;
