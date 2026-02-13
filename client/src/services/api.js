import { useAuth } from '@clerk/clerk-react';

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

  createTask(taskData, token) {
    return this.request('/tasks', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(taskData),
    });
  }

  // Requests
  createRequest(requestData, token) {
    return this.request('/requests', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(requestData),
    });
  }

  getReceivedRequests(token) {
    return this.request('/requests/received', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getSentRequests(token) {
    return this.request('/requests/sent', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Notifications
  getNotifications(token) {
    return this.request('/notifications', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

export const api = new ApiClient();
export default api;
