const EXPRESS = require('express');
// eslint-disable-next-line new-cap
const ROUTER = EXPRESS.Router();
const HUMPS = require('humps');
const ENV = process.env.NODE_ENV || 'development';
const CONFIG = require('../knexfile.js')[ENV];
const knex = require('knex')(CONFIG);

ROUTER.get('/books', (req, res) => {
  knex('books')
  .orderBy('title')
  .then((books) => {
    res.status(200).json(HUMPS.camelizeKeys(books));
  }).catch((err) => {
    res.status(500);
  });
});

ROUTER.get('/books/:id', (req, res) => {
  knex('books')
  .where('id', '=', req.params.id)
  .then((book) => {
    res.status(200).json(HUMPS.camelizeKeys(book[0]));
  })
  .catch((err) => {
    res.status(500);
  });
});

ROUTER.post('/books', (req, res) => {
  const BOOK = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.coverUrl,
  };
  knex('books')
  .insert(BOOK, '*')
  .then((book) => {
    res.status(200).json(HUMPS.camelizeKeys(book[0]));
  })
  .catch((err) => {
    res.send(401, err);
  });
});

ROUTER.patch('/books/:id', (req, res) => {
  const BOOK = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.coverUrl,
  };
  knex('books')
  .where('id', '=', req.params.id)
  .update(BOOK)
  .then(() => {
    BOOK.id = parseInt(req.params.id, 10);
    res.status(200).json(HUMPS.camelizeKeys(BOOK));
  })
  .catch((err) => {
    res.send(401, err);
  });
});

ROUTER.delete('/books/:id', (req, res) => {
  let deletedBook;
  knex('books')
  .select('title', 'author', 'genre', 'description', 'cover_url')
  .where('id', '=', req.params.id)
  .then((book) =>{
    deletedBook = book;
  })
  .catch((err) => {
    res.send(401);
  });
  knex('books')
  .where('id', '=', req.params.id)
  .del()
  .then((book) =>{
    res.status(200).json(HUMPS.camelizeKeys(deletedBook[0]));
  })
  .catch((err) => {
    res.send(401);
  });
});

module.exports = ROUTER;
