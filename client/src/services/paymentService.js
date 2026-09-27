import API from './api';

export const paymentService = {
  createOrder: async (eventId, customAnswers = {}) => {
    const response = await API.post('/payment/create-order', {
      eventId,
      customAnswers,
    });
    return response.data;
  },

  verifyPayment: async (paymentPayload) => {
    const response = await API.post('/payment/verify', paymentPayload);
    return response.data;
  },
};
