import mongoose from 'mongoose';
import { TASK_STATUS, TASK_CATEGORIES } from '../config/constants.js';

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      enum: TASK_CATEGORIES,
      default: 'other',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(TASK_STATUS),
      default: TASK_STATUS.ACTIVE,
      index: true,
    },
    budget: {
      type: Number,
      min: [0, 'Budget cannot be negative'],
    },
    picture: {
      url: String,
      publicId: String,
    },
    requestCount: {
      type: Number,
      default: 0,
    },
    acceptedHelper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ status: 1, startTime: 1 });
taskSchema.index({ category: 1, status: 1 });
taskSchema.index({ createdAt: -1 });

// Virtual for creator details
taskSchema.virtual('creator', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Methods
taskSchema.methods.markCompleted = function () {
  this.status = TASK_STATUS.COMPLETED;
  this.completedAt = new Date();
  return this.save();
};

taskSchema.methods.assignHelper = function (helperId) {
  this.acceptedHelper = helperId;
  this.status = TASK_STATUS.IN_PROGRESS;
  return this.save();
};

// Middleware
taskSchema.pre('save', function (next) {
  if (this.endTime && this.startTime && this.endTime < this.startTime) {
    next(new Error('End time must be after start time'));
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
