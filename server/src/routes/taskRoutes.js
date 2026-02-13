import express from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  getMyTasks,
  updateTask,
  deleteTask,
  completeTask,
  getTaskStats,
} from '../controllers/taskController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { taskValidators, queryValidators } from '../utils/validators.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes (with optional auth for personalization)
router.get('/', optionalAuth, queryValidators.pagination, queryValidators.taskFilter, validate, getAllTasks);
router.get('/:id', taskValidators.id, validate, getTaskById);

// Protected routes
router.use(protect);
router.post('/', upload.single('picture'), taskValidators.create, validate, createTask);
router.get('/my/tasks', queryValidators.pagination, validate, getMyTasks);
router.get('/stats/overview', getTaskStats);
router.put('/:id', upload.single('picture'), taskValidators.id, taskValidators.update, validate, updateTask);
router.delete('/:id', taskValidators.id, validate, deleteTask);
router.patch('/:id/complete', taskValidators.id, validate, completeTask);

export default router;
