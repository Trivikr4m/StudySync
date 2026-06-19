import API from './api';

export const announcementService = {
  getAnnouncementsByGroup: async (groupId) => {
    const response = await API.get(`/announcements/group/${groupId}`);
    return response.data;
  },

  createAnnouncement: async (announcementData) => {
    const response = await API.post('/announcements', announcementData);
    return response.data;
  },

  updateAnnouncement: async (id, announcementData) => {
    const response = await API.put(`/announcements/${id}`, announcementData);
    return response.data;
  },

  deleteAnnouncement: async (id) => {
    const response = await API.delete(`/announcements/${id}`);
    return response.data;
  },
};

export default announcementService;
