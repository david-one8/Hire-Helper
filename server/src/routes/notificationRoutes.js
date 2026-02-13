import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { queryValidators } from '../utils/validators.js';
import { param } from 'express-validator';

const router = express.Router();

// All routes are protected with real Clerk authentication
router.use(protect);

router.get('/', queryValidators.pagination, validate, getNotifications);
router.get('/unread/count', getUnreadCount);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', param('id').isMongoId(), validate, markAsRead);
router.delete('/:id', param('id').isMongoId(), validate, deleteNotification);
router.delete('/', deleteAllNotifications);

export default router;
