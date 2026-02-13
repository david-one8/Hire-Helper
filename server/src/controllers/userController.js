import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS } from '../config/constants.js';
import User from '../models/User.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-__v');

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, user, 'User profile retrieved successfully')
  );
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phoneNumber, bio } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  // Update fields
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  if (bio !== undefined) user.bio = bio;

  await user.save();

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, user, 'Profile updated successfully')
  );
});

// @desc    Upload profile picture
// @route   POST /api/users/profile-picture
// @access  Private
export const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Please upload a file');
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  // Delete old image from cloudinary if exists
  if (user.profilePicture && user.profilePicture.publicId) {
    await deleteFromCloudinary(user.profilePicture.publicId);
  }

  // Upload new image
  const result = await uploadToCloudinary(req.file, 'profile-pictures');

  user.profilePicture = {
    url: result.url,
    publicId: result.publicId,
  };

  await user.save();

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, user, 'Profile picture uploaded successfully')
  );
});

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Private
export const getUserStats = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  const stats = {
    tasksCreated: user.tasksCreated,
    tasksCompleted: user.tasksCompleted,
    rating: user.rating,
    reviewCount: user.reviewCount,
  };

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, stats, 'User stats retrieved successfully')
  );
});
