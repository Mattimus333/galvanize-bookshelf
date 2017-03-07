const EXPRESS = require('express');
// eslint-disable-next-line new-cap
const ROUTER = EXPRESS.Router();
const ENV = process.env.NODE_ENV || 'development';
const CONFIG = require('../knexfile.js')[ENV];
const KNEX = require('knex')(CONFIG);

ROUTER.get('/books', (req, res) => {
  KNEX('books').orderBy('title').then((books) => {
    res.status(200).json(books);
  }).catch((err) => {
    console.error(err);
  });
});

ROUTER.get('/books/:id', (req, res) => {
  KNEX('books')
  .where('id', '=', req.params.id)
  .then((book) => {
    res.status(200).json(book[0]);
  })
  .catch((err) => {
    console.error(err);
  });
});

ROUTER.post('/books', (req, res) => {
  const BOOK = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.cover_url,
  };
  KNEX('books')
  .insert(BOOK)
  .then(() => {
    res.status(200).json(BOOK);
  })
  .catch((err) => {
    console.error(err);
  });
});

ROUTER.patch('/books/:id', (req, res) => {
  const BOOK = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.cover_url,
  };
  KNEX('books')
  .where('id', '=', req.params.id)
  .update(BOOK)
  .then(() => {
    BOOK.id = req.params.id;
    res.status(200).json(BOOK);
  })
  .catch((err) => {
    console.error(err);
  });
});

// ROUTER.Delete('/books/:id', (req, res) => {
//   KNEX('books')
//   .where('id', '=', req.params.id)
//   .then(() => {
//
//   })
// });


module.exports = ROUTER;
