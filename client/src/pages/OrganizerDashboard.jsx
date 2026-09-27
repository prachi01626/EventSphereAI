import React, { useState, useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import { analyticsService } from '../services/analyticsService';
import { StatusBadge, RoleBadge } from '../components/Badges';
import { formatCurrency, formatDateTime, formatDate } from '../utils/formatters';
import {
  Sparkles,
  Bot,
  Users,
  Download,
  Calendar,
  DollarSign,
  UserCheck,
  Clock,
  PieChart,
  Smile,
  RefreshCw,
  BarChart3,
  TrendingUp,
} from 'lucide-react';

export const OrganizerDashboard = () => {
  const {
    events,
    selectedEvent,
    setSelectedEvent,
    setIsCopilotOpen,
    setIsVolunteerModalOpen,
    setIsSentimentModalOpen,
    openRegisterModal,
  } = useEvents();

  const [statsData, setStatsData] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const activeEvent = selectedEvent || events[0];

  const fetchStats = async () => {
    if (!activeEvent?._id) return;
    setLoadingStats(true);
    try {
      const data = await analyticsService.getEventStats(activeEvent._id);
      setStatsData(data);
    } catch (err) {
      console.error('Failed to load event stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [activeEvent?._id]);

  const metrics = statsData?.metrics || {
    totalRegistrations: 0,
    checkedInCount: 0,
    paidCount: 0,
    totalRevenue: 0,
    attendanceRate: 0,
    avgRating: '5.0',
  };

  const handleExportExcel = () => {
    if (!activeEvent?._id) return;
    const url = analyticsService.getExcelExportUrl(activeEvent._id);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & AI Launch Triggers (Image 1 header style) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/80 shadow-glass">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shadow-xs">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Organizer Mission Control</h1>
          </div>
          <p className="text-xs text-slate-600">
            Real-time gate telemetry, AI volunteer dispatch & dynamic attendance analytics
          </p>
        </div>

        {/* Global Copilot and AI Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 forest-pill-active rounded-2xl text-xs font-bold shadow-pill transition-all hover:scale-105"
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>AI Event Copilot</span>
          </button>

          <button
            onClick={() => setIsVolunteerModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/90 hover:bg-white text-slate-800 border border-emerald-900/15 rounded-2xl text-xs font-bold shadow-xs transition-all hover:scale-105"
          >
            <Users className="w-4 h-4 text-emerald-700" />
            <span>AI Volunteer Allocation</span>
          </button>

          <button
            onClick={() => setIsSentimentModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/90 hover:bg-white text-slate-800 border border-emerald-900/15 rounded-2xl text-xs font-bold shadow-xs transition-all hover:scale-105"
          >
            <Smile className="w-4 h-4 text-amber-600" />
            <span>Gemini Sentiment</span>
          </button>
        </div>
      </div>

      {/* Event Selector Dropdown and Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4 rounded-3xl border border-white/80 shadow-glass">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider shrink-0">
            Active Event:
          </span>
          <select
            value={activeEvent?._id || ''}
            onChange={(e) => {
              const selected = events.find((ev) => ev._id === e.target.value);
              if (selected) setSelectedEvent(selected);
            }}
            className="w-full sm:w-96 bg-white border border-emerald-900/15 rounded-2xl px-4 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-emerald-600 shadow-xs"
          >
            {events.map((ev) => (
              <option key={ev._id} value={ev._id}>
                {ev.title} ({formatDate(ev.date)})
              </option>
            ))}
          </select>
        </div>

        {/* 1-Click Excel Export Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={fetchStats}
            title="Refresh Metrics"
            className="p-2.5 bg-white hover:bg-emerald-50 text-slate-700 rounded-2xl text-xs border border-emerald-900/15 shadow-xs transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-700 ${loadingStats ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-5 py-2.5 forest-pill-active rounded-2xl text-xs font-bold shadow-pill transition-all hover:scale-105"
          >
            <Download className="w-4 h-4 text-emerald-300" />
            <span>1-Click Excel Export</span>
          </button>
        </div>
      </div>

      {/* Metrics Row (Total Overview style matching Image 1 top widgets) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Registrations */}
        <div className="glass-card p-5 rounded-3xl border border-white/80 shadow-glass space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span className="uppercase tracking-wider">Total Registrations</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {metrics.totalRegistrations}
            </span>
            <span className="text-xs text-emerald-700 font-bold">Active Passes</span>
          </div>
          <p className="text-[11px] text-slate-500">Paid: {metrics.paidCount} attendees</p>
        </div>

        {/* Metric 2: Live Gate Check-ins */}
        <div className="glass-card p-5 rounded-3xl border border-white/80 shadow-glass space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span className="uppercase tracking-wider">Gate Check-ins</span>
            <UserCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-800 font-mono">
              {metrics.checkedInCount}
            </span>
            <span className="text-xs text-slate-500">/ {metrics.totalRegistrations}</span>
          </div>
          <p className="text-[11px] text-slate-500">Dynamic QR validated</p>
        </div>

        {/* Metric 3: Attendance Gauge Rate */}
        <div className="glass-card p-5 rounded-3xl border border-white/80 shadow-glass space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span className="uppercase tracking-wider">Attendance Rate</span>
            <PieChart className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {metrics.attendanceRate}%
            </span>
            <span className="text-xs text-emerald-700 font-bold">Conversion</span>
          </div>
          <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
            <div
              style={{ width: `${metrics.attendanceRate}%` }}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full"
            ></div>
          </div>
        </div>

        {/* Metric 4: Revenue & Settlement */}
        <div className="glass-card p-5 rounded-3xl border border-white/80 shadow-glass space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span className="uppercase tracking-wider">Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {formatCurrency(metrics.totalRevenue)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Ticket Price: ₹{activeEvent?.ticketPrice || 0}</p>
        </div>
      </div>

      {/* Two Column Layout matching Image 1: Semi-circular Gauge + Live Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Semi-circular Attendance Gauge (matching Image 1 'Outstanding Invoices' gauge) */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-white/80 shadow-glass space-y-4 text-center">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Gate Flow Gauge</span>
            <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
              Live Real-Time
            </span>
          </div>

          {/* SVG Semi-Circle Arch Gauge */}
          <div className="relative flex flex-col items-center justify-center pt-2">
            <svg viewBox="0 0 160 90" className="w-48 overflow-visible">
              {/* Background Arch */}
              <path
                d="M 20 80 A 60 60 0 0 1 140 80"
                fill="none"
                stroke="#d6e8dc"
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* Progress Arch with Sage Green Gradient */}
              <path
                d="M 20 80 A 60 60 0 0 1 140 80"
                fill="none"
                stroke="#2d5a43"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="188.5"
                strokeDashoffset={188.5 - (188.5 * (metrics.attendanceRate || 10)) / 100}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="mt-[-25px]">
              <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
                Turnstile Progress
              </span>
              <p className="text-2xl font-extrabold text-slate-900 font-mono">
                {metrics.checkedInCount} / {metrics.totalRegistrations}
              </p>
              <p className="text-xs text-emerald-700 font-bold mt-0.5">
                {metrics.attendanceRate}% Gate Admission
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-emerald-900/10 grid grid-cols-2 gap-2 text-left text-xs">
            <div className="p-2.5 bg-emerald-50/70 rounded-2xl border border-emerald-200/50">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Avg Rating</span>
              <p className="text-sm font-bold text-slate-900">⭐ {metrics.avgRating} / 5.0</p>
            </div>
            <div className="p-2.5 bg-emerald-50/70 rounded-2xl border border-emerald-200/50">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Settlement</span>
              <p className="text-sm font-bold text-emerald-800">100% Instant</p>
            </div>
          </div>
        </div>

        {/* Right: Real-time Participant Table */}
        <div className="lg:col-span-8 glass-card rounded-3xl border border-white/80 shadow-glass overflow-hidden">
          <div className="p-6 border-b border-emerald-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Live Attendee Roster</h2>
              <p className="text-xs text-slate-600">
                Verified passes with Anti-Proxy TOTP Dynamic verification status
              </p>
            </div>

            <button
              onClick={() => openRegisterModal(activeEvent)}
              className="px-4 py-2 bg-emerald-100 text-emerald-900 hover:bg-emerald-200 rounded-2xl text-xs font-bold transition-colors shadow-xs"
            >
              + Register Walk-In Attendee
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-emerald-50/80 text-slate-600 uppercase font-bold text-[11px] border-b border-emerald-900/10">
                <tr>
                  <th className="py-3.5 px-6">Reg ID</th>
                  <th className="py-3.5 px-6">Participant</th>
                  <th className="py-3.5 px-6">Payment</th>
                  <th className="py-3.5 px-6">Gate Status</th>
                  <th className="py-3.5 px-6">Check-in Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/10 text-slate-700">
                {!statsData?.registrations || statsData.registrations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                      No registrations recorded for this event yet.
                    </td>
                  </tr>
                ) : (
                  statsData.registrations.map((reg) => (
                    <tr key={reg._id} className="hover:bg-emerald-50/50 transition-colors">
                      <td className="py-3.5 px-6 font-mono text-slate-500 font-semibold">
                        {reg._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="font-bold text-slate-900">
                          {reg.participant?.name || 'Walk-in Attendee'}
                        </div>
                        <div className="text-[11px] text-slate-500">{reg.participant?.email}</div>
                      </td>
                      <td className="py-3.5 px-6">
                        <StatusBadge status={reg.paymentStatus} />
                      </td>
                      <td className="py-3.5 px-6">
                        <StatusBadge
                          status={reg.checkInStatus ? 'Checked In' : 'Not Checked In'}
                        />
                      </td>
                      <td className="py-3.5 px-6 font-mono text-[11px] text-slate-500">
                        {reg.checkInTime ? formatDateTime(reg.checkInTime) : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
