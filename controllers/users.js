const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const BadRequestError = require('../utils/errors/BadRequestError');
const ConflictingRequestError = require('../utils/errors/ConflictingRequestError');
const NotFoundError = require('../utils/errors/NotFoundError');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const InternalServerError = require('../utils/errors/InternalServerError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неправильные почта или пароль'));
      }
      // eslint-disable-next-line consistent-return
      bcrypt.compare(password, user.password).then((isUserValid) => {
        if (isUserValid) {
          const token = jwt.sign(
            {
              _id: user._id,
            },
            NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
          );
          res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          });
          res.send({ data: user.toJSON() });
        } else {
          return next(new UnauthorizedError('Неправильные почта или пароль'));
        }
      });
    })
    .catch(next);
};

module.exports.logOut = async (req, res) => res.status(200).clearCookie('jwt').send({});

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь с указанным id не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(new InternalServerError('Произошла ошибка на сервере'));
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      User.create({
        name,
        email,
        password: hashedPassword,
      })
      // eslint-disable-next-line no-shadow
        .then((user) => res.status(201).send(user))
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictingRequestError('Пользователь с таким email уже зарегистрирован'));
          } else if (err.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

// module.exports.getUserId = (req, res, next) => {
//   User.findById(req.params.userId)
//     .then((user) => {
//       if (!user) {
//         return next(new NotFoundError('Пользователь с указанным id не найден'));
//       }
//       return res.send(user);
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         return next(new BadRequestError('Переданы некорректные данные'));
//       }
//       return next(new InternalServerError('Произошла ошибка на сервере'));
//     });
// };

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(
    id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFoundError('Передан некорректный id');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};