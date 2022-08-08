const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const UserRouter = require('./routes/users');
const CardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const CentralizedError = require('./errors/centralized-error');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cookieParser());
app.use(bodyParser.json());

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(/^(https?:\/\/)(www\.)?([\w\d\-.$])+[a-z]{2,10}\/(([a-z\d\W_-]{2,})*([#]$)?)?/),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);

app.use(auth);
app.use('/', UserRouter);
app.use('/', CardsRouter);

app.use(errors());
app.use(CentralizedError);

app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});
app.listen(PORT);
