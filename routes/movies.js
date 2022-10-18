const movieRouter = require('express').Router();

const {
  getMovie,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  validateCreateMovie,
  validateDeleteMovie
} = require('../utils/constants');

movieRouter.get('/movies', getMovie);
movieRouter.post('/movies', validateCreateMovie, createMovie);
movieRouter.delete('/movies/:movieId', validateDeleteMovie, deleteMovie);

module.exports = movieRouter;