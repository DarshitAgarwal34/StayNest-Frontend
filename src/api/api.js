import axios from 'axios';

const TOKEN_KEY = 'staynest_token';
const USER_KEY = 'staynest_user';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getStoredUser = () => {
  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('staynest-auth-change'));
  }
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event('staynest-auth-change'));
};

export const logoutUser = () => {
  clearToken();
};

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  const token = response.data?.data?.token;
  const user = response.data?.data?.user;

  if (token) {
    setToken(token);
  }

  if (user) {
    setStoredUser(user);
  }

  return response.data;
};

export const signupUser = async (payload) => {
  const response = await api.post('/auth/signup', payload);
  const token = response.data?.data?.token;
  const user = response.data?.data?.user;

  if (token) {
    setToken(token);
  }

  if (user) {
    setStoredUser(user);
  }

  return response.data;
};

export const fetchProperties = async () => {
  const response = await api.get('/properties');
  return response.data;
};

export const fetchAmenities = async () => {
  const response = await api.get('/amenities');
  return response.data;
};

export const fetchPosts = async () => {
  const response = await api.get('/posts');
  return response.data;
};

export const fetchServices = async () => {
  const response = await api.get('/services');
  return response.data;
};

export const forgotPassword = async (payload) => {
  const response = await api.post('/auth/forgot-password', payload);
  return response.data;
};

export const requestService = async (serviceId) => {
  const response = await api.post(`/services/${serviceId}/request`);
  return response.data;
};

export const createPost = async (postData) => {
  const response = await api.post('/posts', {
    content: postData.content,
    type: postData.type || 'general',
  });
  return response.data;
};

export const createProperty = async (payload) => {
  const formData = new FormData();
  formData.append('title', payload.title);
  formData.append('description', payload.description || '');
  formData.append('location', payload.location);
  formData.append('rent', String(payload.rent));
  formData.append('max_sharing', String(payload.max_sharing || 1));
  formData.append('amenity_ids', JSON.stringify(payload.amenity_ids || []));

  (payload.images || []).forEach((file) => {
    formData.append('images', file);
  });

  const response = await api.post('/properties', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const deleteProperty = async (propertyId) => {
  const response = await api.delete(`/properties/${propertyId}`);
  return response.data;
};

export const fetchMessages = async () => {
  const response = await api.get('/messages');
  return response.data;
};

export const fetchMessagesByConversation = async (conversationId) => {
  const response = await api.get(`/messages/conversation/${conversationId}`);
  return response.data;
};

export const sendConversationMessage = async (payload) => {
  const response = await api.post('/messages', payload);
  return response.data;
};

export const fetchMessagesWithUser = fetchMessagesByConversation;
export const sendDirectMessage = sendConversationMessage;

export const fetchConversations = async () => {
  const response = await api.get('/conversations');
  return response.data;
};

export const createConversation = async (payload) => {
  const response = await api.post('/conversations', payload);
  return response.data;
};

export const joinConversationThread = async (conversationId) => {
  const response = await api.post(`/conversations/${conversationId}/join`);
  return response.data;
};

export const createService = async (payload) => {
  const formData = new FormData();

  formData.append('title', payload.title);
  formData.append('description', payload.description || '');
  formData.append('price', String(payload.price));
  formData.append('location', payload.location);

  if (payload.image) {
    formData.append('image', payload.image);
  }

  const response = await api.post('/services', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const deleteService = async (serviceId) => {
  const response = await api.delete(`/services/${serviceId}`);
  return response.data;
};

export const fetchAdminOverview = async () => {
  const response = await api.get('/admin/overview');
  return response.data;
};

export const fetchAdminUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const deleteAdminUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

export const fetchAdminProperties = async () => {
  const response = await api.get('/admin/properties');
  return response.data;
};

export const deleteAdminProperty = async (propertyId) => {
  const response = await api.delete(`/admin/properties/${propertyId}`);
  return response.data;
};

export const fetchAdminPosts = async () => {
  const response = await api.get('/admin/posts');
  return response.data;
};

export const deleteAdminPost = async (postId) => {
  const response = await api.delete(`/admin/posts/${postId}`);
  return response.data;
};

export const fetchAdminServices = async () => {
  const response = await api.get('/admin/services');
  return response.data;
};

export const deleteAdminService = async (serviceId) => {
  const response = await api.delete(`/admin/services/${serviceId}`);
  return response.data;
};

export const fetchAdminReports = async () => {
  const response = await api.get('/admin/reports');
  return response.data;
};

export const markReportRead = async (reportId) => {
  const response = await api.patch(`/admin/reports/${reportId}/read`);
  return response.data;
};

export const fetchNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export default api;
