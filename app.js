require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { login, createUser, logOut } = require('./controllers/users');
const { validateLogin, validateCreateUser } = require('./utils/constants');
const auth = require('./middlewares/auth');
const limiter = require('./middlewares/rateLimit');
const NotFoundError = require('./utils/errors/NotFoundError');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000, NODE_ENV, MONGO_URL } = process.env;
const app = express();

app.use(limiter);

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(cors);
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);
app.delete('/signout', logOut);

app.use(auth);

app.use('/movies', require('./routes/movies'));
app.use('/users', require('./routes/users'));

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

async function main() {
  await mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});
  await app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
};

main();