import API from './api';

export const eventService = {
  getEvents: async (params = {}) => {
    const response = await API.get('/events', { params });
    return response.data;
  },

  getEventById: async (id) => {
    const response = await API.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await API.post('/events/create', eventData);
    return response.data;
  },

  updateEvent: async (id, eventData) => {
    const response = await API.put(`/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await API.delete(`/events/${id}`);
    return response.data;
  },

  getCopilotBlueprint: async (copilotData) => {
    const response = await API.post('/events/copilot', copilotData);
    return response.data;
  },
};
