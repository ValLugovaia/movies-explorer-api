const limiter = require('express-rate-limit');

module.exports = limiter({
  windowMs: 90000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
