const mongoose = require('mongoose');
const { createMockModel } = require('./mockStore');

const feedbackSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewText: {
      type: String,
      required: true,
    },
    sentiment: {
      type: String,
      enum: ['Positive', 'Neutral', 'Negative', 'Pending'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const MongooseFeedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
const mockFeedback = createMockModel('feedbacks');

const FeedbackProxy = new Proxy(MongooseFeedback, {
  get(target, prop) {
    if (global.__MOCK_DB_ACTIVE__) {
      return mockFeedback[prop] !== undefined ? mockFeedback[prop] : target[prop];
    }
    return target[prop];
  },
});

module.exports = FeedbackProxy;
