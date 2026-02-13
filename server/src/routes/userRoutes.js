import express from 'express';
import {
  getUserProfile,
  updateProfile,
  uploadProfilePicture,
  getUserStats,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { userValidators } from '../utils/validators.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/:id', userValidators.id, validate, getUserProfile);

// Protected routes with real Clerk authentication
router.use(protect);
router.put('/profile', userValidators.update, validate, updateProfile);
router.post('/profile-picture', upload.single('profilePicture'), uploadProfilePicture);
router.get('/stats/overview', getUserStats);

export default router;
