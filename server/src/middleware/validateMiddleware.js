const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err.errors) {
      const formattedErrors = err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return next(
        new ApiError(
          422,
          'Validation Error: Please check required fields.',
          formattedErrors
        )
      );
    }
    return next(new ApiError(400, 'Invalid payload structure.'));
  }
};

module.exports = validate;
