import React from 'react';
import { ShieldCheck, User, Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const RoleBadge = ({ role }) => {
  if (role === 'Organizer') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
        Organizer
      </span>
    );
  }
  if (role === 'Volunteer') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200 shadow-sm">
        <Users className="w-3.5 h-3.5 text-teal-700" />
        Volunteer Marshal
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">
      <User className="w-3.5 h-3.5 text-slate-600" />
      Participant
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  if (status === 'Completed' || status === 'Valid' || status === 'Checked In') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
        {status}
      </span>
    );
  }
  if (status === 'Pending' || status === 'Not Checked In') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
        <Clock className="w-3 h-3 text-amber-700" />
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
      <AlertCircle className="w-3 h-3 text-rose-700" />
      {status}
    </span>
  );
};

export const CategoryBadge = ({ category }) => {
  const colorMap = {
    Technology: 'bg-emerald-100/90 text-emerald-900 border-emerald-300',
    Hackathon: 'bg-teal-100/90 text-teal-900 border-teal-300',
    Creative: 'bg-amber-100/90 text-amber-900 border-amber-300',
    Business: 'bg-slate-200/90 text-slate-800 border-slate-300',
  };

  const style = colorMap[category] || colorMap.Technology;

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold border shadow-xs ${style}`}>
      {category || 'Technology'}
    </span>
  );
};
