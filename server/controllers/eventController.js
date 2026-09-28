const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Feedback = require('../models/Feedback');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// @desc    Get all public events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .populate('organizerId', 'name email')
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('organizerId', 'name email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    next(error);
  }
};

// @desc    Get events strictly owned by the authenticated organizer
// @route   GET /api/events/organizer/my-events
// @access  Private (Organizer)
const getOrganizerEvents = async (req, res, next) => {
  try {
    const events = await Event.find({
      $or: [{ organizerId: req.user._id }, { organizer: req.user._id }],
    })
      .populate('volunteers', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

// @desc    Get event analytics with strict organizer ownership check
// @route   GET /api/events/:id/analytics
// @access  Private (Organizer)
const getEventAnalytics = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const eventOrganizerId = event.organizerId || event.organizer;
    if (!eventOrganizerId || eventOrganizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Unauthorized: You can only view data for your own events',
      });
    }

    const registrations = await Registration.find({ event: event._id }).populate('participant', 'name email');
    const feedbacks = await Feedback.find({ event: event._id });

    const totalRegistrations = registrations.length;
    const checkedInCount = registrations.filter((r) => r.checkInStatus).length;
    const paidCount = registrations.filter((r) => r.paymentStatus === 'Completed').length;
    const totalRevenue = paidCount * (event.ticketPrice || 0);
    const attendanceRate = totalRegistrations > 0 ? Math.round((checkedInCount / totalRegistrations) * 100) : 0;
    const avgRating =
      feedbacks.length > 0
        ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
        : '5.0';

    res.status(200).json({
      success: true,
      event: {
        _id: event._id,
        title: event.title,
        date: event.date,
        venue: event.venue,
        ticketPrice: event.ticketPrice,
        budget: event.budget,
        volunteerCode: event.volunteerCode,
      },
      metrics: {
        totalRegistrations,
        checkedInCount,
        paidCount,
        totalRevenue,
        attendanceRate,
        feedbackCount: feedbacks.length,
        avgRating,
      },
      registrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get registered participants with strict organizer ownership check
// @route   GET /api/events/:id/participants
// @access  Private (Organizer)
const getEventParticipants = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const eventOrganizerId = event.organizerId || event.organizer;
    if (!eventOrganizerId || eventOrganizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Unauthorized: You can only view data for your own events',
      });
    }

    const registrations = await Registration.find({ event: event._id })
      .populate('participant', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      participants: registrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new event with auto-generated 6-digit volunteerCode
// @route   POST /api/events/create
// @access  Private (Organizer)
const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      date,
      venue,
      ticketPrice,
      budget,
      agenda,
      customFormFields,
      promotionalCopy,
    } = req.body;

    if (!title || !description || !date || !venue) {
      return res.status(400).json({ message: 'Please provide all mandatory event details' });
    }

    const volunteerCode = Math.floor(100000 + Math.random() * 900000).toString();

    const event = await Event.create({
      title,
      description,
      category: category || 'Technology',
      date,
      venue,
      ticketPrice: Number(ticketPrice) || 0,
      budget: Number(budget) || 10000,
      agenda: agenda || [],
      customFormFields: customFormFields || [],
      promotionalCopy: promotionalCopy || '',
      organizerId: req.user._id,
      organizer: req.user._id,
      volunteerCode,
      volunteers: [],
    });

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

// @desc    Update event with strict organizer ownership check
// @route   PUT /api/events/:id
// @access  Private (Organizer)
const updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const eventOrganizerId = event.organizerId || event.organizer;
    if (!eventOrganizerId || eventOrganizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You can only view data for your own events' });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event with strict organizer ownership check
// @route   DELETE /api/events/:id
// @access  Private (Organizer)
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const eventOrganizerId = event.organizerId || event.organizer;
    if (!eventOrganizerId || eventOrganizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You can only view data for your own events' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Gemini AI Event Copilot: Auto-generate event description, 4-step agenda, custom fields, and promo copy
// @route   POST /api/events/copilot
// @access  Private (Organizer)
const generateEventCopilot = async (req, res, next) => {
  try {
    const { theme, targetAudience, budget, venueType } = req.body;

    if (!theme) {
      return res.status(400).json({ message: 'Please provide an event theme or concept' });
    }

    // Try Google Generative AI if key is provided
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are the lead AI Event Orchestrator for EventSphere AI. 
Generate a comprehensive, high-conversion event blueprint for:
Theme: "${theme}"
Target Audience: "${targetAudience || 'Innovators, Developers & Enthusiasts'}"
Budget: "₹${budget || '50,000'}"
Venue Preference: "${venueType || 'Hybrid Convention Center'}"

You must respond ONLY with a valid JSON object strictly matching this schema without markdown fences:
{
  "title": "Inspiring Event Title",
  "category": "Technology | Business | Creative | Hackathon | Summit",
  "description": "Engaging 2-3 paragraph overview highlighting keynote vision, attendee perks, and impact.",
  "venue": "Proposed state-of-the-art venue name and city",
  "suggestedTicketPrice": 499,
  "agenda": [
    { "time": "09:00 AM - 10:00 AM", "topic": "Keynote Opening & Vision", "speaker": "Distinguished Industry Lead" },
    { "time": "10:30 AM - 12:30 PM", "topic": "Hands-on Technical Immersion", "speaker": "Principal Architect" },
    { "time": "01:30 PM - 03:00 PM", "topic": "Panel Discussion & Future Roadmap", "speaker": "Visionary Panel" },
    { "time": "03:30 PM - 05:00 PM", "topic": "Showcase, Awards & Networking Mixer", "speaker": "Master of Ceremonies" }
  ],
  "customFormFields": [
    { "fieldName": "T-Shirt Size", "fieldType": "select", "options": ["S", "M", "L", "XL", "XXL"], "required": true },
    { "fieldName": "GitHub or Portfolio URL", "fieldType": "text", "options": [], "required": false },
    { "fieldName": "Dietary Preference", "fieldType": "select", "options": ["Vegetarian", "Non-Vegetarian", "Vegan"], "required": false }
  ],
  "promotionalCopy": "Ready to shape the future? Join us for an extraordinary experience packed with insights, networking, and breakthroughs. Register now!"
}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedJson);
        return res.json({ success: true, aiGenerated: true, blueprint: parsed });
      } catch (geminiError) {
        console.warn('Gemini API call failed or timed out, using intelligent copilot engine:', geminiError.message);
      }
    }

    // Intelligent Built-in Copilot Engine (Zero-delay reliable fallback)
    const normalizedTheme = theme.trim();
    const blueprint = {
      title: `${normalizedTheme.charAt(0).toUpperCase() + normalizedTheme.slice(1)} Summit 2026`,
      category: theme.toLowerCase().includes('hack') ? 'Hackathon' : 
                theme.toLowerCase().includes('design') ? 'Creative' : 
                theme.toLowerCase().includes('startup') ? 'Business' : 'Technology',
      description: `Welcome to ${normalizedTheme} — the premier summit gathering forward-thinking minds from around the globe. This edition brings together leading practitioners, innovators, and creators for an immersive journey featuring interactive workshops, breakthrough demonstrations, and unmatched networking. Designed specifically for ${targetAudience || 'innovators, founders, and engineers'}, attendees will gain actionable knowledge, explore cutting-edge methodologies, and collaborate on high-impact projects.`,
      venue: venueType || 'Metropolis Convention Hub & Tech Arena, Bengaluru',
      suggestedTicketPrice: budget > 100000 ? 1499 : 499,
      agenda: [
        {
          time: '09:00 AM - 10:15 AM',
          topic: `Keynote: The Evolution of ${normalizedTheme}`,
          speaker: 'Dr. Elena Vance, Senior Director of Research',
        },
        {
          time: '10:45 AM - 01:00 PM',
          topic: 'Interactive Deep-Dive & Architecture Masterclass',
          speaker: 'Marcus Thorne, Principal Architect',
        },
        {
          time: '02:00 PM - 03:30 PM',
          topic: 'Executive Roundtables & Ecosystem Synergies',
          speaker: 'Industry Pioneer Panel',
        },
        {
          time: '04:00 PM - 05:30 PM',
          topic: 'Live Demos, AI Showcase & Networking Gala',
          speaker: 'EventSphere Lead Facilitator',
        },
      ],
      customFormFields: [
        {
          fieldName: 'T-Shirt Size',
          fieldType: 'select',
          options: ['S', 'M', 'L', 'XL', 'XXL'],
          required: true,
        },
        {
          fieldName: 'LinkedIn / Portfolio URL',
          fieldType: 'text',
          options: [],
          required: false,
        },
        {
          fieldName: 'Dietary Preference',
          fieldType: 'select',
          options: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain'],
          required: false,
        },
        {
          fieldName: 'Expectations & Goals',
          fieldType: 'text',
          options: [],
          required: false,
        },
      ],
      promotionalCopy: `🚀 Are you ready to elevate your trajectory? Registrations for ${normalizedTheme} are officially live! Secure your pass now to connect with industry leaders, participate in exclusive labs, and unlock transformative event experiences powered by EventSphere AI. Limited seats available!`,
    };

    return res.json({
      success: true,
      aiGenerated: false,
      engine: 'Built-in Intelligent Copilot Orchestrator',
      blueprint,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  generateEventCopilot,
  getOrganizerEvents,
  getEventAnalytics,
  getEventParticipants,
};
