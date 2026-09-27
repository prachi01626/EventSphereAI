import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { CategoryBadge } from '../components/Badges';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Sparkles,
  Search,
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bot,
  QrCode,
  CreditCard,
  MessageSquare,
} from 'lucide-react';

export const DiscoveryLanding = () => {
  const { events, loadingEvents, openRegisterModal, openFeedbackModal, setActiveTab } = useEvents();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Technology', 'Hackathon', 'Creative', 'Business'];

  const filteredEvents = events.filter((ev) => {
    const matchesCategory = selectedCategory === 'All' || ev.category === selectedCategory;
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section matching Image 1 & Image 2 */}
      <section className="relative overflow-hidden pt-10 pb-12 px-6 sm:px-10 rounded-3xl glass-panel text-center shadow-glass">
        {/* Ambient foliage glow */}
        <div className="absolute top-0 right-10 w-80 h-80 bg-emerald-300/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          {/* Glowing 3D Logo Presentation Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/95 border border-emerald-300 shadow-md">
            <div className="w-8 h-8 rounded-full bg-black p-0.5 border border-emerald-400/60 overflow-hidden flex items-center justify-center shadow-xs">
              <img src="/logo.png" alt="EventSphere AI" className="w-full h-full object-cover rounded-full" />
            </div>
            <span className="text-xs font-extrabold text-emerald-950 tracking-wide">
              EventSphere AI • Intelligent Orchestration
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Unified Digital Infrastructure for{' '}
            <span className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-600 bg-clip-text text-transparent">
              Modern Events
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-700 max-w-2xl mx-auto leading-relaxed">
            Eliminate gate friction with <strong className="text-emerald-900 font-bold">30-Second Dynamic Anti-Proxy Passes</strong>,
            streamline setup using <strong className="text-emerald-900 font-bold">Gemini AI Copilot</strong>, and settle seamless registrations with{' '}
            <strong className="text-emerald-900 font-bold">Razorpay</strong>.
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => {
                if (isAuthenticated && user?.role === 'Organizer') {
                  setActiveTab('organizer');
                } else {
                  openAuthModal('login', 'Organizer');
                }
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl forest-pill-active font-bold text-xs shadow-pill transition-all hover:scale-105"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              Organizer AI Hub
            </button>

            <button
              onClick={() => {
                if (isAuthenticated && (user?.role === 'Volunteer' || user?.role === 'Organizer')) {
                  setActiveTab('volunteer');
                } else {
                  openAuthModal('login', 'Volunteer');
                }
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/90 hover:bg-white text-slate-800 border border-emerald-900/15 font-bold text-xs shadow-sm transition-all hover:scale-105"
            >
              <QrCode className="w-4 h-4 text-emerald-700" />
              Launch Volunteer Scanner
            </button>
          </div>

          {/* Feature Highlights Pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 text-xs font-semibold text-slate-700">
            <div className="flex items-center justify-center gap-2 p-3 bg-white/80 rounded-2xl border border-emerald-900/10 shadow-xs">
              <QrCode className="w-4 h-4 text-emerald-700" />
              <span>30s Dynamic QR Pass</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-white/80 rounded-2xl border border-emerald-900/10 shadow-xs">
              <Bot className="w-4 h-4 text-emerald-700" />
              <span>Gemini 1.5 Copilot</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-white/80 rounded-2xl border border-emerald-900/10 shadow-xs">
              <CreditCard className="w-4 h-4 text-emerald-700" />
              <span>Razorpay Verified</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-white/80 rounded-2xl border border-emerald-900/10 shadow-xs">
              <Zap className="w-4 h-4 text-emerald-700" />
              <span>1-Click Excel Telemetry</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Events Schedule</h2>
            <p className="text-xs text-slate-600">
              Discover industry summits, hackathons, and spatial design workshops
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Box */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search event title, venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/90 border border-emerald-900/15 rounded-2xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs"
              />
            </div>

            {/* Category Pills (matching Image 1 pill bar) */}
            <div className="flex items-center gap-1 bg-white/70 p-1.5 rounded-2xl border border-white/90 shadow-sm overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'forest-pill-active'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {loadingEvents ? (
          <div className="py-20 text-center text-slate-500 text-xs">
            Loading scheduled events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-16 text-center text-slate-600 text-xs glass-card rounded-3xl border border-white/80">
            No events match your search criteria. Try selecting "All" or a different keyword.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((ev) => (
              <div
                key={ev._id}
                className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between space-y-4 group border border-white/80 shadow-glass"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <CategoryBadge category={ev.category} />
                    <span className="text-sm font-extrabold text-emerald-800">
                      {formatCurrency(ev.ticketPrice)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                    {ev.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-emerald-900/10">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{formatDate(ev.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">{ev.venue}</span>
                    </div>
                  </div>

                  {/* Agenda snippet */}
                  {ev.agenda && ev.agenda.length > 0 && (
                    <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200/50 text-[11px] space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block">
                        Featured Keynote:
                      </span>
                      <p className="text-slate-800 truncate font-semibold">{ev.agenda[0]?.topic}</p>
                      <p className="text-slate-500 text-[10px] truncate">{ev.agenda[0]?.speaker}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => openRegisterModal(ev)}
                    className="flex-1 py-2.5 px-4 forest-pill-active rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
                  >
                    <span>Register Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => openFeedbackModal(ev)}
                    title="Write Attendee Review"
                    className="p-2.5 bg-white hover:bg-emerald-50 text-slate-700 rounded-xl text-xs border border-emerald-900/15 shadow-xs transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-700" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
