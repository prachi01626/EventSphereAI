import React, { useState, useEffect, useRef } from 'react';
import { passService } from '../services/passService';
import { StatusBadge, CategoryBadge } from './Badges';
import { formatDateTime, formatDate } from '../utils/formatters';
import {
  RefreshCw,
  Calendar,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Lock,
} from 'lucide-react';

export const PassCard = ({ registration, onRefreshAll }) => {
  const [qrData, setQrData] = useState(null);
  const [loadingQr, setLoadingQr] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const timerRef = useRef(null);

  const registrationId = registration._id;

  const fetchPassQR = async () => {
    setLoadingQr(true);
    try {
      const data = await passService.getDynamicQR(registrationId);
      setQrData(data);
      setTimeLeft(data.expiresIn || 30);
    } catch (err) {
      console.error('Failed to load pass QR:', err);
    } finally {
      setLoadingQr(false);
    }
  };

  useEffect(() => {
    fetchPassQR();
  }, [registrationId]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          fetchPassQR();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [registrationId]);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const event = registration.event || {};
  const participant = registration.participant || {};

  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 30) * circumference;

  const isUrgent = timeLeft <= 8;

  return (
    <div className="relative max-w-md mx-auto w-full rounded-3xl overflow-hidden glass-card border border-white/90 shadow-glass-hover bg-white/90">
      {/* Top Banner with 3D Logo from Image 2 */}
      <div className="bg-gradient-to-r from-[#24352b] via-[#1b2b22] to-[#2d4536] px-6 py-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-black p-0.5 flex items-center justify-center border-2 border-emerald-400/60 overflow-hidden shadow-sm">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm tracking-wide text-white">EVENTSPHERE PASS</h3>
            <p className="text-[10px] text-emerald-300 font-mono">DYNAMIC TOTP VERIFIED</p>
          </div>
        </div>
        <StatusBadge status={registration.checkInStatus ? 'Checked In' : 'Valid'} />
      </div>

      {/* Main Pass Body */}
      <div className="p-6 space-y-5">
        {/* Event Details */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <CategoryBadge category={event.category} />
            <span className="text-[11px] font-mono text-slate-500 font-semibold">
              Pass #{registrationId?.slice(-6).toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 leading-tight">
            {event.title || 'Special Conference'}
          </h2>
          <div className="mt-2.5 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="truncate">{event.venue || 'Hybrid Virtual & Physical Stage'}</span>
            </div>
          </div>
        </div>

        {/* Attendee Profile Section */}
        <div className="flex items-center justify-between bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {participant.name ? participant.name.charAt(0) : 'A'}
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900">{participant.name || 'Registered Guest'}</p>
              <p className="text-xs text-slate-500 truncate max-w-[170px]">{participant.email}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-semibold">Tier</span>
            <span className="text-xs font-extrabold text-emerald-800">VIP Access</span>
          </div>
        </div>

        {/* Perforated Ticket Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="absolute -left-9 w-6 h-6 rounded-full bg-[#dbe8e0] border-r border-emerald-300"></div>
          <div className="w-full border-t-2 border-dashed border-emerald-200"></div>
          <div className="absolute -right-9 w-6 h-6 rounded-full bg-[#dbe8e0] border-l border-emerald-300"></div>
        </div>

        {/* Dynamic 30-Second QR Section */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative p-3 bg-white rounded-3xl shadow-md border-2 border-emerald-500/30">
            {loadingQr ? (
              <div className="w-52 h-52 flex flex-col items-center justify-center bg-slate-50 rounded-2xl gap-2">
                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                <span className="text-xs font-semibold text-slate-600">Generating Secure QR...</span>
              </div>
            ) : qrData?.qrCodeDataUrl ? (
              <div className="relative">
                <img
                  src={qrData.qrCodeDataUrl}
                  alt="Dynamic Pass QR Code"
                  className="w-52 h-52 object-contain rounded-xl"
                />
                {registration.checkInStatus && (
                  <div className="absolute inset-0 bg-emerald-950/85 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center text-emerald-200 p-2">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-1" />
                    <span className="font-extrabold text-sm text-white">Checked In</span>
                    <span className="text-[10px] text-emerald-300">
                      {formatDateTime(registration.checkInTime || qrData.checkInTime)}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-52 h-52 flex items-center justify-center bg-slate-100 rounded-xl text-slate-500 text-xs font-medium">
                QR Unavailable
              </div>
            )}
          </div>

          {/* Dynamic 30s Countdown Ring & Token Display */}
          <div className="flex items-center justify-center gap-4 w-full px-2">
            {/* SVG Circular Timer */}
            <div className="relative flex items-center justify-center w-14 h-14">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="3.5"
                  className="text-slate-200"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className={`transition-all duration-1000 ${
                    isUrgent ? 'text-rose-500' : 'text-emerald-700'
                  }`}
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-xs font-extrabold font-mono ${isUrgent ? 'text-rose-600 animate-pulse' : 'text-slate-800'}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>

            {/* TOTP Live Token */}
            <div className="text-left flex-1 bg-emerald-50/90 px-4 py-2 rounded-2xl border border-emerald-200/60">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-600 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-700" />
                  Live Token:
                </span>
                <button
                  onClick={() => copyToClipboard(qrData?.token || '', 'token')}
                  className="text-slate-500 hover:text-emerald-700 transition-colors"
                  title="Copy Token"
                >
                  {copiedToken ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-sm font-mono font-extrabold tracking-widest text-emerald-900">
                {qrData?.token || '••••••'}
              </p>
            </div>

            {/* Manual refresh button */}
            <button
              onClick={fetchPassQR}
              disabled={loadingQr}
              title="Force Refresh Dynamic QR"
              className="p-3 bg-white hover:bg-emerald-50 text-slate-700 rounded-2xl border border-emerald-900/15 shadow-xs transition-all hover:scale-105 active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-800 ${loadingQr ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Anti-Proxy Notice */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-emerald-50/80 py-1.5 px-3 rounded-xl border border-emerald-200/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>Anti-Proxy Active: QR regenerates every 30s to prevent screenshot fraud.</span>
          </div>
        </div>

        {/* Bottom Registration Meta */}
        <div className="pt-3 border-t border-emerald-900/10 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1 font-mono">
            <span>ID: {registrationId}</span>
            <button
              onClick={() => copyToClipboard(registrationId, 'id')}
              className="hover:text-slate-900"
            >
              {copiedId ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <span className="font-bold text-emerald-800">Payment: Verified</span>
        </div>
      </div>
    </div>
  );
};
