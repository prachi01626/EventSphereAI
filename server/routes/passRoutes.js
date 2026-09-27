const express = require('express');
const router = express.Router();
const {
  getDynamicPassQR,
  verifyPassScan,
  getMyPasses,
} = require('../controllers/passController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/my-passes', protect, getMyPasses);
router.get('/:registrationId/qr', getDynamicPassQR);
router.post('/verify-scan', protect, authorize('Volunteer', 'Organizer'), verifyPassScan);

module.exports = router;
