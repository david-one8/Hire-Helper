const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  }

  async requestFormData(endpoint, formData, token) {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  }

  // Auth
  syncUser(userData, token) {
    return this.request('/auth/sync', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(userData),
    });
  }

  // Tasks
  getTasks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/tasks?${queryString}`);
  }

  getTaskById(id) {
    return this.request(`/tasks/${id}`);
  }

  getMyTasks(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/tasks/my/tasks?${queryString}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  createTask(taskData, token) {
    return this.request('/tasks', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(taskData),
    });
  }

  createTaskWithImage(formData, token) {
    return this.requestFormData('/tasks', formData, token);
  }

  // Requests
  createRequest(requestData, token) {
    return this.request('/requests', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(requestData),
    });
  }

  getReceivedRequests(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/requests/received?${queryString}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getSentRequests(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/requests/sent?${queryString}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  acceptRequest(requestId, responseMessage, token) {
    return this.request(`/requests/${requestId}/accept`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ responseMessage }),
    });
  }

  rejectRequest(requestId, responseMessage, token) {
    return this.request(`/requests/${requestId}/reject`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ responseMessage }),
    });
  }

  // Notifications
  getNotifications(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/notifications?${queryString}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getUnreadNotificationCount(token) {
    return this.request('/notifications/unread/count', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  markNotificationAsRead(notificationId, token) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  markAllNotificationsAsRead(token) {
    return this.request('/notifications/read-all', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  deleteNotification(notificationId, token) {
    return this.request(`/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  deleteAllNotifications(token) {
    return this.request('/notifications', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Users
  updateProfile(profileData, token) {
    return this.request('/users/profile', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(profileData),
    });
  }

  uploadProfilePicture(formData, token) {
    return this.requestFormData('/users/profile-picture', formData, token);
  }

  getReceivedRequestCount(token) {
    return this.request('/requests/received?limit=1&status=pending', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

export const api = new ApiClient();
export default api;
