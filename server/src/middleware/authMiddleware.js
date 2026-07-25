const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const Admin = require('../models/Admin');
const asyncWrapper = require('../utils/asyncWrapper');

const protect = asyncWrapper(async (req, res, next) => {
  let token;

  // 1. Check HttpOnly Cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Fallback to Authorization Header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Unauthorized: Access denied. Please log in.');
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    );
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      throw new ApiError(401, 'Unauthorized: Admin user no longer exists.');
    }

    req.admin = admin;
    next();
  } catch (error) {
    throw new ApiError(401, 'Unauthorized: Invalid or expired token.');
  }
});

module.exports = { protect };
