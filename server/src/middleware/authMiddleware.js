import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS } from '../config/constants.js';
import getClerk from '../config/clerk.js';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Not authorized, no token provided');
  }

  try {
    // Verify JWT token with Clerk
    const payload = await getClerk().verifyToken(token);
    
    if (!payload || !payload.sub) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid token');
    }

    // Get user from database using Clerk user ID (sub claim)
    const user = await User.findOne({ clerkId: payload.sub });

    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not found');
    }

    if (!user.isActive) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Account is deactivated');
    }

    // Attach user to request
    req.user = user;
    req.clerkUserId = payload.sub;
    
    next();
  } catch (error) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      error.message || 'Not authorized, token verification failed'
    );
  }
});

export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const payload = await getClerk().verifyToken(token);
      const user = await User.findOne({ clerkId: payload.sub });
      
      if (user && user.isActive) {
        req.user = user;
        req.clerkUserId = payload.sub;
      }
    } catch (error) {
      // Continue without authentication
      console.log('Optional auth failed:', error.message);
    }
  }

  next();
});
