const EXPRESS = require('express');
// eslint-disable-next-line new-cap
const ROUTER = EXPRESS.Router();
const HUMPS = require('humps');
const ENV = process.env.NODE_ENV || 'development';
const CONFIG = require('../knexfile.js')[ENV];
const knex = require('knex')(CONFIG);

ROUTER.get('/books', (req, res) => {
  knex('books').orderBy('title').then((books) => {
    res.status(200).json(HUMPS.camelizeKeys(books));
  }).catch((err) => {
    res.status(500);
  });
});

// ROUTER.post('/books', (req, res) => {
//   const BOOK = {
//     title: req.body.title,
//     author: req.body.author,
//     genre: req.body.genre,
//     description: req.body.description,
//     cover_url: req.body.cover_url,
//   };
//   knex('books')
//   .insert(BOOK)
//   .then(() => {
//     res.status(200).json(BOOK);
//   })
//   .catch((err) => {
//     res.status(500);
//   });
// });

module.exports = ROUTER;
