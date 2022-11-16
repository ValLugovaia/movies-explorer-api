const jwt = require('jsonwebtoken');

const Unauthorized = require('../utils/Unauthorized');
const { UNAUTHORIZED_MESSAGE } = require('../utils/ErrorMessages');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized(UNAUTHORIZED_MESSAGE);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new Unauthorized(UNAUTHORIZED_MESSAGE));
    return;
  }

  req.user = payload;
  next();
};
