import API from './api';

export const meetingService = {
  getAllMeetings: async (groupId = null) => {
    const params = {};
    if (groupId) params.groupId = groupId;
    const response = await API.get('/meetings', { params });
    return response.data;
  },

  getMeetingById: async (id) => {
    const response = await API.get(`/meetings/${id}`);
    return response.data;
  },

  createMeeting: async (meetingData) => {
    const response = await API.post('/meetings', meetingData);
    return response.data;
  },

  updateMeeting: async (id, meetingData) => {
    const response = await API.put(`/meetings/${id}`, meetingData);
    return response.data;
  },

  deleteMeeting: async (id) => {
    const response = await API.delete(`/meetings/${id}`);
    return response.data;
  },
};

export default meetingService;
