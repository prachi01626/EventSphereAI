import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { RoleBadge } from './Badges';
import {
  Compass,
  LayoutDashboard,
  Ticket,
  ScanLine,
  LogOut,
  User,
  LogIn,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { activeTab, setActiveTab } = useEvents();

  // Strict Dynamic Nav Tabs according to user.role from AuthContext
  const getNavItems = () => {
    const homeTab = { id: 'discovery', label: 'Home / Events', icon: Compass };
    const organizerTab = { id: 'organizer', label: 'Organizer Hub', icon: LayoutDashboard };
    const participantTab = { id: 'participant', label: 'My Passes', icon: Ticket };
    const volunteerTab = { id: 'volunteer', label: 'Volunteer Scanner', icon: ScanLine };

    // 1. Unauthenticated Guest: ONLY Home / Events
    if (!isAuthenticated || !user) {
      return [homeTab];
    }

    // 2. Participant: ONLY "Home / Events", "My Passes", and Profile/Logout.
    // HIDE completely: "Organizer Hub" and "Volunteer Scanner".
    if (user.role === 'Participant') {
      return [homeTab, participantTab];
    }

    // 3. Volunteer: ONLY "Home / Events", "Volunteer Scanner", and Profile/Logout.
    // HIDE completely: "Organizer Hub".
    if (user.role === 'Volunteer') {
      return [homeTab, volunteerTab];
    }

    // 4. Organizer: ALL tabs
    if (user.role === 'Organizer') {
      return [homeTab, organizerTab, participantTab, volunteerTab];
    }

    return [homeTab];
  };

  const navItems = getNavItems();

  const handleNavClick = (itemId) => {
    setActiveTab(itemId);
  };

  return (
    <header className="glass-panel border-b border-white/60 sticky top-0 z-40 shadow-glass transform-gpu will-change-transform">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Brand Logo with 3D Glowing Sphere */}
          <div
            onClick={() => setActiveTab('discovery')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-black p-0.5 shadow-lg shadow-emerald-900/30 flex items-center justify-center border-2 border-emerald-400/60 group-hover:scale-105 group-hover:border-emerald-400 transition-all overflow-hidden">
                <img
                  src="/logo.png"
                  alt="EventSphere AI"
                  className="w-full h-full object-cover rounded-full filter drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
                EventSphere<span className="text-emerald-600">.AI</span>
              </span>
              <p className="text-[10px] tracking-wider uppercase text-emerald-800/70 font-bold">
                Intelligent Digital Infrastructure
              </p>
            </div>
          </div>

          {/* Center Navigation Portal Tabs (Dynamically rendered based on user.role) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-white/70 p-1.5 rounded-2xl border border-white/90 shadow-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'forest-pill-active'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-white/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right User & Role Profile or Prominent Sign In */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <RoleBadge role={user?.role} />

                <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-emerald-900/10">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-xs font-bold text-emerald-800 shadow-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-bold text-slate-800 leading-none">
                      {user?.name?.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[120px] mt-0.5">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    setActiveTab('discovery');
                  }}
                  title="Sign Out"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-2 px-5 py-2.5 forest-pill-active rounded-2xl text-xs font-bold shadow-pill transition-all hover:scale-105"
                >
                  <LogIn className="w-4 h-4 text-emerald-300" />
                  <span>Sign In / Register</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-emerald-900/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center gap-1 py-1 px-2 text-xs font-medium ${
                  isActive ? 'text-emerald-800 font-bold' : 'text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
