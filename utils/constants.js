const { celebrate, Joi } = require('celebrate');
// eslint-disable-next-line no-useless-escape
const regexUrl = /^https?:\/\/(www\.)?[a-zA-z\d\-]+\.[\w\d\-\._~:\/?#\[\]@!\$&'\(\)*\+,;=]{2,}#?$/;

const allowedCors = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://api.diploma.irinavladi.nomoredomains.icu',
  'https://api.diploma.irinavladi.nomoredomains.icu',
  'http://diploma.irinavladi.nomoredomains.icu',
  'https://diploma.irinavladi.nomoredomains.icu',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
});

const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(regexUrl).required(),
    trailerLink: Joi.string().pattern(regexUrl).required(),
    thumbnail: Joi.string().pattern(regexUrl).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports = {
  regexUrl,
  validateLogin,
  validateCreateUser,
  validateUpdateUser,
  validateDeleteMovie,
  validateCreateMovie,
  allowedCors,
  DEFAULT_ALLOWED_METHODS,
};
