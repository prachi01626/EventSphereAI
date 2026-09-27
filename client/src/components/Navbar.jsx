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
} from 'lucide-react';

export const Navbar = () => {
  const { user, role, logout } = useAuth();
  const { activeTab, setActiveTab } = useEvents();

  const navItems = [
    { id: 'discovery', label: 'Discovery', icon: Compass },
    { id: 'organizer', label: 'Organizer Hub', icon: LayoutDashboard },
    { id: 'participant', label: 'Digital Passes', icon: Ticket },
    { id: 'volunteer', label: 'Volunteer Scanner', icon: ScanLine },
  ];

  return (
    <header className="glass-panel border-b border-white/60 sticky top-0 z-40 shadow-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Brand Logo with 3D Glowing Sphere from Image 2 */}
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

          {/* Center Navigation Portal Tabs (Matching pill bar from Image 1) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-white/70 p-1.5 rounded-2xl border border-white/90 shadow-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${isActive
                      ? 'forest-pill-active'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-white/80'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right User & Role Profile (Matching Avatar widget from Image 1) */}
          <div className="flex items-center gap-3">
            <RoleBadge role={role} />

            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-emerald-900/10">
              <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-xs font-bold text-emerald-800 shadow-sm">
                {user?.name ? user.name.charAt(0) : <User className="w-4 h-4" />}
              </div>
              <div className="text-left text-xs">
                <p className="font-bold text-slate-800 leading-none">
                  {user?.name?.split(' ')[0] || 'Guest'}
                </p>
                <p className="text-[10px] text-slate-500 truncate max-w-[120px] mt-0.5">
                  {user?.email || 'eventsphere.ai'}
                </p>
              </div>
            </div>

            {user && (
              <button
                onClick={logout}
                title="Logout"
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
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
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 py-1 px-2 text-xs font-medium ${isActive ? 'text-emerald-800 font-bold' : 'text-slate-500'
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
