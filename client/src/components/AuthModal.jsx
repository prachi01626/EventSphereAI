import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  UserCheck,
  QrCode,
  ArrowRight,
  AlertCircle,
  Loader2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    authModalInitialRole,
    login,
    register,
    loading: authLoading,
  } = useAuth();

  const { navigateToPortal } = useEvents();

  // Form states
  const [mode, setMode] = useState(authModalMode || 'login');
  const [role, setRole] = useState(authModalInitialRole || 'Participant');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync mode and initial role when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalMode || 'login');
      setRole(authModalInitialRole || 'Participant');
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isAuthModalOpen, authModalMode, authModalInitialRole]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const result = await login(email, password);
        if (result.success) {
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
          setSuccessMessage(`Welcome back, ${result.user.name.split(' ')[0]}! Redirecting...`);
          setTimeout(() => {
            closeAuthModal();
            navigateToPortal(result.user.role);
          }, 800);
        } else {
          setErrorMessage(result.message || 'Invalid credentials');
        }
      } else {
        if (!name.trim()) {
          setErrorMessage('Please enter your full name');
          setIsSubmitting(false);
          return;
        }

        const result = await register({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        });

        if (result.success) {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          setSuccessMessage(`Account created successfully as ${role}! Redirecting...`);
          setTimeout(() => {
            closeAuthModal();
            navigateToPortal(result.user.role);
          }, 900);
        } else {
          setErrorMessage(result.message || 'Registration failed');
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for quick presentation testing against real DB
  const fillQuickAccount = (quickEmail, quickPassword, quickRole) => {
    setEmail(quickEmail);
    setPassword(quickPassword);
    if (quickRole) setRole(quickRole);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/50 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-white/95 p-6 md:p-8 shadow-2xl border border-white text-slate-800 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-900/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {mode === 'login' ? 'Sign In to EventSphere' : 'Create an Account'}
              </h2>
              <p className="text-xs text-slate-500">
                {mode === 'login'
                  ? 'Access your role dashboard and dynamic passes'
                  : 'Join the next-generation event infrastructure'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-2xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle Switch */}
        <div className="mt-5 grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-800 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Elena Rostova"
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs"
                  />
                </div>
              </div>

              {/* Role Selection Cards */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Your Account Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('Participant')}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      role === 'Participant'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 mx-auto mb-1 text-emerald-700" />
                    <span className="text-[11px] block">Participant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('Organizer')}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      role === 'Organizer'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-emerald-700" />
                    <span className="text-[11px] block">Organizer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('Volunteer')}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      role === 'Volunteer'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <QrCode className="w-4 h-4 mx-auto mb-1 text-emerald-700" />
                    <span className="text-[11px] block">Volunteer</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || authLoading}
              className="w-full py-3.5 px-6 forest-pill-active rounded-2xl font-bold text-xs shadow-pill flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
                  <span>Connecting to MongoDB...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'login'
                      ? 'Sign In & Enter Portal'
                      : `Register as ${role}`}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
