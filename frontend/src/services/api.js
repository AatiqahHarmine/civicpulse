const BASE_URL = import.meta.env.VITE_API_URL || 'https://civicpulse-h1eb.onrender.com/api';

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Authentication failed.');
      return data;
    },
    register: async (form) => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed.');
      return data;
    },
  },
  issues: {
    getAll: async (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE_URL}/issues${qs ? `?${qs}` : ''}`, {
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch issues.');
      return data;
    },
    getById: async (id) => {
      const res = await fetch(`${BASE_URL}/issues/${id}`, {
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch issue details.');
      return data;
    },
    create: async (form) => {
      const res = await fetch(`${BASE_URL}/issues`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Submission failed.');
      return data;
    },
    react: async (id, type) => {
      const res = await fetch(`${BASE_URL}/issues/${id}/react`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit reaction.');
      return data;
    },
    bulkUpdate: async (ids, status) => {
      const res = await fetch(`${BASE_URL}/issues/bulk`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ ids, status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed bulk update.');
      }
      return res;
    },
    update: async (id, form) => {
      const res = await fetch(`${BASE_URL}/issues/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update issue.');
      return data;
    },
    delete: async (id) => {
      const res = await fetch(`${BASE_URL}/issues/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete issue.');
      return data;
    },
  },
  comments: {
    getByIssueId: async (issueId) => {
      const res = await fetch(`${BASE_URL}/comments/issue/${issueId}`, {
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch comments.');
      return data;
    },
    create: async (issueId, text) => {
      const res = await fetch(`${BASE_URL}/comments`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ issueId, text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to post comment.');
      return data;
    },
  },
  analytics: {
    getKPIs: async () => {
      const res = await fetch(`${BASE_URL}/analytics/kpis`, {
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch KPIs.');
      return data;
    },
    getHeatmap: async () => {
      const res = await fetch(`${BASE_URL}/analytics/heatmap`, {
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch heatmap data.');
      return data;
    },
  },
  profile: {
    get: async () => {
      const res = await fetch(`${BASE_URL}/profile`, {
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch profile.');
      return data;
    },
  },
  notifications: {
    get: async () => {
      const res = await fetch(`${BASE_URL}/notifications`, {
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch notifications.');
      return data;
    },
    clear: async () => {
      const res = await fetch(`${BASE_URL}/notifications/clear`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to clear notifications.');
      return data;
    },
  },
};

