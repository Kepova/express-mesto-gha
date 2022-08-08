const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');

const JWT_SECRET = '4cd0e940dc8ed3847be726922d7252b954eeb37d95fbbb090d3e8a33dfafa7f8';
const SALT_ROUNDS = 10;

const CREATED = 201;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      next(err);
    });
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  if (!validator.isMongoId(userId)) {
    throw new BadRequestError('Передан некорректный _id пользователя');
  }
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Email или пароль не переданы');
  }
  if (!validator.isEmail(email)) {
    throw new BadRequestError('Email введен с ошибкой или не передан');
  }
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          res.status(CREATED).send({
            _id: user._id,
            email: user.email,
          });
        })
        .catch((err) => {
          if ((err.name === 'ValidationError') && (err.errors.avatar)) {
            next(new BadRequestError('Ссылка на аватар введена с ошибкой или не передана'));
          }
          if (err.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже существует'));
          }
          next(err);
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Email или пароль не переданы');
  }
  if (!validator.isEmail(email)) {
    throw new BadRequestError('Email введен с ошибкой или не передан');
  }
  User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send({ email: user.email });
    })
    .catch(next);
};

const getСurrentUser = (req, res, next) => {
  const userCurrentId = req.user._id;
  if (!validator.isMongoId(userCurrentId)) {
    throw new BadRequestError('Передан некорректный _id пользователя');
  }
  User.findById(userCurrentId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((newAvatar) => res.send(newAvatar))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      next(err);
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getСurrentUser,
};
