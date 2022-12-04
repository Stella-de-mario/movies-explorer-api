require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const { JWT_DEV_KEY } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV_KEY);
  } catch (err) {
    return next(new UnauthorizedError('Пожалуйста, авторизуйтесь'));
  }
  req.user = payload;
  next();
};

module.exports = auth;