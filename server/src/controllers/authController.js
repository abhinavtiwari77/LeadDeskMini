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
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

// @desc    Get current authenticated admin
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncWrapper(async (req, res) => {
  const admin = await Admin.findById(req.admin.id);

  if (!admin) {
    throw new ApiError(404, 'Admin profile not found');
  }

  res.status(200).json({
    success: true,
    data: {
      id: admin._id,
      email: admin.email,
      createdAt: admin.createdAt,
    },
  });
});

module.exports = {
  login,
  logout,
  getMe,
};
