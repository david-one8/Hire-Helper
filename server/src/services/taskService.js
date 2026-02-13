import Task from '../models/Task.js';
import Request from '../models/Request.js';

export const getTaskWithDetails = async (taskId) => {
  const task = await Task.findById(taskId)
    .populate('userId', 'firstName lastName email profilePicture rating reviewCount')
    .populate('acceptedHelper', 'firstName lastName email profilePicture rating reviewCount');

  return task;
};

export const getTaskRequests = async (taskId) => {
  const requests = await Request.find({ taskId })
    .populate('requesterId', 'firstName lastName email profilePicture rating reviewCount')
    .sort({ createdAt: -1 });

  return requests;
};
