import { body, param, query } from 'express-validator';

export const taskValidators = {
  create: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('startTime').isISO8601().withMessage('Valid start time is required'),
    body('endTime').optional().isISO8601().withMessage('Valid end time required'),
    body('budget').optional().isFloat({ min: 0 }).withMessage('Budget must be positive'),
    body('category').optional().isIn(['moving', 'cleaning', 'tech', 'gardening', 'painting', 'other']),
  ],

  update: [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
    body('startTime').optional().isISO8601().withMessage('Valid start time required'),
    body('endTime').optional().isISO8601().withMessage('Valid end time required'),
    body('budget').optional().isFloat({ min: 0 }).withMessage('Budget must be positive'),
    body('status').optional().isIn(['active', 'in_progress', 'completed', 'cancelled']),
  ],

  id: [param('id').isMongoId().withMessage('Invalid task ID')],
};

export const requestValidators = {
  create: [
    body('taskId').isMongoId().withMessage('Invalid task ID'),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ min: 10, max: 500 })
      .withMessage('Message must be between 10 and 500 characters'),
  ],

  respond: [
    body('status')
      .isIn(['accepted', 'rejected'])
      .withMessage('Status must be either accepted or rejected'),
    body('responseMessage')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Response message cannot exceed 500 characters'),
  ],

  id: [param('id').isMongoId().withMessage('Invalid request ID')],
};

export const userValidators = {
  update: [
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('First name must be between 1 and 50 characters'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name must be between 1 and 50 characters'),
    body('phoneNumber')
      .optional()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Bio cannot exceed 500 characters'),
  ],

  id: [param('id').isMongoId().withMessage('Invalid user ID')],
};

export const queryValidators = {
  pagination: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  ],

  taskFilter: [
    query('status').optional().isIn(['active', 'in_progress', 'completed', 'cancelled']),
    query('category').optional().isIn(['moving', 'cleaning', 'tech', 'gardening', 'painting', 'other']),
  ],
};
