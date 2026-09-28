require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Route files
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const passRoutes = require('./routes/passRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Controllers for direct /api/ai route aliases
const { generateEventCopilot } = require('./controllers/eventController');
const { analyzeSentiment } = require('./controllers/analyticsController');

// Models & Seed utility
const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');
const Feedback = require('./models/Feedback');
const { generateSecret } = require('./utils/qr');

const app = express();

// Middlewares
app.use(
  cors({
    origin: true, // Dynamically allow requests from frontend (localhost:3000, 127.0.0.1, etc.)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'EventSphere AI Backend',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authRoutes); // Route alias for /api/users and /api/users/me
app.use('/api/events', eventRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/pass', passRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/volunteer', volunteerRoutes); // Alias for singular route
app.use('/api/analytics', analyticsRoutes);

// Direct /api/ai routes
app.post('/api/ai/copilot', generateEventCopilot);
app.post('/api/ai/sentiment', analyzeSentiment);

// Seed demonstration data if DB is empty
const seedInitialData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding initial demonstration users and events...');

      // 1. Create Default Users
      const organizer = await User.create({
        name: 'Elena Rostova (Lead Organizer)',
        email: 'organizer@eventsphere.ai',
        password: 'password123',
        role: 'Organizer',
      });

      const participant = await User.create({
        name: 'Aarav Patel (VIP Attendee)',
        email: 'participant@eventsphere.ai',
        password: 'password123',
        role: 'Participant',
      });

      const volunteer = await User.create({
        name: 'Sofia Chen (Gate Marshal)',
        email: 'volunteer@eventsphere.ai',
        password: 'password123',
        role: 'Volunteer',
      });

      // 2. Create Default Events
      const event1 = await Event.create({
        title: 'Global AI & NextGen Cloud Summit 2026',
        description: 'The flagship conference converging Autonomous Multi-Agent Systems, Generative AI Infrastructures, and Cloud Native Architectures. Join 2,000+ industry pioneers for keynotes, live teardowns, and deep architectural breakouts.',
        category: 'Technology',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        venue: 'Grand Horizon Convention Pavilion, Tech District',
        ticketPrice: 999,
        budget: 450000,
        agenda: [
          { time: '09:00 AM - 10:30 AM', topic: 'Opening Keynote: Autonomous Agents in 2026', speaker: 'Dr. Satya Vardhan (Principal AI Scientist)' },
          { time: '11:00 AM - 01:00 PM', topic: 'Zero-Latency Event-Driven Microservices', speaker: 'Sarah Jenkins (VP Cloud Architecture)' },
          { time: '02:00 PM - 03:30 PM', topic: 'Hands-on Lab: Edge AI & Dynamic Security', speaker: 'David Kim (Staff Security Engineer)' },
          { time: '04:00 PM - 05:30 PM', topic: 'VIP Networking Mixer & Startup Pitch Showcase', speaker: 'Panel & Mentors' },
        ],
        customFormFields: [
          { fieldName: 'Company / University', fieldType: 'text', required: true },
          { fieldName: 'T-Shirt Size', fieldType: 'select', options: ['S', 'M', 'L', 'XL', 'XXL'], required: true },
          { fieldName: 'Dietary Preference', fieldType: 'select', options: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain'], required: false },
        ],
        promotionalCopy: 'Experience the cutting-edge of enterprise intelligence at the Global AI Summit 2026. Secure your pass today!',
        organizer: organizer._id,
        organizerId: organizer._id,
        volunteerCode: '123456',
        volunteers: [volunteer._id],
      });

      const event2 = await Event.create({
        title: 'QuantumSphere: 36-Hour National Hackathon',
        description: 'Build breakthrough applications combining Quantum Computing simulators, Agentic workflows, and Web3 smart contracts. $25,000 in bounties, 24/7 mentor access, and direct investor demo days.',
        category: 'Hackathon',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        venue: 'Cyber Hub Innovation Arena & Maker Studio',
        ticketPrice: 0, // Free event
        budget: 250000,
        agenda: [
          { time: 'Day 1 - 10:00 AM', topic: 'Problem Statements Reveal & Team Formation', speaker: 'Hackathon Leads' },
          { time: 'Day 1 - 02:00 PM', topic: 'Hacking Begins & API Workshop', speaker: 'Developer Advocates' },
          { time: 'Day 2 - 12:00 PM', topic: 'Mentorship Checkpoint & Code Freeze', speaker: 'Jury Panel' },
          { time: 'Day 2 - 04:00 PM', topic: 'Top 10 Live Pitches & Award Ceremony', speaker: 'Keynote Jury' },
        ],
        customFormFields: [
          { fieldName: 'GitHub Profile', fieldType: 'text', required: true },
          { fieldName: 'Team Name', fieldType: 'text', required: false },
          { fieldName: 'Experience Level', fieldType: 'select', options: ['Student', 'Junior Dev', 'Senior Engineer'], required: true },
        ],
        promotionalCopy: 'Hack the impossible in 36 hours. Free registration, world-class mentorship, and high-impact prizes.',
        organizer: organizer._id,
        organizerId: organizer._id,
        volunteerCode: '654321',
        volunteers: [volunteer._id],
      });

      const event3 = await Event.create({
        title: 'DesignSphere: Spatial UI & Human Centered Design',
        description: 'Explore spatial computing UI, generative design tokens, and immersive design systems with award-winning UX architects from Apple, Figma, and Google.',
        category: 'Creative',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        venue: 'Metropolis Design Center, Gallery 4',
        ticketPrice: 499,
        budget: 180000,
        agenda: [
          { time: '10:00 AM - 11:30 AM', topic: 'Spatial Computing UI/UX Guidelines', speaker: 'Maya Lin (Design Director)' },
          { time: '12:00 PM - 02:00 PM', topic: 'Figma to Code: High-Fidelity Tokens Masterclass', speaker: 'Leo Vance (Design Engineer)' },
          { time: '03:00 PM - 05:00 PM', topic: 'Design Critique & Portfolio Review', speaker: 'Design Leads' },
        ],
        customFormFields: [
          { fieldName: 'Portfolio URL', fieldType: 'text', required: true },
          { fieldName: 'Primary Tool', fieldType: 'select', options: ['Figma', 'Sketch', 'Adobe XD', 'Spline 3D'], required: false },
        ],
        promotionalCopy: 'Master modern spatial design and level up your product aesthetics with industry leaders.',
        organizer: organizer._id,
        organizerId: organizer._id,
        volunteerCode: '888999',
        volunteers: [],
      });

      // Link volunteer to initial seeded events
      volunteer.assignedEvents = [event1._id, event2._id];
      await volunteer.save();

      // 3. Pre-create an active completed registration with Dynamic Pass for instant demonstration
      const demoSecret = generateSecret();
      const demoReg = await Registration.create({
        event: event1._id,
        participant: participant._id,
        paymentStatus: 'Completed',
        razorpayOrderId: 'order_demo_seed_001',
        razorpayPaymentId: 'pay_demo_seed_001',
        checkInStatus: false,
        totpSecret: demoSecret,
        customAnswers: {
          'Company / University': 'Antigravity Labs & Google DeepMind Pair',
          'T-Shirt Size': 'L',
          'Dietary Preference': 'Vegetarian',
        },
      });

      // 4. Seed feedback reviews for sentiment analysis
      await Feedback.create([
        {
          event: event1._id,
          participant: participant._id,
          rating: 5,
          reviewText: 'The dynamic 30-second QR check-in was unbelievable! Literally walked straight in with zero queue.',
          sentiment: 'Positive',
        },
        {
          event: event1._id,
          participant: participant._id,
          rating: 5,
          reviewText: 'Loved the keynote sessions and the AI copilot demo. Very seamless networking!',
          sentiment: 'Positive',
        },
        {
          event: event1._id,
          participant: participant._id,
          rating: 4,
          reviewText: 'AV setup in room 2 had minor microphone feedback for 5 mins, but technical team resolved it fast.',
          sentiment: 'Neutral',
        },
        {
          event: event1._id,
          participant: participant._id,
          rating: 5,
          reviewText: 'Incredible energy, great food, and well-organized volunteer coordination.',
          sentiment: 'Positive',
        },
      ]);

      console.log('Seed data successfully initialized!');
      console.log(`Demo Active Pass Registration ID: ${demoReg._id}`);
    }
  } catch (err) {
    console.error('Error seeding demo data:', err.message);
  }
};

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedInitialData();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 EventSphere AI Server running on http://localhost:${PORT}`);
  });
};

startServer();
