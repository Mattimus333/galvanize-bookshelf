const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const humps = require('humps');
const env = process.env.NODE_ENV || 'development';
const config = require('../knexfile.js')[env];
const knex = require('knex')(config);
const ev = require('express-validation');
const validations = require('../validations/books');

router.get('/books', (req, res) => {
  knex('books')
  .orderBy('title')
  .then((books) => {
    res.status(200).json(humps.camelizeKeys(books));
  }).catch(() => {
    res.status(500);
  });
});

router.get('/books/:id', ev(validations.get), (req, res, next) => {
  // if (isNaN(req.params.id) || req.params.id < 0) {
  //   next();  // if id is not a number or is less than zero, next it to 404 in apps
  // }
  knex('books')
  .where('id', '=', req.params.id)
  .then((book) => {
    if (book.length === 0) {
      next();
    }
    res.status(200).json(humps.camelizeKeys(book[0]));
  })
  .catch(() => {
    res.status(500);
  });
});

router.post('/books', ev(validations.post), (req, res) => {
  const book = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.coverUrl,
  };
  // for (const property in book) {
  //   if (property === 'cover_url' && book[property] === undefined) {
  //     res.set('Content-Type', 'plain/text');
  //     res.status(400).send(`Cover URL must not be blank`);
  //   }
  //   else if (book[property] === undefined) {
  //     res.set('Content-Type', 'plain/text');
  //     res.status(400).send(`${property.charAt(0).toUpperCase() + property.slice(1)} must not be blank`);
  //   }
  // }
  knex('books')
  .insert(book, '*')
  .then((response) => {
    res.status(200).json(humps.camelizeKeys(response[0]));
  })
  .catch(() => {
    res.status(401);
  });
});

router.patch('/books/:id', ev(validations.get), (req, res, next) => {
  // if (isNaN(req.params.id) || req.params.id < 0) {
  //   next();  // if id is not a number or is less than zero, next it to 404 in apps
  // }
  const book = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.coverUrl,
  };
  knex('books')
  .where('id', '=', req.params.id)
  .update(book)
  .then(() => {
    book.id = parseInt(req.params.id, 10);
    res.status(200).json(humps.camelizeKeys(book));
  })
  .catch(() => {
    next();
  });
});

router.delete('/books/:id', ev(validations.get), (req, res, next) => {
  if (isNaN(req.params.id) || req.params.id < 0) {
    next();  // if id is not a number or is less than zero, next it to 404 in apps
  }
  let deletedBook;
  knex('books')
  .select('title', 'author', 'genre', 'description', 'cover_url')
  .where('id', '=', req.params.id)
  .then((book) =>{
    if (book.length === 0) {
      next();
    }
    deletedBook = book;
  })
  .catch(() => {
    res.status(400);
  });
  knex('books')
  .where('id', '=', req.params.id)
  .del()
  .then((book) =>{
    res.status(200).json(humps.camelizeKeys(deletedBook[0]));
  })
  .catch(() => {
    res.status(400);
  });
});

module.exports = router;
