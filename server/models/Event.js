const mongoose = require('mongoose');
const { createMockModel } = require('./mockStore');

const agendaSchema = new mongoose.Schema({
  time: { type: String, required: true },
  topic: { type: String, required: true },
  speaker: { type: String, default: '' },
});

const customFieldSchema = new mongoose.Schema({
  fieldName: { type: String, required: true },
  fieldType: { type: String, enum: ['text', 'number', 'select', 'checkbox'], default: 'text' },
  options: [{ type: String }],
  required: { type: Boolean, default: false },
});

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    category: {
      type: String,
      default: 'Technology',
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required'],
    },
    ticketPrice: {
      type: Number,
      default: 0,
    },
    budget: {
      type: Number,
      default: 10000,
    },
    agenda: [agendaSchema],
    customFormFields: [customFieldSchema],
    promotionalCopy: {
      type: String,
      default: '',
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MongooseEvent = mongoose.models.Event || mongoose.model('Event', eventSchema);
const mockEvent = createMockModel('events');

const EventProxy = new Proxy(MongooseEvent, {
  get(target, prop) {
    if (global.__MOCK_DB_ACTIVE__) {
      return mockEvent[prop] !== undefined ? mockEvent[prop] : target[prop];
    }
    return target[prop];
  },
});

module.exports = EventProxy;
