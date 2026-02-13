import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS, REQUEST_STATUS, TASK_STATUS } from '../config/constants.js';
import Request from '../models/Request.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import AcceptedTask from '../models/AcceptedTask.js';
import { sendEmail } from '../utils/emailService.js';
import { createNotification } from '../services/notificationService.js';

// @desc    Create a help request
// @route   POST /api/requests
// @access  Private
export const createRequest = asyncHandler(async (req, res) => {
  const { taskId, message } = req.body;

  // Get task
  const task = await Task.findById(taskId).populate('userId', 'firstName lastName email');

  if (!task) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Task not found');
  }

  // Check if task is active
  if (task.status !== TASK_STATUS.ACTIVE) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'This task is no longer accepting requests');
  }

  // Check if user is task owner
  if (task.userId._id.toString() === req.user._id.toString()) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'You cannot request to help with your own task');
  }

  // Check if request already exists
  const existingRequest = await Request.findOne({
    taskId,
    requesterId: req.user._id,
  });

  if (existingRequest) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'You have already sent a request for this task');
  }

  // Create request
  const request = await Request.create({
    taskId,
    requesterId: req.user._id,
    taskOwnerId: task.userId._id,
    message,
  });

  // Increment task request count
  task.requestCount += 1;
  await task.save();

  // Populate request details
  await request.populate('requesterId', 'firstName lastName email profilePicture rating reviewCount');
  await request.populate('taskId', 'title location startTime');

  // Send notification to task owner
  await createNotification({
    userId: task.userId._id,
    type: 'request',
    title: 'New Help Request',
    message: `${req.user.firstName} ${req.user.lastName} requested to help with "${task.title}"`,
    relatedId: request._id,
    relatedModel: 'Request',
  });

  // Send email notification
  await sendEmail(
    task.userId.email,
    'requestReceived',
    {
      taskTitle: task.title,
      requesterName: `${req.user.firstName} ${req.user.lastName}`,
    }
  );

  res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(HTTP_STATUS.CREATED, request, 'Request sent successfully')
  );
});

// @desc    Get requests received for user's tasks
// @route   GET /api/requests/received
// @access  Private
export const getReceivedRequests = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = { taskOwnerId: req.user._id };

  if (status) {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const requests = await Request.find(query)
    .populate('requesterId', 'firstName lastName email profilePicture rating reviewCount')
    .populate('taskId', 'title location startTime picture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Request.countDocuments(query);

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, {
      requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    }, 'Received requests retrieved successfully')
  );
});

// @desc    Get requests sent by user
// @route   GET /api/requests/sent
// @access  Private
export const getSentRequests = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = { requesterId: req.user._id };

  if (status) {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const requests = await Request.find(query)
    .populate('taskOwnerId', 'firstName lastName email profilePicture')
    .populate('taskId', 'title location startTime picture status')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Request.countDocuments(query);

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, {
      requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    }, 'Sent requests retrieved successfully')
  );
});

// @desc    Get request by ID
// @route   GET /api/requests/:id
// @access  Private
export const getRequestById = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id)
    .populate('requesterId', 'firstName lastName email profilePicture rating reviewCount bio')
    .populate('taskOwnerId', 'firstName lastName email profilePicture')
    .populate('taskId', 'title description location startTime endTime picture budget');

  if (!request) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Request not found');
  }

  // Check authorization
  if (
    request.requesterId._id.toString() !== req.user._id.toString() &&
    request.taskOwnerId._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Not authorized to view this request');
  }

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, request, 'Request retrieved successfully')
  );
});

