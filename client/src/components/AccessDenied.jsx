import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { RoleBadge } from './Badges';
import {
  ShieldAlert,
  ArrowRight,
  Compass,
  Ticket,
  ScanLine,
  LayoutDashboard,
  LogIn,
} from 'lucide-react';

export const AccessDenied = ({ targetResource = 'Organizer Hub', requiredRole = 'Organizer' }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { setActiveTab } = useEvents();

  const getPrimaryAction = () => {
    if (!isAuthenticated) {
      return {
        label: `Sign In as ${requiredRole}`,
        icon: LogIn,
        onClick: () => openAuthModal('login', requiredRole),
      };
    }

    if (user.role === 'Participant') {
      return {
        label: 'Go to My Passes / Participant Portal',
        icon: Ticket,
        onClick: () => setActiveTab('participant'),
      };
    }

    if (user.role === 'Volunteer') {
      return {
        label: 'Go to Volunteer Scanner',
        icon: ScanLine,
        onClick: () => setActiveTab('volunteer'),
      };
    }

    return {
      label: 'Go to Organizer Hub',
      icon: LayoutDashboard,
      onClick: () => setActiveTab('organizer'),
    };
  };

  const action = getPrimaryAction();
  const ActionIcon = action.icon;

  return (
    <div className="py-12 px-4 flex items-center justify-center animate-fadeIn">
      <div className="glass-card max-w-lg w-full p-8 md:p-10 rounded-3xl border border-white/80 shadow-2xl text-center space-y-6">
        {/* Warning Icon with Amber/Rose Aura */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-rose-50 border-2 border-rose-300 flex items-center justify-center text-rose-600 shadow-md">
          <ShieldAlert className="w-10 h-10 animate-pulse" />
          <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-white shadow-xs">
            403
          </span>
        </div>

        {/* Title & Badges */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-rose-700 bg-rose-100/70 border border-rose-200 px-3 py-1 rounded-full">
              Access Denied
            </span>
            {isAuthenticated && <RoleBadge role={user?.role} />}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Restricted Portal Access
          </h1>
        </div>

        {/* Explanation Message */}
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-600 leading-relaxed text-left space-y-2">
          {!isAuthenticated ? (
            <p>
              You attempted to navigate to <strong>{targetResource}</strong> without an active session. Please sign in with an account granted <strong>{requiredRole}</strong> privileges to proceed.
            </p>
          ) : user.role === 'Participant' ? (
            <p>
              Your account is registered as a <strong className="text-emerald-800">Participant</strong>. Participants are strictly authorized for event registration and personal Dynamic Pass management. The <strong>{targetResource}</strong> is restricted to {requiredRole} accounts.
            </p>
          ) : user.role === 'Volunteer' ? (
            <p>
              Your account is registered as a <strong className="text-emerald-800">Volunteer</strong>. Volunteer credentials permit turnstile pass scanning only. <strong>{targetResource}</strong> requires {requiredRole} privileges.
            </p>
          ) : (
            <p>
              Your account role does not have authorization to access <strong>{targetResource}</strong>.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={action.onClick}
            className="w-full py-3.5 px-6 forest-pill-active rounded-2xl font-bold text-xs shadow-pill flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <ActionIcon className="w-4 h-4 text-emerald-300" />
            <span>{action.label}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveTab('discovery')}
            className="w-full py-2.5 px-4 bg-white/90 hover:bg-white text-slate-700 border border-slate-200 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Compass className="w-4 h-4 text-slate-500" />
            <span>Return to Public Home / Events</span>
          </button>
        </div>
      </div>
    </div>
  );
};
