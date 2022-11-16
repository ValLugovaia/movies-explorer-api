const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../utils/BadRequest');
const NotFound = require('../utils/NotFound');
const Conflict = require('../utils/Conflict');
const InternalServerError = require('../utils/InternalServerError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.signin = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      return res.send({ token, email }).end();
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
        next(new Conflict('Пользователь с таким Email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports.signout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name } = req.body;

  User.findByIdAndUpdate(req.user._id, { name }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => res.send({ name: user.name }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      }
      next(new InternalServerError());
    });
};
