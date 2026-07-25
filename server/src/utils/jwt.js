const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const sendTokenResponse = (admin, statusCode, res, message = 'Success') => {
  const token = generateToken(admin._id);

  // Determine if the connection is secure (HTTPS behind proxy)
  const isSecure =
    res.req.secure || res.req.headers['x-forwarded-proto'] === 'https';

  // onrender.com subdomains are cross-site (onrender.com is on the PSL),
  // so the cookie MUST use SameSite=None + Secure for cross-site requests.
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? 'none' : 'lax',
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
