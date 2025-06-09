const winston = require('winston');
const path = require('path');
require('dotenv').config();

const levels = {
  error: 0, warn: 1, info: 2, http: 3, debug: 4,
};

const level = () => (process.env.NODE_ENV === 'development' ? 'debug' : 'http');

const colors = {
  error: 'red', warn: 'yellow', info: 'green', http: 'magenta', debug: 'white',
};
winston.addColors(colors);

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

const transports = [
  new winston.transports.Console({ format: consoleFormat }),
  new winston.transports.File({
    filename: path.join('logs', 'error.log'), level: 'error', format: fileFormat,
  }),
  new winston.transports.File({
    filename: path.join('logs', 'warn.log'), level: 'warn', format: fileFormat,
  }),
  new winston.transports.File({
    filename: path.join('logs', 'info.log'), level: 'info', format: fileFormat,
  }),
  new winston.transports.File({
    filename: path.join('logs', 'http.log'), level: 'http', format: fileFormat,
  }),
  new winston.transports.File({
    filename: path.join('logs', 'combined.log'), format: fileFormat,
  }),
];

if (process.env.NODE_ENV === 'development') {
  transports.push(
    new winston.transports.File({
      filename: path.join('logs', 'debug.log'), level: 'debug', format: fileFormat,
    }),
  );
}

const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
  exitOnError: false,
});

module.exports = logger;