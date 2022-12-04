require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const router = require('./routes');
const limiter = require('./middlewares/rateLimit');
const errorHandler = require('./middlewares/errorHandler');
const { mongoAddress } = require('./utils/config');

const { PORT = 3000, NODE_ENV, MONGO_URL } = process.env;
const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(cors);
app.use(requestLogger);
app.use(limiter);
app.use(router);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

async function main() {
  await mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : mongoAddress, {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});
  await app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
};

main();