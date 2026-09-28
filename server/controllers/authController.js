const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Event = require('../models/Event');

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'eventsphere_jwt_secret_key_super_secure_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user with restricted role sign-up checks
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, organizerKey, volunteerCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Default public signup role must ALWAYS be "Participant"
    let finalRole = 'Participant';
    let assignedEvents = [];
    let linkedEvent = null;

    if (role === 'Organizer') {
      const validSecretKey = process.env.ORGANIZER_SECRET_KEY || 'ORG2026';
      if (!organizerKey || organizerKey.trim() !== validSecretKey) {
        return res.status(400).json({ message: 'Invalid Organizer Passcode' });
      }
      finalRole = 'Organizer';
    } else if (role === 'Volunteer') {
      // Volunteers do not sign up globally. Instead, Organizers generate a 6-digit volunteerCode inside each Event document.
      if (!volunteerCode || !volunteerCode.trim()) {
        return res.status(400).json({
          message: 'Volunteer registration requires a valid 6-digit Event Volunteer Code provided by the organizer.',
        });
      }

      const codeStr = volunteerCode.toString().trim();
      linkedEvent = await Event.findOne({
        $or: [{ volunteerCode: codeStr }, { volunteerCode: Number(codeStr) }],
      });
      if (!linkedEvent) {
        return res.status(400).json({
          message: 'Invalid Event Volunteer Code. Please enter the 6-digit code provided by your event organizer.',
        });
      }

      finalRole = 'Volunteer';
      assignedEvents = [linkedEvent._id];
    } else {
      finalRole = 'Participant';
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: finalRole,
      assignedEvents,
    });

    // If volunteer registered, link user to event.volunteers
    if (linkedEvent) {
      if (!linkedEvent.volunteers) linkedEvent.volunteers = [];
      linkedEvent.volunteers.push(user._id);
      await linkedEvent.save();
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      assignedEvents: user.assignedEvents || [],
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('assignedEvents', 'title date venue volunteerCode');
    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
