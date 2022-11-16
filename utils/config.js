const {
  NODE_ENV, JWT_SECRET, PORT_ENV, MONGOOSE_DB_URL,
} = process.env;

const JWT_KEY = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
const PORT = NODE_ENV === 'production' ? PORT_ENV : 3000;
const DB_URL = NODE_ENV === 'production' ? MONGOOSE_DB_URL : 'mongodb://localhost:27017/moviesdb';

module.exports = { JWT_KEY, PORT, DB_URL };
