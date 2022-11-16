const jwt = require('jsonwebtoken');

const Unauthorized = require('../utils/Unauthorized');
const { UNAUTHORIZED_MESSAGE } = require('../utils/ErrorMessages');

const { JWT_KEY } = require('../utils/config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized(UNAUTHORIZED_MESSAGE);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_KEY);
  } catch (err) {
    next(new Unauthorized(UNAUTHORIZED_MESSAGE));
    return;
  }

  req.user = payload;
  next();
};
