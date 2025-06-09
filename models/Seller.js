const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Seller = sequelize.define('Seller', {
  // Model attributes correspond to table columns
  storeName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  storeDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contactNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
// Associations
Seller.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});
User.hasOne(Seller, {
  foreignKey: 'userId',
  as: 'seller'
});
const Product = require('./Product');
// Seller-Product association
Seller.hasMany(Product, {
  foreignKey: 'sellerId',
  as: 'products'
});
Product.belongsTo(Seller, {
  foreignKey: 'sellerId',
  as: 'seller'
});
module.exports = Seller;