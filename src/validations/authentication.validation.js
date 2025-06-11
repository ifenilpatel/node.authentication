import { body } from 'express-validator';

export const fullname = body('fullname').notEmpty().withMessage('Fullname is required');

export const email = body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email is not valid').normalizeEmail();

export const password = body('password').notEmpty().withMessage('Password is required');

export const confirmPassword = body('confirmPassword')
  .notEmpty()
  .withMessage('Confirm Password is required')
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  });

export const refreshToken = body('refreshToken').notEmpty().withMessage('Refresh token is required');
