import express from 'express';
import {
  createRequest,
  getReceivedRequests,
  getSentRequests,
  getRequestById,
  acceptRequest,
  rejectRequest,
  deleteRequest,
  getRequestStats,
} from '../controllers/requestController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { requestValidators, queryValidators } from '../utils/validators.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', requestValidators.create, validate, createRequest);
router.get('/received', queryValidators.pagination, validate, getReceivedRequests);
router.get('/sent', queryValidators.pagination, validate, getSentRequests);
router.get('/stats/overview', getRequestStats);
router.get('/:id', requestValidators.id, validate, getRequestById);
router.patch('/:id/accept', requestValidators.id, requestValidators.respond, validate, acceptRequest);
router.patch('/:id/reject', requestValidators.id, requestValidators.respond, validate, rejectRequest);
router.delete('/:id', requestValidators.id, validate, deleteRequest);

export default router;
