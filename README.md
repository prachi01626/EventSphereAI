# 🎪 EventSphere AI — Intelligent Digital Infrastructure for End-to-End Event Management

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.3.1-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/vite-5.4.11-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind-3.4.15-38B2AC.svg)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/express-4.19.2-black.svg)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/mongodb-atlas-47A248.svg)](https://www.mongodb.com/atlas)
[![Google Gemini 1.5](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-4285F4.svg)](https://ai.google.dev/)
[![Razorpay](https://img.shields.io/badge/payments-Razorpay%20Gateway-02042B.svg)](https://razorpay.com/)
[![Frontend Status](https://img.shields.io/badge/Vercel-Deployed-success?logo=vercel)](https://eventsphere-ai.vercel.app)
[![Backend Status](https://img.shields.io/badge/Render-Online-46E3B7?logo=render)](https://eventsphere-ai-backend.onrender.com)

**Enterprise-grade, full-stack MERN application orchestrating in-person, virtual, and hybrid conferences with dynamic anti-proxy security, generative AI co-piloting, biometric-grade event telemetry, and seamless payment processing.**

[Live Web Application](https://eventsphere-ai.vercel.app) • [Backend API Endpoint](https://eventsphere-ai-backend.onrender.com) • [Postman Collection](server/docs/EventSphere_AI_Postman_Collection.json) • [GitHub Repository](https://github.com/prachi01626/EventSphereAI)

</div>

---

## 📌 Executive Summary

**EventSphere AI** solves the core vulnerabilities and friction points plaguing modern large-scale conferences, tech summits, and cultural festivals. By replacing static, screenshot-vulnerable PDF tickets with **cryptographically verified 30-Second Dynamic TOTP QR Codes**, organizers eliminate ticket fraud, unauthorized pass-sharing, and gate bottlenecks. 

Supercharged by **Google Gemini 1.5 Flash**, event organizers can generate end-to-end event blueprints—including descriptions, multi-track agendas, tailored registration questionnaires, and high-conversion promotional copy—in seconds. Attendees experience seamless checkouts via **Razorpay**, while volunteers leverage a dedicated **Camera-Driven QR Scanner Portal** with sub-second audio-visual verification. Post-event, organizers gain immediate strategic clarity through **AI Attendee Sentiment Intelligence** and **1-Click High-Fidelity Excel Telemetry Reports**.

---

## 🔗 Live Links & Documentation

| Resource | Target URL / Path | Description |
|---|---|---|
| **🌐 Production Web App** | [https://eventsphere-ai.vercel.app](https://eventsphere-ai.vercel.app) | Production SPA hosted on Vercel Edge Network |
| **⚡ Production API Gateway** | [https://eventsphere-ai-backend.onrender.com](https://eventsphere-ai-backend.onrender.com) | Express REST API deployed on Render Cloud |
| **❤️ API Health Check** | [https://eventsphere-ai-backend.onrender.com/api/health](https://eventsphere-ai-backend.onrender.com/api/health) | Real-time health diagnostic endpoint |
| **📄 Postman Collection** | [`server/docs/EventSphere_AI_Postman_Collection.json`](server/docs/EventSphere_AI_Postman_Collection.json) | Complete pre-configured API test suite with environment variables |
| **📁 GitHub Repository** | [https://github.com/prachi01626/EventSphereAI](https://github.com/prachi01626/EventSphereAI) | Master codebase repository |

---

## 🛠️ Full-Stack Technology Stack

### Core Technology Stack

```
Frontend Architecture       Backend Infrastructure      Security & Cloud Intelligence
┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
│ • React.js 18 (Vite)  │   │ • Node.js (v18+)      │   │ • Google Gemini 1.5   │
│ • Tailwind CSS 3.4    │──▶│ • Express.js 4.19     │──▶│ • otplib (TOTP RFC)   │
│ • Lucide React Icons  │   │ • Mongoose 8.8        │   │ • Razorpay Gateway    │
│ • Canvas Confetti     │   │ • MongoDB Atlas       │   │ • JWT + bcryptjs      │
│ • HTML5-QRCode / jsQR │   │ • In-Memory Fallback  │   │ • exceljs Telemetry   │
└───────────────────────┘   └───────────────────────┘   └───────────────────────┘
```

| Layer | Technologies | Key Capabilities & Rationale |
|---|---|---|
| **Frontend Framework** | **React.js 18.3**, **Vite 5.4** | Blazing-fast HMR, component modularity, reactive state pipelines, minimal bundle footprint. |
| **Styling & UI** | **Tailwind CSS 3.4**, **Lucide Icons** | Utility-first responsive design, dark-mode styling, glassmorphism card surfaces, and accessible iconography. |
| **Interactive UX** | **Canvas Confetti**, **Web Audio API** | Real-time audio synthesizers (chimes and buzzers for scan results) and celebratory micro-interactions. |
| **Camera & QR Scanning** | **html5-qrcode**, **jsQR** | Hardware-accelerated camera video streaming with fallback manual token verification for low-light gates. |
| **Backend Runtime** | **Node.js 18+**, **Express.js 4.19** | Non-blocking asynchronous I/O, RESTful routing, unified error middleware, dynamic CORS negotiation. |
| **Database & ORM** | **MongoDB Atlas**, **Mongoose 8.8** | Distributed document store with dynamic indexing, population hooks, and instant zero-config in-memory fallback. |
| **Auth & Cryptography** | **JWT**, **bcryptjs**, **otplib** | Stateless bearer token authentication, salted password hashing, and RFC 6238 Time-based One-Time Password generation. |
| **Generative Intelligence**| **Google Gemini 1.5 Flash API** | Multimodal LLM orchestration for structured event blueprints and attendee review sentiment extraction. |
| **Payments** | **Razorpay Gateway**, **Node.js Crypto** | Payment order generation, checkout modal integration, and cryptographic HMAC-SHA256 signature verification. |
| **Reporting & Export** | **exceljs 4.4** | Automated generation of styled `.xlsx` workbooks with branded headers, status badges, and timestamp telemetry. |

---

## 🌟 Key Features & Architectural Capabilities

### 1. 📲 Anti-Proxy 30-Second Dynamic QR Code Engine
- **RFC 6238 Time-based One-Time Password (TOTP)**: Powered by `otplib`, each approved registration receives a cryptographically secure, unique `totpSecret`.
- **Dynamic 30-Second Refresh Cycle**: QR code payloads dynamically rotate every 30 seconds (`step: 30`, `window: 1`).
- **Animated SVG Countdown Ring**: Attendees view a real-time circular SVG progress timer indicating exactly when the active token will rotate.
- **Fraud & Screenshot Elimination**: Static screenshots or video recordings shared with unauthorized attendees expire within seconds, blocking proxy check-ins at entry turnstiles.
- **Audio-Visual Gate Verification**:
  - `VALID (200)`: Plays an 880Hz harmonic double-chime with high-contrast emerald visual feedback.
  - `ALREADY_USED (409)`: Triggers an amber alert displaying the exact prior check-in timestamp.
  - `EXPIRED (400)`: Plays a 220Hz low saw buzzer alerting gate staff to expired or copied tokens.

### 2. 🤖 Gemini AI Copilot & Sentiment Intelligence
- **Event Creation Copilot (`POST /api/events/copilot`)**:
  - Accepts event theme, target audience, budget, and venue preference.
  - Employs structured system prompting with strict JSON schema enforcement to return:
    - High-impact event title & multi-paragraph overview.
    - 4-phase chronological agenda timeline with assigned speaker roles.
    - Dynamic custom registration form fields (e.g., T-shirt sizes, dietary preferences, portfolio URLs).
    - High-conversion promotional copywriting ready for social campaigns.
  - Features an intelligent, zero-latency local fallback engine ensuring 100% operational uptime if external API quotas are constrained.
- **Post-Event Sentiment Engine (`POST /api/analytics/sentiment`)**:
  - Ingests qualitative attendee feedback reviews.
  - Computes positive, neutral, and negative sentiment distribution percentages.
  - Extracts actionable takeaways, top highlighted praise points, and critical areas for future operational improvement.

### 3. 💳 Razorpay Payment Flow & Cryptographic Verification
- **Dual-Mode Transaction Engine**:
  - **Free Events (₹0)**: Directly executes atomic registration provisioning and activates the dynamic pass instantly.
  - **Paid Events (₹N)**: Initializes server-side Razorpay order (`POST /api/payment/create-order`) in Indian Rupees (INR).
- **HMAC SHA256 Signature Verification (`POST /api/payment/verify`)**:
  - Verifies digital authenticity by validating `razorpay_signature === HMAC_SHA256(order_id + "|" + payment_id, secret)`.
  - Upon cryptographic confirmation, marks registration status as `Completed` and activates the attendee's TOTP secret.
  - Includes a zero-configuration sandbox simulation mode for instant test transactions in demo and presentation environments.

### 4. 👥 AI Volunteer Headcount Allocation Engine
- **Heuristic Mathematical Distribution (`POST /api/volunteers/allocate`)**:
  - Dynamically calculates optimal staffing levels across 5 critical operational departments:
    1. **Registration & Check-in (30%)**: Fast-track turnstiles, dynamic QR scanning, badge distribution.
    2. **Crowd Management & Flow (25%)**: Auditorium ingress/egress, emergency corridors, queue lines.
    3. **Technical & AV Production (20%)**: Stage audio/mic checks, livestream telemetry, Wi-Fi networking.
    4. **Hospitality & VIP Concierge (15%)**: Speaker green rooms, catering coordination, special assistance.
    5. **Media & Social Broadcast (10%)**: Live micro-updates, photography, backstage creator coverage.
- **Operational Risk Index & Shift Advice**:
  - Calculates attendee-to-volunteer ratios (e.g., `1:16.7`).
  - Evaluates operational risk level (`Optimal & High Touch`, `Moderate Load`, or `High Staffing Pressure`).
  - Generates a 3-shift operational schedule:
    - *Shift 1: Morning Ingress (08:00 AM - 12:00 PM)*
    - *Shift 2: Mid-Day Sessions (12:00 PM - 04:00 PM)*
    - *Shift 3: Evening Egress & Mixer (04:00 PM - 07:30 PM)*
- **6-Digit Secure Volunteer Linkage**: Organizers receive an auto-generated 6-digit code (e.g., `123456`) enabling volunteers to bind their accounts to specific events securely.

### 5. 📊 1-Click Excel Registration Telemetry
- **Production-Grade `.xlsx` Generation (`GET /api/analytics/export/:eventId`)**:
  - Powered by `exceljs`, generating beautifully formatted, styled spreadsheets on-the-fly.
  - Branded royal-navy header styling with white bold typography and frozen header panes.
  - Column auto-fit sizing, alternating zebra row fills, and formatted date/time strings.
  - Status badges for Payment (`Completed`, `Pending`) and Gate Check-In (`Checked In`, `Not Checked In`).
  - Financial audit metadata displaying total ticket revenue and attendance completion rates.

---

## 📁 Architectural Folder Structure

```
EventSphere-AI/
├── .env.example                         # Environment configuration template
├── package.json                         # Monorepo root script orchestrator (concurrently)
├── README.md                            # Comprehensive production documentation
│
├── client/                              # React.js 18 Single Page Application (Vite)
│   ├── public/                          # Static assets and icons
│   ├── src/
│   │   ├── components/                  # Reusable UI component library
│   │   │   ├── AccessDenied.jsx         # Unauthorized role route gatekeeper
│   │   │   ├── AuthModal.jsx            # Sign-in & sign-up modal with role selector
│   │   │   ├── Badges.jsx               # Status indicators (Payment, Check-in, Roles)
│   │   │   ├── DemoRoleBar.jsx          # 1-Click presentation demo switcher
│   │   │   ├── EventCopilotModal.jsx    # Gemini AI Event blueprint generator modal
│   │   │   ├── EventRegistrationModal.jsx # Multi-field registration & Razorpay checkout
│   │   │   ├── FeedbackModal.jsx        # Attendee star rating & text review submission
│   │   │   ├── Navbar.jsx               # Sticky responsive header with role pill
│   │   │   ├── PassCard.jsx             # Anti-proxy pass with SVG countdown ring
│   │   │   ├── SentimentReportModal.jsx # AI sentiment breakdown & recommendations modal
│   │   │   └── VolunteerAllocationModal.jsx # 5-Department AI staffing calculator
│   │   ├── context/                     # Global state providers
│   │   │   ├── AuthContext.jsx          # JWT persistence & instant role emulation
│   │   │   └── EventContext.jsx         # Event feed caching & active filters
│   │   ├── pages/                       # Primary views
│   │   │   ├── DiscoveryLanding.jsx     # Public marketplace & search interface
│   │   │   ├── OrganizerDashboard.jsx   # Metrics, event creation, Excel export, sentiment
│   │   │   ├── ParticipantPortal.jsx    # Active passes, dynamic QR modal, review triggers
│   │   │   └── VolunteerScanner.jsx     # Live camera scanner, manual input, sound FX
│   │   ├── services/                    # Axios API integration clients
│   │   │   ├── api.js                   # Base Axios instance with Bearer interceptors
│   │   │   ├── authService.js           # Auth & profile requests
│   │   │   ├── eventService.js          # CRUD event APIs & Gemini copilot
│   │   │   ├── passService.js           # Dynamic QR token stream & scanner verification
│   │   │   ├── paymentService.js        # Razorpay order initialization & signature verify
│   │   │   └── analyticsService.js      # Stats, sentiment triggers & Excel telemetry
│   │   ├── utils/                       # Frontend helpers
│   │   │   ├── formatters.js            # Currency (INR) and ISO date formatters
│   │   │   └── sound.js                 # Web Audio API synthesizers (valid & error tones)
│   │   ├── App.jsx                      # Client router & role view dispatcher
│   │   ├── index.css                    # Tailwind CSS directives & custom animations
│   │   └── main.jsx                     # React DOM entry point
│   ├── index.html                       # HTML5 entry with viewport & typography
│   ├── tailwind.config.js               # Design tokens, color palette & utilities
│   ├── vercel.json                      # Vercel SPA routing rewrite rules
│   └── vite.config.js                   # Vite dev server proxy configuration (port 3000)
│
└── server/                              # Node.js + Express REST API Gateway
    ├── config/
    │   └── db.js                        # MongoDB Atlas connection with in-memory fallback
    ├── controllers/                     # Business logic controllers
    │   ├── analyticsController.js       # Sentiment NLP, event statistics & Excel telemetry
    │   ├── authController.js            # User registration, login & JWT generation
    │   ├── eventController.js           # Event CRUD, Gemini Copilot & attendee roster
    │   ├── passController.js            # Dynamic QR stream & anti-proxy verification
    │   ├── paymentController.js         # Razorpay order creation & HMAC verification
    │   └── volunteerController.js       # AI Headcount Allocation & 6-digit event linking
    ├── docs/
    │   └── EventSphere_AI_Postman_Collection.json # Complete Postman test collection
    ├── middleware/
    │   ├── authMiddleware.js            # Bearer JWT verification & role authorization
    │   └── errorMiddleware.js           # 404 handler & centralized error responder
    ├── models/                          # Mongoose data schemas
    │   ├── Event.js                     # Event schema with agenda & custom fields
    │   ├── Feedback.js                  # Review schema with sentiment tags
    │   ├── Registration.js              # Ticket pass schema with TOTP secret
    │   ├── User.js                      # User schema with bcrypt password hashing
    │   └── mockStore.js                 # Zero-config in-memory persistence engine
    ├── routes/                          # Express REST route definitions
    │   ├── analyticsRoutes.js           # /api/analytics
    │   ├── authRoutes.js                # /api/auth & /api/users
    │   ├── eventRoutes.js               # /api/events
    │   ├── passRoutes.js                # /api/pass
    │   ├── paymentRoutes.js             # /api/payment
    │   └── volunteerRoutes.js           # /api/volunteers
    ├── utils/                           # Server-side cryptographic & export utilities
    │   ├── excelExporter.js             # High-fidelity .xlsx report generator (exceljs)
    │   └── qr.js                        # RFC 6238 TOTP token generation & verification
    ├── package.json                     # Server dependencies and scripts
    └── server.js                        # Express server entry point & seed initializer
```

---

## 🚀 Local Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or higher
- **MongoDB**: MongoDB Atlas connection URI or local MongoDB instance (Optional: system automatically activates high-speed in-memory DB if no URI is provided).

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/prachi01626/EventSphereAI.git
cd EventSphereAI
```

---

### Step 2: Install All Dependencies
Install dependencies for the root orchestrator, frontend client, and backend server in a single command:
```bash
npm run install:all
```

---

### Step 3: Configure Environment Variables
Create a `.env` file inside the `server/` directory:

```bash
# In Unix / macOS:
cp .env.example server/.env

# In Windows PowerShell:
Copy-Item .env.example server\.env
```

Populate `server/.env` with your credentials:
```env
# Server Port
PORT=5000

# Database Configuration (Leave blank or provide MongoDB Atlas URI)
# If empty or unreachable, EventSphere AI automatically falls back to an in-memory database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/eventsphere?retryWrites=true&w=majority

# JWT Authentication Secret
JWT_SECRET=super_secret_eventsphere_jwt_key_2026_prod

# Google Gemini 1.5 Flash API Key (For AI Copilot & Sentiment Intelligence)
# Get a key at: https://aistudio.google.com/
GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere

# Razorpay Payment Gateway Credentials (Test or Live Mode)
# Get keys at: https://dashboard.razorpay.com/app/keys
RAZORPAY_KEY_ID=rzp_test_YourKeyIdHere
RAZORPAY_KEY_SECRET=YourRazorpaySecretKeyHere

# Optional Organizer Passcode
ORGANIZER_SECRET_KEY=eventsphere_lead_organizer_2026
```

> **Note on Zero-Config Fallbacks:** If `GEMINI_API_KEY` or `RAZORPAY_KEY_ID` are left empty, EventSphere AI automatically engages built-in heuristic AI engines and sandbox payment simulation, ensuring all features run smoothly out of the box.

---

### Step 4: Run the Application Concurrently
Start both the Express API and Vite React frontend with a single command:
```bash
npm run dev
```

- **Frontend Client**: [http://localhost:3000](http://localhost:3000)
- **Backend API Gateway**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🎭 Pre-Configured Demo Credentials

The database automatically initializes with pre-configured demonstration accounts across all three user roles. You can either sign in with the credentials below or use the **Presentation Demo Role Bar** at the top of the frontend interface for 1-click role switching:

| Role | Email Address | Password | Permissions & Available Portals |
|---|---|---|---|
| 👑 **Organizer** | `organizer@eventsphere.ai` | `password123` | Create events, Gemini AI Copilot, live attendance metrics, AI Volunteer Allocation, attendee sentiment report, 1-Click Excel telemetry export. |
| 🎟️ **Participant** | `participant@eventsphere.ai` | `password123` | Browse public events, dynamic registration forms, Razorpay payment flow, live 30s Dynamic TOTP Pass, submit post-event feedback reviews. |
| 🛡️ **Volunteer** | `volunteer@eventsphere.ai` | `password123` | Camera-driven QR code scanner, manual pass verification, audio-visual feedback, 6-digit volunteer code linking. |

---

## 📡 Main REST API Endpoints Specification

### 🔐 Authentication & Profile (`/api/auth`)
| Method | Endpoint | Access | Description | Request Body / Query |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account | `{ name, email, password, role }` |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT | `{ email, password }` |
| `GET` | `/api/auth/me` | Private | Retrieve active authenticated profile | *Bearer Token Header* |

---

### 🎪 Events & AI Copilot (`/api/events`)
| Method | Endpoint | Access | Description | Request Body / Query |
|---|---|---|---|---|
| `GET` | `/api/events` | Public | Fetch all events (supports search & filter) | `?category=Technology&search=Summit` |
| `GET` | `/api/events/:id` | Public | Fetch single event details | None (`:id` param) |
| `GET` | `/api/events/organizer/my-events`| Private (Organizer)| Fetch events owned by authenticated organizer | *Bearer Token Header* |
| `POST` | `/api/events` or `/create` | Private (Organizer)| Create a new event with 6-digit volunteer code | `{ title, description, category, date, venue, ticketPrice, budget, agenda, customFormFields, promotionalCopy }` |
| `PUT` | `/api/events/:id` | Private (Organizer)| Update existing event details | Updated event fields |
| `DELETE`| `/api/events/:id` | Private (Organizer)| Remove event by ID | None (`:id` param) |
| `POST` | `/api/events/copilot` | Private (Organizer)| **Gemini 1.5 AI Event Copilot Blueprint** | `{ theme, targetAudience, budget, venueType }` |
| `GET` | `/api/events/:id/analytics` | Private (Organizer)| Fetch live check-in stats & revenue | None (`:id` param) |
| `GET` | `/api/events/:id/participants`| Private (Organizer)| Fetch registered attendee roster | None (`:id` param) |

---

### 💳 Payments (`/api/payment`)
| Method | Endpoint | Access | Description | Request Body / Query |
|---|---|---|---|---|
| `POST` | `/api/payment/create-order` | Private (Participant)| Create Razorpay order or direct free pass | `{ eventId, customAnswers }` |
| `POST` | `/api/payment/verify` | Private (Participant)| Verify HMAC SHA256 signature & issue pass | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, registrationId }` |

---

### 📲 Digital Passes & Gate Scanner (`/api/pass`)
| Method | Endpoint | Access | Description | Request Body / Query |
|---|---|---|---|---|
| `GET` | `/api/pass/my-passes` | Private (Participant)| Retrieve user's registered passes | *Bearer Token Header* |
| `GET` | `/api/pass/:registrationId/qr` | Public / Private | Fetch fresh 30s Dynamic TOTP QR Code & timer | None (`:registrationId` param) |
| `POST` | `/api/pass/verify-scan` | Private (Volunteer/Org)| Cryptographically verify TOTP scan payload | `{ registrationId, token }` or `{ qrData }` |

---

### 👥 Volunteers (`/api/volunteers`)
| Method | Endpoint | Access | Description | Request Body / Query |
|---|---|---|---|---|
| `POST` | `/api/volunteers/allocate` | Public / Private | **AI Volunteer Headcount Allocation Engine** | `{ totalParticipants, totalVolunteers }` |
| `POST` | `/api/volunteers/link-event`| Private (Volunteer)| Link volunteer to event via 6-digit code | `{ volunteerCode }` |
| `GET` | `/api/volunteers/my-events` | Private (Volunteer)| Fetch events assigned to active volunteer | *Bearer Token Header* |

---

### 📊 Analytics & Reporting (`/api/analytics`)
| Method | Endpoint | Access | Description | Request Body / Query |
|---|---|---|---|---|
| `POST` | `/api/analytics/feedback` | Private (Participant)| Submit star rating & textual review | `{ eventId, rating, reviewText }` |
| `POST` | `/api/analytics/sentiment`| Public / Private | **Gemini AI Attendee Sentiment Analysis** | `{ eventId, customReviews }` |
| `GET` | `/api/analytics/event/:eventId`| Private (Organizer)| Get comprehensive financial & gate metrics | None (`:eventId` param) |
| `GET` | `/api/analytics/export/:eventId`| Private (Organizer)| **1-Click Excel Telemetry Export (`.xlsx`)** | Downloads formatted spreadsheet |

---

## 🛡️ Security & Production Architecture

1. **Anti-Tampering Cryptography**:
   - Dynamic QR codes contain only a lightweight JSON string comprising the registration ID, an ephemeral 6-digit TOTP token, and a timestamp.
   - The private TOTP secret is never exposed to the client or embedded inside the QR payload.
   - Scanning gates recompute the token hash on the server using `otplib` and check against prior check-in records to prevent replay attacks.
2. **Strict Role-Based Access Control (RBAC)**:
   - Dedicated middleware (`protect`, `authorize('Organizer')`, `authorize('Volunteer')`) validates JSON Web Tokens and ensures organizers cannot access or modify events owned by other organizations.
   - Volunteers can only scan tickets for events they are explicitly assigned to via their 6-digit linkage code.
3. **Resilient Dual-Engine Fallbacks**:
   - If MongoDB Atlas is unavailable or network access is firewalled, the server automatically boots an in-memory database engine with seed data.
   - If external Gemini AI quotas are exceeded, an internal heuristic natural language processing engine ensures zero downtime for copilot generation and sentiment analysis.
   - If Razorpay live API keys are not supplied, the payment engine seamlessly engages an instant simulated checkout mode.

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <b>Built with ❤️ for high-impact global conferences and summits.</b><br/>
  <sub>Developed by <a href="https://github.com/prachi01626">Prachi Patel</a></sub>
</div>
