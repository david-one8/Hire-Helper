import api from './api';

export const taskService = {
  getAllTasks: async () => {
    return await api.get('/tasks');
  },

  getTaskById: async (id) => {
    return await api.get(`/tasks/${id}`);
  },

  getUserTasks: async (userId) => {
    return await api.get(`/tasks/user/${userId}`);
  },

  createTask: async (taskData) => {
    return await api.post('/tasks', taskData);
  },

  updateTask: async (id, updates) => {
    return await api.patch(`/tasks/${id}`, updates);
  },

  deleteTask: async (id) => {
    return await api.delete(`/tasks/${id}`);
  },
};
