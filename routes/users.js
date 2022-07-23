const UserRouter = require('express').Router();
const { getUsers, getUser, createUser, updateUser, updateAvatar } = require('../controllers/users');

UserRouter.get('/users', getUsers); // возвращает всех пользователей
UserRouter.get('/users/:userId', getUser); // возвращает пользователя по _id
UserRouter.post('/users', createUser); // создаёт пользователя
UserRouter.patch('/users/me', updateUser); // обновляет профиль
UserRouter.patch('/users/me/avatar', updateAvatar); // обновляет аватар

module.exports = UserRouter;
