const express = require('express');
const router = express.Router();
const {
  register,
  login,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/authController');
const { protect, checkAccountOwnership } = require('../middleware/authMiddleware');
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updateProfileValidation
} = require('../utils/validators');

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh-token', refreshToken);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidation, resetPassword);

// Protected routes
router.use(protect);
router.get('/me', getMe);
router.put('/profile', updateProfileValidation, updateProfile);
router.put('/change-password', changePassword);
router.post('/logout', logout);

module.exports = router;