import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS, TASK_STATUS } from '../config/constants.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import Request from '../models/Request.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, category, location, startTime, endTime, budget } = req.body;

  // Validate start time is in the future
  if (new Date(startTime) < new Date()) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Start time must be in the future');
  }

  // Validate end time is after start time
  if (endTime && new Date(endTime) <= new Date(startTime)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'End time must be after start time');
  }

  const taskData = {
    userId: req.user._id,
    title,
    description,
    category,
    location,
    startTime,
    endTime,
    budget,
  };

  // Upload image if provided
  if (req.file) {
    const result = await uploadToCloudinary(req.file, 'tasks');
    taskData.picture = {
      url: result.url,
      publicId: result.publicId,
    };
  }

  const task = await Task.create(taskData);

  // Update user's task count
  await User.findByIdAndUpdate(req.user._id, { $inc: { tasksCreated: 1 } });

  // Populate creator details
  await task.populate('userId', 'firstName lastName email profilePicture rating reviewCount');

  res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(HTTP_STATUS.CREATED, task, 'Task created successfully')
  );
});

// @desc    Get all tasks (Feed)
// @route   GET /api/tasks
// @access  Public
export const getAllTasks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, category, search } = req.query;

  const query = {};

  // Filter by status (default to active)
  if (status) {
    query.status = status;
  } else {
    query.status = TASK_STATUS.ACTIVE;
  }

  // Filter by category
  if (category && category !== 'all') {
    query.category = category;
  }

  // Search functionality
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const tasks = await Task.find(query)
    .populate('userId', 'firstName lastName email profilePicture rating reviewCount')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Task.countDocuments(query);

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, {
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    }, 'Tasks retrieved successfully')
  );
});

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Public
export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('userId', 'firstName lastName email profilePicture rating reviewCount bio')
    .populate('acceptedHelper', 'firstName lastName email profilePicture rating reviewCount');

  if (!task) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Task not found');
  }

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, task, 'Task retrieved successfully')
  );
});

// @desc    Get user's own tasks
// @route   GET /api/tasks/my/tasks
// @access  Private
export const getMyTasks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = { userId: req.user._id };

  if (status) {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const tasks = await Task.find(query)
    .populate('acceptedHelper', 'firstName lastName email profilePicture rating')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Task.countDocuments(query);

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, {
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    }, 'Your tasks retrieved successfully')
  );
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Task not found');
  }

  // Check ownership
  if (task.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Not authorized to update this task');
  }

  // Don't allow updating completed or cancelled tasks
  if (task.status === TASK_STATUS.COMPLETED || task.status === TASK_STATUS.CANCELLED) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Cannot update ${task.status} task`);
  }

  const { title, description, category, location, startTime, endTime, budget, status } = req.body;

  // Update fields
  if (title) task.title = title;
  if (description) task.description = description;
  if (category) task.category = category;
  if (location) task.location = location;
  if (startTime) task.startTime = startTime;
  if (endTime) task.endTime = endTime;
  if (budget !== undefined) task.budget = budget;
  if (status) task.status = status;

  // Upload new image if provided
  if (req.file) {
    // Delete old image
    if (task.picture && task.picture.publicId) {
      await deleteFromCloudinary(task.picture.publicId);
    }

    const result = await uploadToCloudinary(req.file, 'tasks');
    task.picture = {
      url: result.url,
      publicId: result.publicId,
    };
  }

  await task.save();

  await task.populate('userId', 'firstName lastName email profilePicture rating reviewCount');

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, task, 'Task updated successfully')
  );
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Task not found');
  }

  // Check ownership
  if (task.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Not authorized to delete this task');
  }

  // Don't allow deleting tasks that are in progress
  if (task.status === TASK_STATUS.IN_PROGRESS) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Cannot delete task that is in progress');
  }

  // Delete image from cloudinary
  if (task.picture && task.picture.publicId) {
    await deleteFromCloudinary(task.picture.publicId);
  }

  // Delete associated requests
  await Request.deleteMany({ taskId: task._id });

  await task.deleteOne();

  // Update user's task count
  await User.findByIdAndUpdate(req.user._id, { $inc: { tasksCreated: -1 } });

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, null, 'Task deleted successfully')
  );
});

// @desc    Mark task as completed
// @route   PATCH /api/tasks/:id/complete
// @access  Private
export const completeTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Task not found');
  }

  // Check ownership
  if (task.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Not authorized to complete this task');
  }

  if (task.status !== TASK_STATUS.IN_PROGRESS) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Only in-progress tasks can be completed');
  }

  await task.markCompleted();

  // Update helper's completed task count
  if (task.acceptedHelper) {
    await User.findByIdAndUpdate(task.acceptedHelper, { $inc: { tasksCompleted: 1 } });
  }

  await task.populate('userId', 'firstName lastName email');
  await task.populate('acceptedHelper', 'firstName lastName email');

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, task, 'Task marked as completed')
  );
});

// @desc    Get task statistics
// @route   GET /api/tasks/stats/overview
// @access  Private
export const getTaskStats = asyncHandler(async (req, res) => {
  const stats = await Task.aggregate([
    { $match: { userId: req.user._id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const formattedStats = {
    active: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
  };

  stats.forEach((stat) => {
    formattedStats[stat._id] = stat.count;
  });

  formattedStats.total = Object.values(formattedStats).reduce((a, b) => a + b, 0);

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, formattedStats, 'Task statistics retrieved successfully')
  );
});
