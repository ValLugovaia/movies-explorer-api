const moviesRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { regexp } = require('../utils/regexp');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

moviesRouter.get('/movies', getMovies);

moviesRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    image: Joi.string().required().regex(regexp),
    trailerLink: Joi.string().required().regex(regexp),
    thumbnail: Joi.string().required().regex(regexp),
  }),
}), createMovie);

moviesRouter.delete('/movies/_id', deleteMovie);

module.exports = moviesRouter;
