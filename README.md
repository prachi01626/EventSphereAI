# EventSphere AI — Intelligent Digital Infrastructure for End-to-End Event Management

EventSphere AI is a full-stack, production-ready web application engineered to orchestrate modern in-person and hybrid events. It features **Anti-Proxy 30-Second Dynamic TOTP QR Codes**, **Gemini 1.5 AI Event Copilot**, **Full Razorpay Payment Integration**, **Real-Time Volunteer Dispatching**, and **Automated 1-Click Excel Telemetry**.

---

## 🌟 Key Architecture & Capabilities

### 1. 📲 Anti-Proxy 30-Second Dynamic QR Code Engine
- **Time-based One-Time Password (TOTP)** generated using `otplib`.
- QR codes dynamically regenerate every 30 seconds with an animated circular countdown timer ring.
- Screenshots and shared images automatically expire after 30 seconds, eliminating proxy check-ins and unauthorized ticket passing.
- Volunteer scanner performs cryptographic TOTP verification with real-time audio-visual feedback (Green Chime for Valid, Red Buzzer for Expired/Duplicate).

### 2. 🤖 Gemini AI Copilot & Sentiment Intelligence
- **Event Creation Copilot (`POST /api/events/copilot`)**: Transforms a theme, target audience, and budget prompt into an end-to-end blueprint (description, 4-step agenda timeline, custom registration questionnaire, and promotional copy).
- **Post-Event Sentiment Engine (`POST /api/analytics/sentiment`)**: Analyzes attendee reviews using Natural Language Processing to compute positive/neutral/negative breakdown, key highlights, and actionable future recommendations.

### 3. 💳 Complete Razorpay Payment Integration Flow
- End-to-end order creation (`POST /api/payment/create-order`) and HMAC SHA256 digital signature verification (`POST /api/payment/verify`).
- On successful payment, automatically generates a secure `totpSecret` and unlocks the participant's dynamic pass with celebratory confetti.

### 4. 👥 AI Volunteer Headcount Allocation Engine
- Balances volunteer staffing based on participant capacity across 5 core departments:
  - Registration & Check-in (30%)
  - Crowd Management & Flow (25%)
  - Technical & AV Production (20%)
  - Hospitality & VIP Concierge (15%)
  - Media & Social Broadcast (10%)
- Includes real-time override sliders, operational risk index, and a 3-shift operational schedule.

### 5. 📊 1-Click Excel Registration Telemetry
- Generates high-fidelity `.xlsx` reports using `exceljs` with styled headers, alternating row colors, payment status badges, and check-in timestamps via `GET /api/analytics/export/:eventId`.

---

## 📁 Architectural Folder Structure

```
EventSphere-AI/
├── client/                      # React Frontend Application (PWA Ready)
│   ├── src/
│   │   ├── components/          # Badges, DemoRoleBar, Navbar, PassCard, EventCopilotModal, VolunteerAllocationModal, EventRegistrationModal, SentimentReportModal, FeedbackModal
│   │   ├── pages/               # DiscoveryLanding, OrganizerDashboard, ParticipantPortal, VolunteerScanner
│   │   ├── context/             # AuthContext (with Demo Role Switcher), EventContext
│   │   ├── services/            # API services (api, authService, eventService, paymentService, passService, analyticsService)
│   │   └── utils/               # Sound synthesizers (Web Audio API) & formatters
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── server/                      # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                # MongoDB Atlas / local connection with instant in-memory fallback
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT validation & role-based access control
│   │   └── errorMiddleware.js   # Global async error handler
│   ├── models/
│   │   ├── User.js              # User model with bcrypt password hashing
│   │   ├── Event.js             # Event model with agenda and custom form fields
│   │   ├── Registration.js      # Registration with TOTP secret and payment status
│   │   ├── Feedback.js          # Feedback and sentiment model
│   │   └── mockStore.js         # Zero-config in-memory persistence engine
│   ├── utils/
│   │   ├── qr.js                # 30-Second TOTP Dynamic QR generator & verifier
│   │   └── excelExporter.js     # 1-Click Excel file generator using exceljs
│   ├── controllers/
│   │   ├── authController.js    # Register & Login issuing role-embedded JWT tokens
│   │   ├── eventController.js   # CRUD operations + Gemini AI Event Copilot
│   │   ├── paymentController.js # Razorpay Order Creation & HMAC Signature Verification
│   │   ├── passController.js    # Dynamic QR token stream & Scanner verification
│   │   ├── volunteerController.js # AI Volunteer Headcount Allocation logic
│   │   └── analyticsController.js # Post-event AI Sentiment Analysis & Excel Export
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth
│   │   ├── eventRoutes.js       # /api/events
│   │   ├── paymentRoutes.js     # /api/payment
│   │   ├── passRoutes.js        # /api/pass
│   │   ├── volunteerRoutes.js   # /api/volunteers
│   │   └── analyticsRoutes.js   # /api/analytics
│   └── server.js                # Express entry point & seed initializer
├── .env.example
└── package.json                 # Workspace orchestrator
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Start Application (Backend + Frontend Concurrently)
```bash
npm run dev
```

- **Frontend Client**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

---

## 🎭 Pre-Configured Demo Credentials

The system comes pre-seeded with accounts ready for 1-click testing via the top **Presentation Demo Role Bar**:

| Role | Email | Password |
|---|---|---|
| **Organizer** | `organizer@eventsphere.ai` | `password123` |
| **Participant** | `participant@eventsphere.ai` | `password123` |
| **Volunteer** | `volunteer@eventsphere.ai` | `password123` |
