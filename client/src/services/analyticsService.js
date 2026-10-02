import API, { API_BASE_URL } from './api';
import axios from 'axios';

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

  // 1-Click Excel Export: Calls GET /api/analytics/export/:eventId with Authorization header and responseType: 'blob'
  exportRegistrationsExcel: async (eventId, eventTitle = 'Event') => {
    const token =
      localStorage.getItem('eventsphere_token') ||
      localStorage.getItem('token') ||
      '';

    const response = await axios.get(`${API_BASE_URL}/analytics/export/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    });

    // Handle case where server returns JSON error formatted as blob
    if (response.data && response.data.type === 'application/json') {
      const errorText = await response.data.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || 'Failed to export registrations');
      } catch (jsonErr) {
        throw new Error(errorText || 'Failed to export registrations');
      }
    }

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;

    const safeTitle = (eventTitle || 'Event').replace(/[^a-zA-Z0-9]/g, '_');
    link.setAttribute('download', `EventSphere_${safeTitle}_Registrations.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);

    return response;
  },

  getExcelExportUrl: (eventId) => {
    return `${API_BASE_URL}/analytics/export/${eventId}`;
  },
};
