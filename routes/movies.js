const moviesRouter = require('express').Router();

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { createMovieValidation } = require('../middlewares/validation');

moviesRouter.get('/movies', getMovies);

moviesRouter.post('/movies', createMovieValidation, createMovie);

moviesRouter.delete('/movies/:_id', deleteMovie);

module.exports = moviesRouter;
