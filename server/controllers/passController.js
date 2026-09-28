const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { generateDynamicQR, verifyTOTPToken, generateSecret } = require('../utils/qr');

// @desc    Get dynamic 30-second TOTP QR code for a registration pass
// @route   GET /api/pass/:registrationId/qr
// @access  Private (Participant or Organizer)
const getDynamicPassQR = async (req, res, next) => {
  try {
    const { registrationId } = req.params;

    const registration = await Registration.findById(registrationId)
      .populate('event', 'title venue date ticketPrice category')
      .populate('participant', 'name email');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check payment status
    if (registration.paymentStatus !== 'Completed') {
      return res.status(400).json({
        message: 'Pass is not active. Payment status is pending or failed.',
        paymentStatus: registration.paymentStatus,
      });
    }

    // Ensure TOTP secret exists (generate if missing)
    if (!registration.totpSecret) {
      registration.totpSecret = generateSecret();
      await registration.save();
    }

    // Generate fresh dynamic QR data URL
    const { qrCodeDataUrl, token, expiresIn } = await generateDynamicQR(
      registration._id.toString(),
      registration.totpSecret
    );

    res.status(200).json({
      success: true,
      registrationId: registration._id,
      event: registration.event,
      participant: registration.participant,
      checkInStatus: registration.checkInStatus,
      checkInTime: registration.checkInTime,
      qrCodeDataUrl,
      token,
      expiresIn,
      interval: 30, // 30-second anti-proxy refresh window
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify scanned QR code by Volunteer Scanner Portal
// @route   POST /api/pass/verify-scan
// @access  Private (Volunteer or Organizer)
const verifyPassScan = async (req, res, next) => {
  try {
    let { registrationId, token } = req.body;

    if ((!registrationId || !token) && req.body.qrData) {
      try {
        const parsed = typeof req.body.qrData === 'string' ? JSON.parse(req.body.qrData) : req.body.qrData;
        registrationId = registrationId || parsed.registrationId || parsed._id || parsed.id;
        token = token || parsed.token || parsed.totp || parsed.code;
      } catch (err) {
        // Fallback for non-JSON QR data
        if (!registrationId) registrationId = req.body.qrData;
      }
    }

    if (!registrationId || !token) {
      return res.status(400).json({
        valid: false,
        status: 'INVALID_PAYLOAD',
        message: 'Scan payload missing registrationId or dynamic token',
      });
    }

    const registration = await Registration.findById(registrationId)
      .populate('event', 'title date venue organizer organizerId volunteerCode volunteers')
      .populate('participant', 'name email');

    if (!registration) {
      return res.status(404).json({
        valid: false,
        status: 'NOT_FOUND',
        message: 'Invalid pass: Registration record does not exist',
      });
    }

    const event = registration.event;
    if (!event) {
      return res.status(404).json({
        valid: false,
        status: 'EVENT_NOT_FOUND',
        message: 'Associated event record does not exist',
      });
    }

    // Role-based Event Authorization Check:
    if (req.user.role === 'Volunteer') {
      const userAssignedEvents = (req.user.assignedEvents || []).map((id) => id.toString());
      const eventVolunteers = (event.volunteers || []).map((id) => id.toString());
      const eventIdStr = event._id.toString();

      const isAuthorizedVolunteer =
        userAssignedEvents.includes(eventIdStr) ||
        eventVolunteers.includes(req.user._id.toString());

      if (!isAuthorizedVolunteer) {
        return res.status(403).json({
          valid: false,
          status: 'UNAUTHORIZED_EVENT',
          message: `Unauthorized: You are not an assigned volunteer for "${event.title}". You can only scan and verify tickets for events you are linked to.`,
        });
      }
    } else if (req.user.role === 'Organizer') {
      const eventOrganizerId = event.organizerId || event.organizer;
      if (eventOrganizerId && eventOrganizerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          valid: false,
          status: 'UNAUTHORIZED_EVENT',
          message: 'Unauthorized: You can only scan and verify tickets for your own events.',
        });
      }
    }

    if (registration.paymentStatus !== 'Completed') {
      return res.status(400).json({
        valid: false,
        status: 'UNPAID',
        message: 'Payment incomplete for this registration',
      });
    }

    // 1. Check if token is valid via TOTP
    const isValidToken = verifyTOTPToken(token, registration.totpSecret);
    if (!isValidToken) {
      return res.status(400).json({
        valid: false,
        status: 'EXPIRED',
        message: 'EXPIRED: Invalid or old QR code. Anti-proxy window exceeded (>30s).',
        participant: {
          name: registration.participant?.name,
          email: registration.participant?.email,
        },
      });
    }

    // 2. Check if already checked in
    if (registration.checkInStatus) {
      return res.status(409).json({
        valid: false,
        status: 'ALREADY_USED',
        message: 'ALREADY USED: Attendance already marked.',
        checkInTime: registration.checkInTime,
        participant: {
          name: registration.participant?.name,
          email: registration.participant?.email,
        },
        event: {
          title: registration.event?.title,
        },
      });
    }

    // 3. Mark check-in successful
    registration.checkInStatus = true;
    registration.checkInTime = new Date();
    await registration.save();

    return res.status(200).json({
      valid: true,
      status: 'VALID',
      message: 'VALID: Check-in Successful',
      checkInTime: registration.checkInTime,
      participant: {
        name: registration.participant?.name,
        email: registration.participant?.email,
      },
      event: {
        title: registration.event?.title,
        venue: registration.event?.venue,
      },
      registrationId: registration._id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's registered passes
// @route   GET /api/pass/my-passes
// @access  Private (Participant)
const getMyPasses = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ participant: req.user._id })
      .populate('event')
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDynamicPassQR,
  verifyPassScan,
  getMyPasses,
};
