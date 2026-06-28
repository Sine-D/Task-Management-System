const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
    body('email')
      .isEmail().withMessage('Provide a valid email')
      .custom(val => val.endsWith('@gmail.com')).withMessage('Only Gmail addresses are allowed')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/)
      .withMessage('Password must contain uppercase, lowercase, number and special character'),
  ],
  registerUser
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Provide a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  loginUser
);

router.get('/me', protect, getMe);

module.exports = router;
