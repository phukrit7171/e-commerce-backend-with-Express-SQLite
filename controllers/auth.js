const jwt = require('jsonwebtoken');
const { User, Cart, Wishlist } = require('../models');
const ApiError = require('../utils/apiError');
const logger = require('../config/logger');
require('dotenv').config();

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || '30d',
  });
};

const signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, address, phone } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return next(new ApiError(400, 'Please provide all required fields.'));
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(new ApiError(400, 'Email already exists.'));
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash: password, // Hashing should be done in the model or a service
      address,
      phone,
    });

    // Create associated Cart and Wishlist
    await Cart.create({ userId: user.id });
    await Wishlist.create({ userId: user.id });

    const token = signToken(user.id);
    res.status(201).json({
      status: 'success',
      token,
      data: { user },
    });
  } catch (error) {
    logger.error('Signup error:', error);
    next(new ApiError(500, 'Internal server error'));
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, 'Please provide email and password.'));
    }

    const user = await User.findOne({ where: { email } });
    if (!user || user.passwordHash !== password) { // Password hashing should be handled securely
      return next(new ApiError(401, 'Incorrect email or password.'));
    }

    const token = signToken(user.id);
    res.status(200).json({
      status: 'success',
      token,
      data: { user },
    });
  } catch (error) {
    logger.error('Login error:', error);
    next(new ApiError(500, 'Internal server error'));
  }
};

const logout = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
};

const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return next(new ApiError(400, 'Please provide a token.'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return next(new ApiError(401, 'User not found.'));
    }

    const newToken = signToken(user.id);
    res.status(200).json({
      status: 'success',
      token: newToken,
      data: { user },
    });
  } catch (error) {
    logger.error('Refresh token error:', error);
    next(new ApiError(500, 'Internal server error'));
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user; // User is set by the protect middleware
    if (!user) {
      return next(new ApiError(401, 'You are not logged in.'));
    }
    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    logger.error('Get current user error:', error);
    next(new ApiError(500, 'Internal server error'));
  }
};
module.exports = {
  signup,
  login,
  logout,
  refreshToken,
  getCurrentUser,
};
// Exporting the functions for use in routes