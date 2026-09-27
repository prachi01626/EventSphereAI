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
    const response = await API.post('/pass/verify-scan', {
      registrationId,
      token,
    });
    return response.data;
  },
};
