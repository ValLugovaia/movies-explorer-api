const usersRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { getUserInfo, updateUserInfo } = require('../controllers/users');

usersRouter.get('/users/me', getUserInfo);

usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);

module.exports = usersRouter;
