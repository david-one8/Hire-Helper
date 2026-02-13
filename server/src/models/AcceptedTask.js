import mongoose from 'mongoose';

const acceptedTaskSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    helperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    taskOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['accepted', 'in_progress', 'completed', 'cancelled'],
      default: 'accepted',
    },
    acceptedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      maxlength: [500, 'Review cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
acceptedTaskSchema.index({ helperId: 1, status: 1 });
acceptedTaskSchema.index({ taskOwnerId: 1, status: 1 });
acceptedTaskSchema.index({ taskId: 1 }, { unique: true });

const AcceptedTask = mongoose.model('AcceptedTask', acceptedTaskSchema);

export default AcceptedTask;
