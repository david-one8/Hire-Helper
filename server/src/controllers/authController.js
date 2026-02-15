import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS } from '../config/constants.js';
import User from '../models/User.js';
import getClerk from '../config/clerk.js';

// @desc    Sync user from Clerk to database
// @route   POST /api/auth/sync
// @access  Public
export const syncUser = asyncHandler(async (req, res) => {
  const { clerkId, firstName, lastName, email, profilePicture } = req.body;

  if (!clerkId || !email) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Clerk ID and email are required');
  }

  // Atomic upsert — avoids race conditions and duplicate key errors
  const updateData = {
    firstName,
    lastName,
    email,
  };
  if (profilePicture) {
    updateData.profilePicture = { url: profilePicture };
  }

  const user = await User.findOneAndUpdate(
    { clerkId },
    { $set: updateData, $setOnInsert: { clerkId } },
    { upsert: true, new: true, runValidators: true }
  );

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, user, 'User synced successfully')
  );
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-__v');

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, user, 'User retrieved successfully')
  );
});

// @desc    Delete user account
// @route   DELETE /api/auth/account
// @access  Private
export const deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  // Soft delete - deactivate account
  user.isActive = false;
  await user.save();

  // Optionally delete from Clerk as well
  try {
    await getClerk().users.deleteUser(user.clerkId);
  } catch (error) {
    console.error('Error deleting user from Clerk:', error);
  }

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, null, 'Account deleted successfully')
  );
});
