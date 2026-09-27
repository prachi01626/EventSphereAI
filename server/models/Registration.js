const mongoose = require('mongoose');
const { createMockModel } = require('./mockStore');

const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending',
    },
    razorpayOrderId: {
      type: String,
      default: '',
    },
    razorpayPaymentId: {
      type: String,
      default: '',
    },
    checkInStatus: {
      type: Boolean,
      default: false,
    },
    totpSecret: {
      type: String,
      default: '',
    },
    checkInTime: {
      type: Date,
      default: null,
    },
    customAnswers: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const MongooseRegistration = mongoose.models.Registration || mongoose.model('Registration', registrationSchema);
const mockRegistration = createMockModel('registrations');

const RegistrationProxy = new Proxy(MongooseRegistration, {
  get(target, prop) {
    if (global.__MOCK_DB_ACTIVE__) {
      return mockRegistration[prop] !== undefined ? mockRegistration[prop] : target[prop];
    }
    return target[prop];
  },
});

module.exports = RegistrationProxy;
