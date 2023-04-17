require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const routes = require('./routes');
const { error } = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');

const { PORT, DB_URL, allowedCors } = require('./utils/config');

const app = express();

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});

app.use(cors({
  origin: allowedCors,
  credentials: true,
}));

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(limiter);

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(error);

app.listen(PORT);
