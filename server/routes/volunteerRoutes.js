const express = require('express');
const router = express.Router();
const { allocateVolunteers } = require('../controllers/volunteerController');

router.post('/allocate', allocateVolunteers);

module.exports = router;
