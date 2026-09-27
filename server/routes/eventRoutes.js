const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  generateEventCopilot,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/create', protect, authorize('Organizer'), createEvent);
router.put('/:id', protect, authorize('Organizer'), updateEvent);
router.delete('/:id', protect, authorize('Organizer'), deleteEvent);
router.post('/copilot', protect, authorize('Organizer'), generateEventCopilot);

module.exports = router;
