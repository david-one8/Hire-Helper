const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this._refreshingToken = null;
  }

  // Get Clerk token automatically (always fresh to avoid expired-token 401s)
  async getToken() {
    try {
      if (window.Clerk?.session) {
        return await window.Clerk.session.getToken({ skipCache: true });
      }
      return null;
    } catch (error) {
      console.error('Failed to get Clerk token:', error);
      return null;
    }
  }

  // Force refresh the Clerk token (bypasses cache)
  async forceRefreshToken() {
    try {
      // Avoid multiple simultaneous refreshes
      if (this._refreshingToken) {
        return await this._refreshingToken;
      }
      this._refreshingToken = (async () => {
        if (window.Clerk?.session) {
          return await window.Clerk.session.getToken({ skipCache: true });
        }
        return null;
      })();
      const token = await this._refreshingToken;
      this._refreshingToken = null;
      return token;
    } catch (error) {
      this._refreshingToken = null;
      console.error('Failed to force refresh Clerk token:', error);
      return null;
    }
  }

  // Main request method with automatic auth and 401 retry
  async request(endpoint, options = {}, _isRetry = false) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Automatically get token if not provided
    const token = options.token || await this.getToken();
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Handle non-JSON responses (e.g. 429 rate limit plain text)
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text || response.statusText };
      }

      if (!response.ok) {
        // On 401, try once with a force-refreshed token
        if (response.status === 401 && !_isRetry) {
          const freshToken = await this.forceRefreshToken();
          if (freshToken && freshToken !== token) {
            return this.request(endpoint, { ...options, token: freshToken }, true);
          }
        }
        // Include field-level validation errors in the message
        let errorMsg = data.message || `HTTP ${response.status}: ${response.statusText}`;
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          const fieldErrors = data.errors.map(e => e.message || e.msg).filter(Boolean);
          if (fieldErrors.length > 0) {
            errorMsg = fieldErrors.join(', ');
          }
        }
        throw new Error(errorMsg);
      }

      return data;
    } catch (error) {
      if (_isRetry || !error.message?.includes('401')) {
        console.error(`API Error [${endpoint}]:`, error.message);
      }
      throw error;
    }
  }

  // Form data request (for file uploads) with 401 retry
  async requestFormData(endpoint, formData, token = null, _isRetry = false) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Automatically get token if not provided
    const authToken = token || await this.getToken();

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        body: formData,
      });

      // Handle non-JSON responses (e.g. 429 rate limit plain text)
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text || response.statusText };
      }

      if (!response.ok) {
        // On 401, try once with a force-refreshed token
        if (response.status === 401 && !_isRetry) {
          const freshToken = await this.forceRefreshToken();
          if (freshToken && freshToken !== token) {
            return this.requestFormData(endpoint, formData, freshToken, true);
          }
        }
        // Include field-level validation errors in the message
        let errorMsg = data.message || `HTTP ${response.status}: ${response.statusText}`;
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          const fieldErrors = data.errors.map(e => e.message || e.msg).filter(Boolean);
          if (fieldErrors.length > 0) {
            errorMsg = fieldErrors.join(', ');
          }
        }
        throw new Error(errorMsg);
      }

      return data;
    } catch (error) {
      if (_isRetry || !error.message?.includes('401')) {
        console.error(`API Error [${endpoint}]:`, error.message);
      }
      throw error;
    }
  }

  // ==================== AUTH ====================
  async syncUser(userData, token = null) {
    return this.request('/auth/sync', {
      method: 'POST',
      body: JSON.stringify(userData),
      token,
    });
  }

  // ==================== TASKS ====================
  async getTasks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';
    return this.request(endpoint);
  }

  async getTaskById(id) {
    return this.request(`/tasks/${id}`);
  }

  async getMyTasks(params = {}, token = null) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/tasks/my/tasks?${queryString}` : '/tasks/my/tasks';
    return this.request(endpoint, { token });
  }

  async createTask(taskData, token = null) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
      token,
    });
  }

  async createTaskWithImage(formData, token = null) {
    return this.requestFormData('/tasks', formData, token);
  }

  async updateTask(taskId, taskData, token = null) {
    return this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
      token,
    });
  }

  async deleteTask(taskId, token = null) {
    return this.request(`/tasks/${taskId}`, {
      method: 'DELETE',
      token,
    });
  }

  // ==================== REQUESTS ====================
  async createRequest(requestData, token = null) {
    return this.request('/requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
      token,
    });
  }

  async getReceivedRequests(params = {}, token = null) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/requests/received?${queryString}` : '/requests/received';
    return this.request(endpoint, { token });
  }

  async getSentRequests(params = {}, token = null) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/requests/sent?${queryString}` : '/requests/sent';
    return this.request(endpoint, { token });
  }

  async getReceivedRequestCount(token = null) {
    return this.request('/requests/received?limit=1&status=pending', { token });
  }

  async acceptRequest(requestId, responseMessage = '', token = null) {
    return this.request(`/requests/${requestId}/accept`, {
      method: 'PATCH',
      body: JSON.stringify({ responseMessage }),
      token,
    });
  }

  async rejectRequest(requestId, responseMessage = '', token = null) {
    return this.request(`/requests/${requestId}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ responseMessage }),
      token,
    });
  }

  async cancelRequest(requestId, token = null) {
    return this.request(`/requests/${requestId}/cancel`, {
      method: 'PATCH',
      token,
    });
  }

  // ==================== NOTIFICATIONS ====================
  async getNotifications(params = {}, token = null) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/notifications?${queryString}` : '/notifications';
    return this.request(endpoint, { token });
  }

  async getUnreadNotificationCount(token = null) {
    return this.request('/notifications/unread/count', { token });
  }

  async markNotificationAsRead(notificationId, token = null) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
      token,
    });
  }

  async markAllNotificationsAsRead(token = null) {
    return this.request('/notifications/read-all', {
      method: 'PATCH',
      token,
    });
  }

  async deleteNotification(notificationId, token = null) {
    return this.request(`/notifications/${notificationId}`, {
      method: 'DELETE',
      token,
    });
  }

  async deleteAllNotifications(token = null) {
    return this.request('/notifications', {
      method: 'DELETE',
      token,
    });
  }

  // ==================== USERS / PROFILE ====================
  async getProfile(token = null) {
    return this.request('/users/profile', { token });
  }

  async updateProfile(profileData, token = null) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
      token,
    });
  }

  async uploadProfilePicture(formData, token = null) {
    return this.requestFormData('/users/profile-picture', formData, token);
  }

  async getUserById(userId, token = null) {
    return this.request(`/users/${userId}`, { token });
  }

  // ==================== HEALTH CHECK ====================
  async healthCheck() {
    return this.request('/health');
  }
}

// Create singleton instance
export const api = new ApiClient();

// Export individual methods for convenience
export const {
  syncUser,
  getTasks,
  getTaskById,
  getMyTasks,
  createTask,
  createTaskWithImage,
  updateTask,
  deleteTask,
  createRequest,
  getReceivedRequests,
  getSentRequests,
  getReceivedRequestCount,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
  getProfile,
  updateProfile,
  uploadProfilePicture,
  getUserById,
  healthCheck,
} = api;

export default api;
