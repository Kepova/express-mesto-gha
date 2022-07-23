const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const UserRouter = require('./routes/users');
const CardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '62da6e8ea34b9608c89abf58', // _id тестового пользователя
  };

  next();
});
app.use('/', UserRouter);
app.use('/', CardsRouter);

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
