const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Unauthorized = require('../utils/Unauthorized');
const { INCORRECT_EMAIL, UNAUTHORIZED_MESSAGE } = require('../utils/messages');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: INCORRECT_EMAIL,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized(UNAUTHORIZED_MESSAGE));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Unauthorized(UNAUTHORIZED_MESSAGE));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
