const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const sendTokenResponse = (admin, statusCode, res, message = 'Success') => {
  const token = generateToken(admin._id);

  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: isProduction, // HTTPS in production
    sameSite: isProduction ? 'none' : 'lax', // cross-site allowed in prod if cross-domain
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      message,
      token, // Also send in response body for flexibility (e.g. cross-origin mobile or fallback header)
      data: {
        id: admin._id,
        email: admin.email,
      },
    });
};

module.exports = {
  generateToken,
  sendTokenResponse,
};
