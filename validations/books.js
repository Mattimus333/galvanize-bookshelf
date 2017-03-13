const Joi = require('joi');

const schema = module.exports.get = {
  params: {
    id: Joi.number().greater(0),
  },
};
