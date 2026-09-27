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
    const { registrationId, token } = req.body;

    if (!registrationId || !token) {
      return res.status(400).json({
        valid: false,
        status: 'INVALID_PAYLOAD',
        message: 'Scan payload missing registrationId or dynamic token',
      });
    }

    const registration = await Registration.findById(registrationId)
      .populate('event', 'title date venue organizer')
      .populate('participant', 'name email');

    if (!registration) {
      return res.status(404).json({
        valid: false,
        status: 'NOT_FOUND',
        message: 'Invalid pass: Registration record does not exist',
      });
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
