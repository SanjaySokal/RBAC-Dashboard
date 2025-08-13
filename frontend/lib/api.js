const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    credentials: 'include', // Include cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Authentication API functions
export const authAPI = {
  login: (credentials) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData) => 
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  logout: () => 
    apiRequest('/auth/logout', {
      method: 'POST',
    }),

  getCurrentUser: () => 
    apiRequest('/auth/me'),
};

// Users API functions (admin only)
export const usersAPI = {
  getAll: () => 
    apiRequest('/users'),

  updateRole: (userId, role) => 
    apiRequest(`/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),

  delete: (userId) => 
    apiRequest(`/users/${userId}`, {
      method: 'DELETE',
    }),
};

// Content API functions
export const contentAPI = {
  getAll: () => 
    apiRequest('/content'),

  getById: (id) => 
    apiRequest(`/content/${id}`),

  create: (contentData) => 
    apiRequest('/content', {
      method: 'POST',
      body: JSON.stringify(contentData),
    }),

  update: (id, contentData) => 
    apiRequest(`/content/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(contentData),
    }),

  delete: (id) => 
    apiRequest(`/content/${id}`, {
      method: 'DELETE',
    }),
};

// Logs API functions (admin only)
export const logsAPI = {
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiRequest(`/logs?${searchParams.toString()}`);
  },

  getStats: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiRequest(`/logs/stats?${searchParams.toString()}`);
  },
};
