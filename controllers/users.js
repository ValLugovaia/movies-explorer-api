const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../utils/BadRequest');
const NotFound = require('../utils/NotFound');
const Conflict = require('../utils/Conflict');
const InternalServerError = require('../utils/InternalServerError');
const {
  CONFLICT_EMAIL,
  BAD_REQUEST_SIGNUP,
  BAD_REQUEST_UPDATE_USERINFO,
  NOT_FOUND_USER,
  SIGNIN_MESSAGE,
  SIGNOUT_MESSAGE,
} = require('../utils/messages');

const { JWT_KEY } = require('../utils/config');

module.exports.signin = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_KEY, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ token, message: SIGNIN_MESSAGE });
    })
    .catch(next);
};

module.exports.signup = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => res.status(201).send({
      user: {
        email: user.email,
        name: user.name,
        _id: user._id,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict(CONFLICT_EMAIL));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest(BAD_REQUEST_SIGNUP));
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports.signout = (req, res, next) => {
  User.findOne(req.body)
    .then(() => {
      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: true,
      })
        .send({ message: SIGNOUT_MESSAGE });
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFound(NOT_FOUND_USER);
    })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFound(NOT_FOUND_USER);
    })
    .then((user) => res.send({
      user: {
        email: user.email,
        name: user.name,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict(CONFLICT_EMAIL));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest(BAD_REQUEST_UPDATE_USERINFO));
      } else {
        next(new InternalServerError());
      }
    });
};
