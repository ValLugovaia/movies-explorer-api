const moviesRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { regexp } = require('../utils/regexp');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

moviesRouter.get('/movies', getMovies);

moviesRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.string().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(regexp),
    trailerLink: Joi.string().required().regex(regexp),
    thumbnail: Joi.string().required().regex(regexp),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

moviesRouter.delete('/movies/:_id', deleteMovie);

module.exports = moviesRouter;
