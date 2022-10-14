const Movie = require('../models/movie');
const BadRequestError = require('../utils/errors/BadRequestError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ForbiddenError = require('../utils/errors/ForbiddenError');

module.exports.getMovie = (req, res, next) => {
  const owner = { _id: req.user._id };
  Movie.find({ owner })
    .then((movie) => res.send(movie))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const owner = { _id: req.user._id };
  Movie.create({ ...req.body, owner })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(new InternalServerError('Произошла ошибка на сервере'));
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    // eslint-disable-next-line consistent-return
    .then((movie) => {
      if (movie) {
        if (movie.owner.toString() === req.user._id.toString()) {
          Movie.findByIdAndRemove(req.params.movieId)
            .then((deleteMovie) => res.send(deleteMovie));
        } else {
          return next(new ForbiddenError('Нет прав для удаления фильма'));
        }
      } else {
        return next(new NotFoundError('Фильм с указанным id не найдена'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(new InternalServerError('Произошла ошибка на сервере'));
    });
};

