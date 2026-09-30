import API from './api';

export const passService = {
  getMyPasses: async () => {
    const response = await API.get('/pass/my-passes');
    return response.data;
  },

  getDynamicQR: async (registrationId) => {
    const response = await API.get(`/pass/${registrationId}/qr`);
    return response.data;
  },

  verifyScan: async (registrationId, token) => {
    const payload = {
      registrationId,
      passId: registrationId,
      token,
    };
    try {
      const response = await API.post('/volunteer/verify-pass', payload);
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) {
        const response = await API.post('/pass/verify-scan', payload);
        return response.data;
      }
      throw err;
    }
  },
};
