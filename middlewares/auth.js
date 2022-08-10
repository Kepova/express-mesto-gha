const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

const JWT_SECRET = '4cd0e940dc8ed3847be726922d7252b954eeb37d95fbbb090d3e8a33dfafa7f8';

module.exports = (req, res, next) => {
  const authorization = req.cookies;

  if (!authorization) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  const token = authorization.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  req.user = payload;
  next();
};
