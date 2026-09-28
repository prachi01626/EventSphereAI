const express = require('express');
const router = express.Router();
const {
  allocateVolunteers,
  linkVolunteerToEvent,
  getVolunteerAssignedEvents,
} = require('../controllers/volunteerController');
const { verifyPassScan } = require('../controllers/passController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/allocate', allocateVolunteers);
router.post('/verify-pass', protect, authorize('Volunteer', 'Organizer'), verifyPassScan);
router.post('/link-event', protect, authorize('Volunteer'), linkVolunteerToEvent);
router.get('/my-events', protect, authorize('Volunteer'), getVolunteerAssignedEvents);

module.exports = router;
