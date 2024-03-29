const {
  NODE_ENV, JWT_SECRET, PORT_ENV, DB_URL_ENV,
} = process.env;

const JWT_KEY = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
const PORT = NODE_ENV === 'production' ? PORT_ENV : 3000;
const DB_URL = NODE_ENV === 'production' ? DB_URL_ENV : 'mongodb://localhost:27017/moviesdb';

const allowedCors = [
  'http://localhost:3000',
  'localhost:3000',
  'http://localhost:8000',
  'localhost:8000',
  'https://movies-explorer.vaal.nomoredomains.icu',
  'http://movies-explorer.vaal.nomoredomains.icu',
  'http://1398493-ct78522.tw1.ru',
  'https://1398493-ct78522.tw1.ru',
];

module.exports = {
  JWT_KEY, PORT, DB_URL, allowedCors,
};
