const router = require('express').Router();
const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

const {
  validateUpdateUser
} = require('../utils/constants');

router.get('/me', getCurrentUser);
router.patch('/me', validateUpdateUser, updateUser);

module.exports = router;
