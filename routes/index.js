const router = require('express').Router();

const auth = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');

const { login, createUser, logOut } = require('../controllers/users');
const { validateLogin, validateCreateUser } = require('../utils/constants');
const NotFoundError = require('../utils/errors/NotFoundError');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

router.delete('/signout', logOut);


router.use(auth);
router.use(userRouter);
router.use(movieRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

module.exports = router;