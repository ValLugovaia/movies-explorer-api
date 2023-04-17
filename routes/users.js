const usersRouter = require('express').Router();
const { getUserInfo, updateUserInfo } = require('../controllers/users');
const { updateUserInfoValidation } = require('../middlewares/validation');

usersRouter.get('/users/me', getUserInfo);

usersRouter.patch('/users/me', updateUserInfoValidation, updateUserInfo);

module.exports = usersRouter;
