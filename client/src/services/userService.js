import api from './api';

export const userService = {
  getUserProfile: async (userId) => {
    return await api.get(`/users/${userId}`);
  },

  updateUserProfile: async (userId, updates) => {
    return await api.patch(`/users/${userId}`, updates);
  },

  uploadProfilePicture: async (userId, imageData) => {
    return await api.post(`/users/${userId}/upload-picture`, {
      image: imageData,
    });
  },

  deleteAccount: async (userId) => {
    return await api.delete(`/users/${userId}`);
  },
};
