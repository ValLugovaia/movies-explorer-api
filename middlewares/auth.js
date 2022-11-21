const jwt = require('jsonwebtoken');

const Unauthorized = require('../utils/Unauthorized');
const { UNAUTHORIZED_MESSAGE } = require('../utils/messages');

const { JWT_KEY } = require('../utils/config');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new Unauthorized(UNAUTHORIZED_MESSAGE));
    return;
  }

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