// @desc    Accept a request
// @route   PATCH /api/requests/:id/accept
// @access  Private
export const acceptRequest = asyncHandler(async (req, res) => {
  const { responseMessage } = req.body;

  const request = await Request.findById(req.params.id)
    .populate('requesterId', 'firstName lastName email')
    .populate('taskId', 'title userId status');

  if (!request) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Request not found');
  }

  // Check if user is task owner
  if (request.taskOwnerId.toString() !== req.user._id.toString()) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Not authorized to accept this request');
  }

  // Check if request is pending
  if (request.status !== REQUEST_STATUS.PENDING) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'This request has already been responded to');
  }

  // Check if task is still active
  const task = await Task.findById(request.taskId._id);
  if (task.status !== TASK_STATUS.ACTIVE) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'This task is no longer active');
  }

  // Accept request
  await request.accept(responseMessage);

  // Update task
  await task.assignHelper(request.requesterId._id);

  // Create accepted task record
  await AcceptedTask.create({
    taskId: task._id,
    helperId: request.requesterId._id,
    taskOwnerId: req.user._id,
  });

  // Reject all other pending requests for this task
  await Request.updateMany(
    {
      taskId: task._id,
      _id: { $ne: request._id },
      status: REQUEST_STATUS.PENDING,
    },
    {
      status: REQUEST_STATUS.REJECTED,
      respondedAt: new Date(),
      responseMessage: 'Task has been assigned to another helper',
    }
  );

  // Send notification to requester
  await createNotification({
    userId: request.requesterId._id,
    type: 'accepted',
    title: 'Request Accepted',
    message: `Your request to help with "${task.title}" has been accepted!`,
    relatedId: task._id,
    relatedModel: 'Task',
  });

  // Send email notification
  await sendEmail(
    request.requesterId.email,
    'requestAccepted',
    {
      taskTitle: task.title,
      ownerName: `${req.user.firstName} ${req.user.lastName}`,
    }
  );

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, request, 'Request accepted successfully')
  );
});

// @desc    Reject a request
// @route   PATCH /api/requests/:id/reject
// @access  Private
export const rejectRequest = asyncHandler(async (req, res) => {
  const { responseMessage } = req.body;

  const request = await Request.findById(req.params.id)
    .populate('requesterId', 'firstName lastName email')
    .populate('taskId', 'title');

  if (!request) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Request not found');
  }

  // Check if user is task owner
  if (request.taskOwnerId.toString() !== req.user._id.toString()) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Not authorized to reject this request');
  }

  // Check if request is pending
  if (request.status !== REQUEST_STATUS.PENDING) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'This request has already been responded to');
  }

  // Reject request
  await request.reject(responseMessage);

  // Send notification to requester
  await createNotification({
    userId: request.requesterId._id,
    type: 'rejected',
    title: 'Request Update',
    message: `Your request for "${request.taskId.title}" was not accepted`,
    relatedId: request.taskId._id,
    relatedModel: 'Task',
  });

  // Send email notification
  await sendEmail(
    request.requesterId.email,
    'requestRejected',
    {
      taskTitle: request.taskId.title,
    }
  );

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, request, 'Request rejected')
  );
});

// @desc    Delete a request
// @route   DELETE /api/requests/:id
// @access  Private
export const deleteRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Request not found');
  }

  // Only requester can delete their request
  if (request.requesterId.toString() !== req.user._id.toString()) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Not authorized to delete this request');
  }

  // Can only delete pending requests
  if (request.status !== REQUEST_STATUS.PENDING) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Can only delete pending requests');
  }

  await request.deleteOne();

  // Decrement task request count
  await Task.findByIdAndUpdate(request.taskId, { $inc: { requestCount: -1 } });

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, null, 'Request deleted successfully')
  );
});

// @desc    Get request statistics
// @route   GET /api/requests/stats/overview
// @access  Private
export const getRequestStats = asyncHandler(async (req, res) => {
  const receivedStats = await Request.aggregate([
    { $match: { taskOwnerId: req.user._id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const sentStats = await Request.aggregate([
    { $match: { requesterId: req.user._id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const formatStats = (stats) => {
    const formatted = { pending: 0, accepted: 0, rejected: 0 };
    stats.forEach((stat) => {
      formatted[stat._id] = stat.count;
    });
    formatted.total = Object.values(formatted).reduce((a, b) => a + b, 0);
    return formatted;
  };

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, {
      received: formatStats(receivedStats),
      sent: formatStats(sentStats),
    }, 'Request statistics retrieved successfully')
  );
});
