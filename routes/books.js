const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const humps = require('humps');
const env = process.env.NODE_ENV || 'development';
const config = require('../knexfile.js')[env];
const knex = require('knex')(config);

router.get('/books', (req, res) => {
  knex('books')
  .orderBy('title')
  .then((books) => {
    res.status(200).json(humps.camelizeKeys(books));
  }).catch((err) => {
    res.status(500);
  });
});

router.get('/books/:id', (req, res) => {
  knex('books')
  .where('id', '=', req.params.id)
  .then((book) => {
    res.status(200).json(humps.camelizeKeys(book[0]));
  })
  .catch((err) => {
    res.status(500);
  });
});

router.post('/books', (req, res) => {
  const book = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.coverUrl,
  };
  knex('books')
  .insert(book, '*')
  .then((book) => {
    res.status(200).json(humps.camelizeKeys(book[0]));
  })
  .catch((err) => {
    res.send(401, err);
  });
});

router.patch('/books/:id', (req, res) => {
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
    res.status(200).json(humps.camelizeKeys(BOOK));
  })
  .catch((err) => {
    res.send(401, err);
  });
});

router.delete('/books/:id', (req, res) => {
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
    res.status(200).json(humps.camelizeKeys(deletedBook[0]));
  })
  .catch((err) => {
    res.send(401);
  });
});

router.use((req, res) => {
  res.sendStatus(404);
});

module.exports = router;
