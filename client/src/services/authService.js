import API from './api';

export const authService = {
  login: async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await API.post('/auth/register', userData);
    return response.data;
  },

  getMe: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },
};
