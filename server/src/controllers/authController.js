const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const ApiError = require('../utils/ApiError');
const asyncWrapper = require('../utils/asyncWrapper');
const { sendTokenResponse } = require('../utils/jwt');

// @desc    Authenticate admin & get token
// @route   POST /api/auth/login
// @access  Public
const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;

  // Check for admin user
  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) {
    throw new ApiError(401, 'Invalid email or password credentials');
  }

  // Check if password matches
  const isMatch = await admin.matchPassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password credentials');
  }

  sendTokenResponse(admin, 200, res, 'Admin logged in successfully');
});

// @desc    Log out admin / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncWrapper(async (req, res) => {
  const isSecure =
    req.secure || req.headers['x-forwarded-proto'] === 'https';
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: isSecure,
    sameSite: isSecure ? 'none' : 'lax',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

// @desc    Get current authenticated admin
// @route   GET /api/auth/me
// @access  Public (returns success: false if not authenticated, no 401)
const getMe = asyncWrapper(async (req, res) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(200).json({ success: false });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    );
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(200).json({ success: false });
    }

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        email: admin.email,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    return res.status(200).json({ success: false });
  }
});

module.exports = {
  login,
  logout,
  getMe,
};
