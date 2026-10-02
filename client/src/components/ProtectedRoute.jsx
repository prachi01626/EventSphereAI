import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AccessDenied } from './AccessDenied';

/**
 * ProtectedRoute component that enforces RBAC and session verification.
 * Prevents the "Restricted Access" / AccessDenied flash on page refresh
 * by displaying a sleek dual-glowing spinner while loading session state.
 */
export const ProtectedRoute = ({
  children,
  requiredRole,
  targetResource = 'Protected Portal',
  fallback,
  transparent = false,
  className = '',
}) => {
  // 1. Destructure loading, user, and isAuthenticated from useAuth()
  const { user, isAuthenticated, loading } = useAuth();

  // 2. While loading is true, immediately return centered loading UI with pastel green website theme
  if (loading) {
    const loadingCard = (
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/80 shadow-glass flex flex-col items-center justify-center space-y-5 max-w-sm w-full mx-4 animate-fadeIn">
        <div className="relative flex items-center justify-center">
          {/* Ambient Pastel Emerald/Sage Glow Blur */}
          <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-400/40 via-teal-300/30 to-sage-400/40 blur-xl animate-pulse" />

          {/* Outer animated spinner (Pastel Emerald accent with glow) */}
          <div className="w-16 h-16 rounded-full border-4 border-emerald-600/20 border-t-emerald-600 border-r-emerald-500 animate-spin shadow-[0_0_20px_rgba(16,185,129,0.35)]" />

          {/* Inner counter-spinning glowing ring (Pastel Mint/Teal accent) */}
          <div
            className="absolute w-10 h-10 rounded-full border-4 border-teal-600/20 border-b-teal-600 border-l-emerald-500 animate-spin shadow-[0_0_15px_rgba(20,184,166,0.3)]"
            style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}
          />

          {/* Center glowing core dot in emerald */}
          <div className="absolute w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-ping" />
        </div>

        {/* Brand & Pulsing Text */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/90 border border-emerald-300/80 text-[11px] font-extrabold text-emerald-900 uppercase tracking-widest shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            EventSphere AI
          </div>
          <p className="text-sm font-bold text-slate-800 animate-pulse tracking-wide pt-1">
            Verifying EventSphere session...
          </p>
          <p className="text-xs text-slate-600 font-medium">
            Synchronizing cryptographic pass tokens
          </p>
        </div>
      </div>
    );

    if (transparent) {
      return (
        <div
          className={`flex flex-col items-center justify-center min-h-[60vh] w-full bg-transparent text-slate-800 transition-opacity duration-300 ease-in-out ${className}`}
        >
          {loadingCard}
        </div>
      );
    }

    return (
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center min-h-screen text-slate-800 transition-opacity duration-300 ease-in-out ${className}`}
        style={{
          backgroundColor: '#dbe8e0',
          backgroundImage: `
            radial-gradient(at 10% 20%, rgba(126, 178, 150, 0.45) 0px, transparent 50%),
            radial-gradient(at 90% 15%, rgba(94, 148, 120, 0.4) 0px, transparent 50%),
            radial-gradient(at 35% 65%, rgba(68, 115, 91, 0.35) 0px, transparent 50%),
            radial-gradient(at 85% 85%, rgba(162, 204, 182, 0.5) 0px, transparent 50%),
            radial-gradient(at 50% 50%, rgba(220, 238, 228, 0.6) 0px, transparent 60%)
          `,
        }}
      >
        {loadingCard}
      </div>
    );
  }

  // 3. Ensure that "Restricted Access" only happens AFTER loading is set to false
  if (!isAuthenticated || !user) {
    if (fallback) return fallback;
    const defaultRole = Array.isArray(requiredRole) ? requiredRole[0] : (requiredRole || 'Authorized User');
    return (
      <AccessDenied
        targetResource={targetResource}
        requiredRole={defaultRole}
      />
    );
  }

  // Check role authorization if requiredRole is specified
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const isAuthorized = roles.includes(user.role);

    if (!isAuthorized) {
      if (fallback) return fallback;
      return (
        <AccessDenied
          targetResource={targetResource}
          requiredRole={roles.join(' or ')}
        />
      );
    }
  }

  // Session verified and user is authorized
  return <>{children}</>;
};

export default ProtectedRoute;
