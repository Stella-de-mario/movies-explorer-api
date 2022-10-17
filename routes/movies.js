const router = require('express').Router();

const {
  getMovie,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  validateCreateMovie,
  validateDeleteMovie
} = require('../utils/constants');

router.get('/', getMovie);
router.post('/', validateCreateMovie, createMovie);
router.delete('/:movieId', validateDeleteMovie, deleteMovie);

module.exports = router;
