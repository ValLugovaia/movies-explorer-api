const { SERVER_ERROR_MESSAGE } = require('./messages');

class InternalServerError extends Error {
  constructor() {
    super();
    this.statusCode = 500;
    this.message = SERVER_ERROR_MESSAGE;
  }
}

module.exports = InternalServerError;
