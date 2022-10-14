require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;
// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
  } catch (err) {
    return next(new UnauthorizedError('Пожалуйста, авторизуйтесь'));
  }
  req.user = payload;
  next();
};

module.exports = auth;
