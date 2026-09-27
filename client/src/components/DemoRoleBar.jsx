import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { ShieldCheck, UserCheck, QrCode, Sparkles } from 'lucide-react';

export const DemoRoleBar = () => {
  const { user, switchDemoRole } = useAuth();
  const { setActiveTab } = useEvents();

  const handleRoleChange = async (roleName, defaultTab) => {
    await switchDemoRole(roleName);
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  };

  const currentRole = user?.role || 'Participant';

  return (
    <div className="bg-[#1b2b22]/90 border-b border-emerald-900/20 py-2 px-4 backdrop-blur-md sticky top-0 z-50 text-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="font-bold text-emerald-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Live Demo Switcher:
          </span>
          <span className="hidden sm:inline text-emerald-100/70 text-[11px]">
            Instant presentation role switching:
          </span>
        </div>

        <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-emerald-500/20">
          <button
            onClick={() => handleRoleChange('Organizer', 'organizer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentRole === 'Organizer'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Organizer View
          </button>

          <button
            onClick={() => handleRoleChange('Participant', 'participant')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentRole === 'Participant'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Participant Pass
          </button>

          <button
            onClick={() => handleRoleChange('Volunteer', 'volunteer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentRole === 'Volunteer'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            Volunteer Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
