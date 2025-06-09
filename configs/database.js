// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables from .env file

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE||'../database/ecommerce.db', // This will create a file named ecommerce.db
  logging: process.env.DB_LOGGING === 'true' ? console.log : false, // Enable logging if DB_LOGGING is set to true
});

module.exports = sequelize;