import API from './api';

export const resourceService = {
  getResourcesByGroup: async (groupId) => {
    const response = await API.get(`/resources/group/${groupId}`);
    return response.data;
  },

  uploadResource: async (resourceData) => {
    const response = await API.post('/resources', resourceData);
    return response.data;
  },

  deleteResource: async (id) => {
    const response = await API.delete(`/resources/${id}`);
    return response.data;
  },
};

export default resourceService;
