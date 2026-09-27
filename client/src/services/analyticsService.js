import API from './api';

export const analyticsService = {
  allocateVolunteers: async (totalParticipants, totalVolunteers, departmentOverrides = {}) => {
    const response = await API.post('/volunteers/allocate', {
      totalParticipants,
      totalVolunteers,
      departmentOverrides,
    });
    return response.data;
  },

  getEventStats: async (eventId) => {
    const response = await API.get(`/analytics/event/${eventId}`);
    return response.data;
  },

  submitFeedback: async (eventId, rating, reviewText) => {
    const response = await API.post('/analytics/feedback', {
      eventId,
      rating,
      reviewText,
    });
    return response.data;
  },

  getSentimentAnalysis: async (eventId, customReviews = []) => {
    const response = await API.post('/analytics/sentiment', {
      eventId,
      customReviews,
    });
    return response.data;
  },

  getExcelExportUrl: (eventId) => {
    return `/api/analytics/export/${eventId}`;
  },
};
