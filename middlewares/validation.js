const { Joi, celebrate } = require('celebrate');
const { regexp } = require('../utils/regexp');
const { INCORRECT_EMAIL, MAX_NAME, MIN_NAME } = require('../utils/messages');

module.exports.signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .messages({
        'string.email': INCORRECT_EMAIL,
      }),
    password: Joi.string().required(),
  }),
});

module.exports.signupValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .messages({
        'string.email': INCORRECT_EMAIL,
      }),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': MIN_NAME,
        'string.max': MAX_NAME,
      }),
  }),
});

module.exports.updateUserInfoValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .messages({
        'string.email': INCORRECT_EMAIL,
      }),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': MIN_NAME,
        'string.max': MAX_NAME,
      }),
  }),
});

module.exports.createMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(regexp),
    trailerLink: Joi.string().required().regex(regexp),
    thumbnail: Joi.string().required().regex(regexp),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});
