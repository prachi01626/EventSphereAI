import React, { useState, useEffect } from 'react';
import { passService } from '../services/passService';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { PassCard } from '../components/PassCard';
import { formatDate } from '../utils/formatters';
import {
  Ticket,
  Calendar,
  Sparkles,
  MessageSquare,
  RefreshCw,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';

export const ParticipantPortal = () => {
  const { user } = useAuth();
  const { setActiveTab, openFeedbackModal } = useEvents();

  const [passes, setPasses] = useState([]);
  const [selectedPass, setSelectedPass] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPasses = async () => {
    setLoading(true);
    try {
      const data = await passService.getMyPasses();
      setPasses(data);
      if (data.length > 0) {
        setSelectedPass(data[0]);
      }
    } catch (err) {
      console.error('Failed to load my passes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasses();
  }, [user]);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-white/80 shadow-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shadow-xs">
              <Ticket className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Attendee Digital Pass Vault</h1>
          </div>
          <p className="text-xs text-slate-600">
            Encrypted 30-Second TOTP Dynamic Passes with hardware-synced anti-proxy protection
          </p>
        </div>

        <button
          onClick={() => setActiveTab('discovery')}
          className="flex items-center gap-2 px-5 py-2.5 forest-pill-active rounded-2xl text-xs font-bold shadow-pill transition-all hover:scale-105"
        >
          <PlusCircle className="w-4 h-4 text-emerald-300" />
          <span>Discover More Events</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-700 animate-spin mx-auto" />
          <p className="text-xs text-slate-600 font-semibold">Decrypting your Dynamic Passes...</p>
        </div>
      ) : passes.length === 0 ? (
        <div className="glass-card py-16 px-6 rounded-3xl border border-white/80 text-center max-w-lg mx-auto space-y-4 shadow-glass">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Active Passes Found</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            You haven't claimed any event passes yet. Browse upcoming summits and conferences to
            generate your personalized dynamic QR pass.
          </p>
          <button
            onClick={() => setActiveTab('discovery')}
            className="px-6 py-2.5 forest-pill-active rounded-2xl text-xs font-bold shadow-pill"
          >
            Explore Events Now →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Pass Selector & Meta */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              Your Registered Passes ({passes.length})
            </h2>

            <div className="space-y-3">
              {passes.map((p) => {
                const isSelected = selectedPass?._id === p._id;
                return (
                  <div
                    key={p._id}
                    onClick={() => setSelectedPass(p)}
                    className={`cursor-pointer p-4 rounded-3xl border transition-all ${
                      isSelected
                        ? 'bg-white/95 border-emerald-600/70 shadow-glass-hover scale-[1.01]'
                        : 'glass-card border-white/80 hover:bg-white/90 shadow-glass'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500">
                        #{p._id.slice(-6).toUpperCase()}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          p.checkInStatus
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {p.checkInStatus ? 'Checked In' : 'Active Pass'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                      {p.event?.title || 'Summit Event'}
                    </h3>

                    <div className="mt-2.5 flex items-center justify-between text-xs text-slate-600">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                        {formatDate(p.event?.date)}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (p.event) openFeedbackModal(p.event);
                        }}
                        className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Review</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Instruction Card */}
            <div className="p-4 rounded-3xl bg-white/70 border border-white/90 shadow-glass text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Gate Presentation Guidelines</span>
              </div>
              <p className="leading-relaxed">
                Keep this screen open when approaching the entry turnstiles. The volunteer gate marshal
                will scan the dynamic QR code directly from your smartphone display.
              </p>
            </div>
          </div>

          {/* Right Column: Active PassCard Render */}
          <div className="lg:col-span-7 flex justify-center">
            {selectedPass && <PassCard registration={selectedPass} onRefreshAll={fetchPasses} />}
          </div>
        </div>
      )}
    </div>
  );
};
