const UserRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, updateUser, updateAvatar, getСurrentUser,
} = require('../controllers/users');

UserRouter.get('/users', getUsers); // возвращает всех пользователей
UserRouter.get('/users/me', getСurrentUser); // возвращает текущего пользователя
UserRouter.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  }),
  getUser,
); // возвращает пользователя по _id
UserRouter.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser,
); // обновляет профиль
UserRouter.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(/^(https?:\/\/)(www\.)?([\w\d\-.$])+[a-z]{2,10}\/(([a-z\d\W_-]{2,})*([#]$)?)?/),
    }),
  }),
  updateAvatar,
); // обновляет аватар

module.exports = UserRouter;
