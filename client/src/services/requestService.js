import api from './api';

export const requestService = {
  getUserRequests: async (userId) => {
    return await api.get(`/requests/user/${userId}`);
  },

  getTaskRequests: async (taskId) => {
    return await api.get(`/requests/task/${taskId}`);
  },

  sendRequest: async (requestData) => {
    return await api.post('/requests', requestData);
  },

  updateRequest: async (requestId, updates) => {
    return await api.patch(`/requests/${requestId}`, updates);
  },

  deleteRequest: async (requestId) => {
    return await api.delete(`/requests/${requestId}`);
  },
};
