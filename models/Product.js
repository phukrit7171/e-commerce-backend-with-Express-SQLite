const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vendor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },

  images: {
    type: DataTypes.ARRAY(DataTypes.BLOB()), // Assuming images are stored as an array of binary large objects
    allowNull: false,

  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0.0
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  }
}, {
  timestamps: true,
  tableName: 'products'
});

module.exports = Product;