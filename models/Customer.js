const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const customer = sequelize.define('Customer', {
  // Model attributes correspond to table columns
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'customers'
});
// Associations
customer.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});
User.hasOne(customer, {
  foreignKey: 'userId',
  as: 'customer'
});
module.exports = User;