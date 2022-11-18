const Movie = require('../models/movie');
const BadRequest = require('../utils/BadRequest');
const Forbidden = require('../utils/Forbidden');
const NotFound = require('../utils/NotFound');
const InternalServerError = require('../utils/InternalServerError');
const {
  BAD_REQUEST_CREATE_MOVIE,
  BAD_REQUEST_DELETE_MOVIE,
  FORBIDDEN_DELETE_MOVIE,
  NOT_FOUND_MOVIE,
} = require('../utils/ErrorMessages');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .populate(['owner'])
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(BAD_REQUEST_CREATE_MOVIE));
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { _id } = req.params;

  Movie.findById({ _id })
    .then((movie) => {
      if (!movie) {
        next(new NotFound(NOT_FOUND_MOVIE));
      } else if (movie.owner.toString() !== req.user._id) {
        next(new Forbidden(FORBIDDEN_DELETE_MOVIE));
      } else {
        movie.remove()
          .then(() => res.send({ data: movie }))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(BAD_REQUEST_DELETE_MOVIE));
      } else {
        next(new InternalServerError());
      }
    });
};
