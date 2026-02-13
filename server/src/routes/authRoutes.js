import express from 'express';
import { syncUser, getCurrentUser, deleteAccount } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/sync', syncUser);

// Protected routes
router.use(protect);
router.get('/me', getCurrentUser);
router.delete('/account', deleteAccount);

export default router;
