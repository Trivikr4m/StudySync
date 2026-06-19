import API from './api';

export const dashboardService = {
  getDashboardStats: async () => {
    const response = await API.get('/dashboard');
    return response.data;
  },
};

export default dashboardService;
