const { body, validationResult } = require('express-validator');

// Simple validation middleware - FIXED
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({
    success: false,
    errors: errors.array()
  });
};

// Registration validation
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .toLowerCase()
    .isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
  validate
];

// Login validation
const loginValidation = [
  body('email')
    .trim()
    .toLowerCase()
    .isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate
];

// Forgot password validation
const forgotPasswordValidation = [
  body('email')
    .trim()
    .toLowerCase()
    .isEmail().withMessage('Please provide a valid email address'),
  validate
];

// Reset password validation
const resetPasswordValidation = [
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
  validate
];

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};