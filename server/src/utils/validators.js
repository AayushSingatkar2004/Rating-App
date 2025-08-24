import { body, query } from 'express-validator';

export const nameRule    = body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be 20–60 chars');
export const addressRule = body('address').isLength({ max: 400 }).withMessage('Address max 400 chars');
export const emailRule   = body('email').isEmail().withMessage('Invalid email');

export const passwordRule = body('password')
  .isLength({ min: 8, max: 16 }).withMessage('Password must be 8–16 chars')
  .matches(/[A-Z]/).withMessage('At least one uppercase letter')
  .matches(/[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]/).withMessage('At least one special character');

export const paginationRules = [
  query('page').optional().toInt().isInt({ min: 1 }),
  query('limit').optional().toInt().isInt({ min: 1, max: 100 }),
  query('sortBy').optional().isString(),
  query('order').optional().isIn(['asc','desc','ASC','DESC'])
];
