const Joi = require('joi');

module.exports.get = {
  params: {
    id: Joi.number().integer().greater(0),
  },
};

module.exports.post = {
  body: {
    title: Joi.string().required(),
    author: Joi.string().required(),
    genre: Joi.string().required(),
    description: Joi.string().required(),
    conver_url: Joi.required(),
  },
};

module.exports.patch = {
  params: {
    id: Joi.number().greater(0),
  },
};

module.exports.delete = {
  params: {
    id: Joi.number().greater(0),
  },
};
