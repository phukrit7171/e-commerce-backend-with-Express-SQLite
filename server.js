require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const logger = require('./config/logger');
const db = require('./models');
const mainRouter = require('./routes');
const ApiError = require('./utils/apiError');
const fs = require('fs');
const { time } = require('console');

// Create logs directory if it doesn't exist
const logsDir = './logs';
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

const app = express();
const PORT = process.env.PORT || 3000;

// GLOBAL MIDDLEWARE
const stream = {
  write: (message) => logger.http(message.trim()),
};
const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream }
);
app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set request start time for later use in logging
app.use((req, res, next) => {
  req.startTime = Date.now();
  next();
});

// API ROUTES
app.use('/api/v1', mainRouter);

// GLOBAL ERROR HANDLING
app.all('*', (req, res, next) => {
  next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`));
});

app.use((err, req, res, next) => {
  logger.error(err.message, {
    statusCode: err.statusCode || 500,
    status: err.status || 'error',
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    responseTime: `${Date.now() - req.startTime}ms`,
    time: new Date().toISOString()
  });

  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
  });
});

// SERVER INITIALIZATION
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    logger.info('Database connection established successfully.');
    await db.sequelize.sync({ alter: true });
    logger.info('All models were synchronized successfully.');
    app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server or connect to database.', {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

startServer();


// Export the app for testing purposes
module.exports = app;