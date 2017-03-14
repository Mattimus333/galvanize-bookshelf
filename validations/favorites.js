const Joi = require('joi');

module.exports.get = {
  query: {
    bookId: Joi.number().integer().required(),
  },
};

module.exports.del = {
  body: {
    bookId: Joi.number().integer().required(),
  },
};

module.exports.post = {
  body: {
    bookId: Joi.number().integer().required(),
  },
};
