import API from './api';

export const userService = {
  getProfile: async () => {
    const response = await API.get('/api/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await API.put('/api/users/profile', profileData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await API.delete(`/api/users/${id}`);
    return response.data;
  },
};

export default userService;
