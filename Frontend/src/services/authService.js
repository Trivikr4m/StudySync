import API from './api';

export const authService = {
  login: async (credentials) => {
    const response = await API.post('/api/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await API.post('/api/auth/register', userData);
    return response.data;
  },
};

export default authService;
