import API from './api';

export const groupService = {
  getAllGroups: async (params = {}) => {
    // Expected params: subject, department, year, page, size, sortBy, sortDir
    const response = await API.get('/groups', { params });
    return response.data;
  },

  getGroupById: async (id) => {
    const response = await API.get(`/groups/${id}`);
    return response.data;
  },

  createGroup: async (groupData) => {
    const response = await API.post('/groups', groupData);
    return response.data;
  },

  updateGroup: async (id, groupData) => {
    const response = await API.put(`/groups/${id}`, groupData);
    return response.data;
  },

  deleteGroup: async (id) => {
    const response = await API.delete(`/groups/${id}`);
    return response.data;
  },

  joinGroup: async (groupId) => {
    const response = await API.post(`/groups/${groupId}/join`);
    return response.data;
  },

  leaveGroup: async (groupId) => {
    const response = await API.delete(`/groups/${groupId}/leave`);
    return response.data;
  },

  getGroupMembers: async (groupId) => {
    const response = await API.get(`/groups/${groupId}/members`);
    return response.data;
  },

  approveMember: async (groupId, memberId) => {
    const response = await API.put(`/groups/${groupId}/approve/${memberId}`);
    return response.data;
  },

  rejectMember: async (groupId, memberId) => {
    const response = await API.put(`/groups/${groupId}/reject/${memberId}`);
    return response.data;
  },
};

export default groupService;
