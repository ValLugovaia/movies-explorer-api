class InternalServerError extends Error {
  constructor() {
    super();
    this.statusCode = 500;
    this.message = 'Произошла внутренняя ошибка сервера';
  }
}

module.exports = InternalServerError;
