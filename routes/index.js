const router = require('express').Router();

const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFound = require('../utils/NotFound');
const { signin, signup, signout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { NOT_FOUND_PAGE } = require('../utils/ErrorMessages');
const { signinValidation, signupValidation } = require('../middlewares/validation');

router.post('/signup', signupValidation, signup);
router.post('/signin', signinValidation, signin);
router.get('/signout', signout);

router.use('/', auth, usersRouter);
router.use('/', auth, moviesRouter);
router.use('*', auth, (req, res, next) => {
  next(new NotFound(NOT_FOUND_PAGE));
});

module.exports = router;
