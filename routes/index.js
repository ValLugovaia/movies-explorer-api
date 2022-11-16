const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFound = require('../utils/NotFound');
const { signin, signup, signout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { NOT_FOUND_PAGE } = require('../utils/ErrorMessages');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), signup);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), signin);
router.get('/signout', signout);

router.use('/', auth, usersRouter);
router.use('/', auth, moviesRouter);
router.use('*', auth, (req, res, next) => {
  next(new NotFound(NOT_FOUND_PAGE));
});

module.exports = router;
