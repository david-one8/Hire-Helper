import mongoose from 'mongoose';
import { REQUEST_STATUS } from '../config/constants.js';

const requestSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
      index: true,
    },
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    taskOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: [true, 'Request message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: Object.values(REQUEST_STATUS),
      default: REQUEST_STATUS.PENDING,
      index: true,
    },
    respondedAt: {
      type: Date,
    },
    responseMessage: {
      type: String,
      maxlength: [500, 'Response message cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes
requestSchema.index({ taskId: 1, requesterId: 1 }, { unique: true });
requestSchema.index({ taskOwnerId: 1, status: 1 });
requestSchema.index({ requesterId: 1, status: 1 });

// Virtual for requester details
requestSchema.virtual('requester', {
  ref: 'User',
  localField: 'requesterId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for task details
requestSchema.virtual('task', {
  ref: 'Task',
  localField: 'taskId',
  foreignField: '_id',
  justOne: true,
});

// Methods
requestSchema.methods.accept = function (message) {
  this.status = REQUEST_STATUS.ACCEPTED;
  this.respondedAt = new Date();
  if (message) this.responseMessage = message;
  return this.save();
};

requestSchema.methods.reject = function (message) {
  this.status = REQUEST_STATUS.REJECTED;
  this.respondedAt = new Date();
  if (message) this.responseMessage = message;
  return this.save();
};

const Request = mongoose.model('Request', requestSchema);

export default Request;
