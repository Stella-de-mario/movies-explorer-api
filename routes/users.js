const userRouter = require('express').Router();

const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

const {
  validateUpdateUser
} = require('../utils/constants');

userRouter.get('/users/me', getCurrentUser);
userRouter.patch('/users/me', validateUpdateUser, updateUser);

module.exports = userRouter;