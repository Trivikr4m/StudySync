import API from './api';

export const taskService = {
  getTasksByGroup: async (groupId) => {
    const response = await API.get(`/tasks/group/${groupId}`);
    return response.data;
  },

  getTaskById: async (id) => {
    const response = await API.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await API.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await API.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await API.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default taskService;
