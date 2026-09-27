import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EventProvider, useEvents } from './context/EventContext';
import { DemoRoleBar } from './components/DemoRoleBar';
import { Navbar } from './components/Navbar';
import { DiscoveryLanding } from './pages/DiscoveryLanding';
import { OrganizerDashboard } from './pages/OrganizerDashboard';
import { ParticipantPortal } from './pages/ParticipantPortal';
import { VolunteerScanner } from './pages/VolunteerScanner';

// Modals
import { EventCopilotModal } from './components/EventCopilotModal';
import { VolunteerAllocationModal } from './components/VolunteerAllocationModal';
import { EventRegistrationModal } from './components/EventRegistrationModal';
import { SentimentReportModal } from './components/SentimentReportModal';
import { FeedbackModal } from './components/FeedbackModal';

import { Shield } from 'lucide-react';

const MainLayout = () => {
  const { activeTab } = useEvents();

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-emerald-700 selection:text-white">
      {/* 1. Presentation Demo Role Switcher Bar */}
      <DemoRoleBar />

      {/* 2. Glassmorphism Navigation Bar */}
      <Navbar />

      {/* 3. Main Dynamic Content Portals */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'discovery' && <DiscoveryLanding />}
        {activeTab === 'organizer' && <OrganizerDashboard />}
        {activeTab === 'participant' && <ParticipantPortal />}
        {activeTab === 'volunteer' && <VolunteerScanner />}
      </main>

      {/* 4. Global Interactive Modals */}
      <EventCopilotModal />
      <VolunteerAllocationModal />
      <EventRegistrationModal />
      <SentimentReportModal />
      <FeedbackModal />

      {/* 5. Sage Frosted Footer */}
      <footer className="border-t border-white/60 bg-white/70 backdrop-blur-md py-8 px-4 text-xs text-slate-600 mt-auto shadow-glass">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-black p-0.5 border border-emerald-400/60 overflow-hidden flex items-center justify-center shadow-xs">
              <img src="/logo.png" alt="EventSphere AI" className="w-full h-full object-cover rounded-full" />
            </div>
            <span className="font-extrabold text-slate-900">EventSphere AI</span>
            <span>— Intelligent Digital Infrastructure for End-to-End Event Management</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <Shield className="w-3.5 h-3.5" />
              30s Anti-Proxy Dynamic QR
            </span>
            <span>•</span>
            <span>Gemini AI Copilot</span>
            <span>•</span>
            <span>Razorpay Settled</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <MainLayout />
      </EventProvider>
    </AuthProvider>
  );
}
