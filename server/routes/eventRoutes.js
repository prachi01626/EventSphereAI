const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  generateEventCopilot,
  getOrganizerEvents,
  getEventAnalytics,
  getEventParticipants,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getEvents);
router.get('/organizer/my-events', protect, authorize('Organizer'), getOrganizerEvents);
router.get('/my-events', protect, authorize('Organizer'), getOrganizerEvents);
router.get('/:id', getEventById);
router.get('/:id/analytics', protect, authorize('Organizer'), getEventAnalytics);
router.get('/:id/participants', protect, authorize('Organizer'), getEventParticipants);
router.post('/', protect, authorize('Organizer'), createEvent);
router.post('/create', protect, authorize('Organizer'), createEvent);
router.put('/:id', protect, authorize('Organizer'), updateEvent);
router.delete('/:id', protect, authorize('Organizer'), deleteEvent);
router.post('/copilot', protect, authorize('Organizer'), generateEventCopilot);

module.exports = router;
