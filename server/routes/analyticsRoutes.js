const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getEventStats,
  analyzeSentiment,
  exportRegistrationsExcel,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/feedback', protect, submitFeedback);
router.get('/event/:eventId', protect, authorize('Organizer'), getEventStats);
router.post('/sentiment', analyzeSentiment);
router.get('/export/:eventId', protect, authorize('Organizer'), exportRegistrationsExcel);

module.exports = router;
