import Request from '../models/Request.js';

export const checkExistingRequest = async (taskId, requesterId) => {
  const request = await Request.findOne({ taskId, requesterId });
  return request;
};

export const getPendingRequestsForTask = async (taskId) => {
  const requests = await Request.find({ taskId, status: 'pending' });
  return requests;
};
