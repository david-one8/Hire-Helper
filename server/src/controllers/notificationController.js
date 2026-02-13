import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS } from '../config/constants.js';
import Notification from '../models/Notification.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly = false } = req.query;

  const query = { userId: req.user._id };

  if (unreadOnly === 'true') {
    query.read = false;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ userId: req.user._id, read: false });

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, {
      notifications,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    }, 'Notifications retrieved successfully')
  );
});

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Notification not found');
  }

  // Check ownership
  if (notification.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Not authorized');
  }

  await notification.markAsRead();

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, notification, 'Notification marked as read')
  );
});

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { userId: req.user._id, read: false },
    { read: true, readAt: new Date() }
  );

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, null, 'All notifications marked as read')
  );
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Notification not found');
  }

  // Check ownership
  if (notification.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Not authorized');
  }

  await notification.deleteOne();

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, null, 'Notification deleted successfully')
  );
});

// @desc    Delete all notifications
// @route   DELETE /api/notifications
// @access  Private
export const deleteAllNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ userId: req.user._id });

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, null, 'All notifications deleted')
  );
});

// @desc    Get unread count
// @route   GET /api/notifications/unread/count
// @access  Private
export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({ userId: req.user._id, read: false });

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, { count }, 'Unread count retrieved successfully')
  );
});
